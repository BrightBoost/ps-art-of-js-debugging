import express from 'express';
import * as data from '../data.js';
import { topSkills, toCsv } from '../stats.js';
import { readSurvey } from '../survey.js';
import { requireLogin, requireAdmin } from '../auth.js';

export const adminRouter = express.Router();

adminRouter.use(requireLogin, requireAdmin);

// Get all users (without passwords)
adminRouter.get('/users', async (req, res) => {
    const users = await data.getAllUsers();
    res.json({
        status: 'success',
        users: users.map(({ password, ...user }) => user),
    });
});

// Add a new user
adminRouter.post('/users', async (req, res) => {
    const { username, password } = req.body ?? {};
    if (!username || !password) {
        return res.status(400).json({ status: 'fail', message: 'username and password are required' });
    }
    const { password: _, ...newUser } = await data.addUser(username, password);
    res.status(201).json({ status: 'success', user: newUser });
});

// Remove a user
adminRouter.delete('/users/:userId', async (req, res) => {
    await data.removeUser(Number(req.params.userId));
    res.json({ status: 'success' });
});

// The most common skills in the team
adminRouter.get('/top-skills', async (req, res) => {
    const users = await data.getAllUsers();
    res.json({ status: 'success', topSkills: topSkills(users) });
});

// Average levels from the team survey (CSV export)
adminRouter.get('/survey', async (req, res) => {
    res.json({ status: 'success', results: await readSurvey() });
});

// Download all skills as CSV
adminRouter.get('/export', async (req, res) => {
    const users = await data.getAllUsers();
    res.type('text/csv').attachment('skills.csv').send(toCsv(users));
});
