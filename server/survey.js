import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const surveyFile = fileURLToPath(new URL('../data/import/team-survey.csv', import.meta.url));

/**
 * Turn a level from the survey into a number.
 * People filled this in by hand, so we see things like "4,5" (Dutch decimal comma).
 * @param {string} text
 */
export function parseLevel(text) {
    return Number(text.trim());
}

/**
 * Average self-assessed level per skill, based on the team survey export.
 * @param {string} csv
 */
export function averageLevels(csv) {
    const rows = csv.trim().split('\n').slice(1);
    /** @type {Record<string, { total: number, answers: number }>} */
    const totals = {};

    for (const row of rows) {
        const [, skill, levelText] = row.split(';');
        const level = parseLevel(levelText);
        totals[skill] ??= { total: 0, answers: 0 };
        totals[skill].total += level;
        totals[skill].answers++;
    }

    return Object.entries(totals)
        .map(([skill, { total, answers }]) => ({
            skill,
            answers,
            average: Math.round((total / answers) * 10) / 10,
        }))
        .sort((a, b) => a.skill.localeCompare(b.skill));
}

export async function readSurvey() {
    return averageLevels(await readFile(surveyFile, 'utf8'));
}
