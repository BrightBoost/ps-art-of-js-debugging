import { test } from 'node:test';
import assert from 'node:assert/strict';
import { topSkills, summarizeSkills } from '../server/stats.js';
import { averageLevels } from '../server/survey.js';

/** @param {string} username @param {string[]} skillNames */
const user = (username, skillNames) => ({
    id: 0, username, password: '', isAdmin: false,
    skills: skillNames.map((name) => ({ name, level: 3, category: 'Other' })),
});

test('topSkills ranks skills by the number of people who have them', () => {
    const users = [user('a', ['Git', 'CSS', 'SQL']), user('b', ['Git', 'CSS']), user('c', ['Git'])];
    assert.deepEqual(topSkills(users, 2), [
        { name: 'Git', people: 3 },
        { name: 'CSS', people: 2 },
    ]);
});

test('topSkills keeps skills that tie with the last place', () => {
    const users = [
        user('a', ['Git', 'CSS', 'SQL', 'Docker']),
        user('b', ['Git', 'CSS', 'SQL', 'Docker']),
        user('c', ['Git']),
    ];
    assert.deepEqual(topSkills(users, 2), [
        { name: 'Git', people: 3 },
        { name: 'CSS', people: 2 },
        { name: 'Docker', people: 2 },
        { name: 'SQL', people: 2 },
    ]);
});

test('summarizeSkills counts level 5 as expert', () => {
    const skills = [{ name: 'Git', level: 5, category: 'Tools' }, { name: 'CSS', level: 3, category: 'Frontend' }];
    assert.deepEqual(summarizeSkills(skills), { total: 2, experts: 1 });
});

test('averageLevels understands a decimal comma', () => {
    const csv = 'respondent;skill;level\nR1;Git;4\nR2;Git;4,5\n';
    assert.deepEqual(averageLevels(csv), [{ skill: 'Git', answers: 2, average: 4.3 }]);
});
