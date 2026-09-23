import express from 'express';
import * as data from '../data.js';
import { summarizeSkills } from '../stats.js';
import { requireLogin, currentUserId } from '../auth.js';

export const userRouter = express.Router();

// User login
userRouter.post('/login', async (req, res) => {
    const { username, password } = req.body ?? {};
    // Not how you would do this in a real environment!
    const user = await data.getUser(username, password);
    if (!user) {
        return res.status(401).json({ status: 'fail', message: 'Invalid username or password' });
    }
    req.session.userId = user.id;
    const { password: _, ...safeUser } = user;
    res.json({ status: 'success', user: safeUser });
});

// User logout
userRouter.post('/logout', (req, res) => {
    req.session.destroy(() => {
        res.json({ status: 'success', message: 'Logged out successfully' });
    });
});

// Get the skills of the logged-in user
userRouter.get('/skills', requireLogin, async (req, res) => {
    const skills = await data.getSkills(currentUserId(req));
    res.json({ status: 'success', data: skills });
});

// Short summary for the top of the skills page
userRouter.get('/skills/summary', requireLogin, async (req, res) => {
    const skills = (await data.getSkills(currentUserId(req))) ?? [];
    res.json({ status: 'success', summary: summarizeSkills(skills) });
});

// Add a skill to the logged-in user
userRouter.post('/skills', requireLogin, async (req, res) => {
    const { name, level, category } = req.body ?? {};
    if (!name) {
        return res.status(400).json({ status: 'fail', message: 'name is required' });
    }
    const numericLevel = Number(level);
    if (!Number.isInteger(numericLevel) || numericLevel < 1 || numericLevel > 5) {
        return res.status(400).json({ status: 'fail', message: 'level must be a whole number from 1 to 5' });
    }
    await data.addSkill(currentUserId(req), { name, level: numericLevel, category: category || 'Other' });
    res.status(201).json({ status: 'success', message: 'Skill added successfully' });
});

// Change the level of one skill
userRouter.put('/skills/:name', requireLogin, async (req, res) => {
    const level = Number(req.body?.level);
    if (!Number.isInteger(level) || level < 1 || level > 5) {
        return res.status(400).json({ status: 'fail', message: `level for ${req.params.name} must be from 1 to 5` });
    }
    const skill = await data.updateSkillLevel(currentUserId(req), String(req.params.name), level);
    if (!skill) {
        return res.status(404).json({ status: 'fail', message: 'Skill not found' });
    }
    res.json({ status: 'success', skill });
});

// Remove a skill from the logged-in user
userRouter.delete('/skills/:name', requireLogin, async (req, res) => {
    await data.removeSkill(currentUserId(req), String(req.params.name));
    res.json({ status: 'success' });
});
