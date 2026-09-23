import { readFile, writeFile, mkdir, copyFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

// We don't use a real database: all data lives in a JSON file.
// That keeps the app easy to run and easy to follow along with.
const usersFile = fileURLToPath(new URL('../data/users.json', import.meta.url));
const nextIdFile = fileURLToPath(new URL('../data/nextId.json', import.meta.url));
const backupDir = fileURLToPath(new URL('../data/backup/', import.meta.url));

/**
 * @typedef {{ name: string, level: number, category: string }} Skill
 * @typedef {{ id: number, username: string, password: string, isAdmin: boolean, skills: Skill[] }} User
 */

let userCount = 0;

/** Read the data file once at startup, so we fail fast if something is off. */
export async function initStore() {
    const data = await readUsersData();
    if (data.users) {
        userCount = data.users.length;
    }
    console.log(`Loaded ${userCount} users`);
}

/**
 * Older skills were saved with "group" instead of "category".
 * Normalize them when reading, so the rest of the app only sees one shape.
 * @param {any} skill
 * @returns {Skill}
 */
function normalizeSkill(skill) {
    return {
        name: skill.name,
        level: skill.level,
        category: skill.category ?? skill.group ?? 'Other',
    };
}

/** @returns {Promise<{ users: User[] }>} */
async function readUsersData() {
    const raw = await readFile(usersFile, 'utf8');
    const data = JSON.parse(raw);
    data.users = data.users.map((/** @type {any} */ user) => ({
        ...user,
        skills: user.skills.map(normalizeSkill),
    }));
    return data;
}

/** @param {{ users: User[] }} data */
async function writeUsersData(data) {
    await writeFile(usersFile, JSON.stringify(data, null, 2));
    await backupUsersData();
}

async function backupUsersData() {
    await mkdir(backupDir, { recursive: true });
    await copyFile(usersFile, `${backupDir}users-${Date.now()}.json`);
}

// Every change is "read the file, change it, write it back".
/**
 * @template T
 * @param {(data: { users: User[] }) => T | Promise<T>} change
 * @returns {Promise<T>}
 */
async function updateUsersData(change) {
    const data = await readUsersData();
    const result = await change(data);
    await writeUsersData(data);
    return result;
}

export async function getAllUsers() {
    const data = await readUsersData();
    return data.users;
}

async function getNextUserId() {
    const nextIdData = JSON.parse(await readFile(nextIdFile, 'utf8'));
    const id = nextIdData.userId++;
    await writeFile(nextIdFile, JSON.stringify(nextIdData));
    return id;
}

/**
 * @param {string} username
 * @param {string} password
 */
export async function addUser(username, password, isAdmin = false) {
    const id = await getNextUserId();
    return updateUsersData((data) => {
        /** @type {User} */
        const newUser = { id, username, password, isAdmin, skills: [] };
        data.users.push(newUser);
        return newUser;
    });
}

/** @param {number} userId */
export async function removeUser(userId) {
    return updateUsersData((data) => {
        data.users = data.users.filter((user) => user.id !== userId);
    });
}

/**
 * Not how you would do this in a real application!
 * @param {string} username
 * @param {string} password
 */
export async function getUser(username, password) {
    const data = await readUsersData();
    return data.users.find((user) => user.username === username && user.password === password);
}

/** @param {number} userId */
export async function getSkills(userId) {
    const data = await readUsersData();
    const user = data.users.find((user) => user.id === userId);
    return user ? user.skills : null;
}

/**
 * @param {number} userId
 * @param {Skill} skill
 */
export async function addSkill(userId, skill) {
    return updateUsersData((data) => {
        const user = data.users.find((user) => user.id === userId);
        if (user) {
            user.skills.push(skill);
        }
        return user;
    });
}

/**
 * @param {number} userId
 * @param {string} skillName
 * @param {number} level
 */
export async function updateSkillLevel(userId, skillName, level) {
    return updateUsersData((data) => {
        const skill = data.users
            .find((user) => user.id === userId)
            ?.skills.find((skill) => skill.name === skillName);
        if (skill) {
            skill.level = level;
        }
        return skill;
    });
}

/**
 * @param {number} userId
 * @param {string} skillName
 */
export async function removeSkill(userId, skillName) {
    return updateUsersData((data) => {
        const user = data.users.find((user) => user.id === userId);
        if (user) {
            user.skills = user.skills.filter((skill) => skill.name !== skillName);
        }
    });
}
