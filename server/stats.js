/** @typedef {import('./data.js').Skill} Skill */
/** @typedef {import('./data.js').User} User */

export const EXPERT_LEVEL = 5;

/**
 * Summary shown at the top of "My skills".
 * @param {Skill[]} skills
 */
export function summarizeSkills(skills) {
    return {
        total: skills.length,
        experts: skills.filter((skill) => skill.level === EXPERT_LEVEL).length,
    };
}

/**
 * The most common skills in the team.
 * Intended rule: return the top `count` places. Skills that tie with the
 * last place are included too, so nobody drops off the list at random.
 * @param {User[]} users
 * @returns {{ name: string, people: number }[]}
 */
export function topSkills(users, count = 3) {
    /** @type {Map<string, number>} */
    const counts = new Map();
    for (const user of users) {
        for (const skill of user.skills) {
            counts.set(skill.name, (counts.get(skill.name) ?? 0) + 1);
        }
    }

    const ranked = [...counts]
        .map(([name, people]) => ({ name, people }))
        .sort((a, b) => b.people - a.people || a.name.localeCompare(b.name));

    return ranked.slice(0, count);
}

/**
 * @param {User[]} users
 */
export function toCsv(users) {
    const lines = ['username,skill,level,category'];
    for (const user of users) {
        for (const skill of user.skills) {
            lines.push(`${user.username},${skill.name},${skill.level},${skill.category.toUpperCase()}`);
        }
    }
    return lines.join('\n');
}
