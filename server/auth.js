import * as data from './data.js';

/** @type {import('express').RequestHandler} */
export function requireLogin(req, res, next) {
    if (!req.session.userId) {
        return res.status(401).json({ status: 'fail', message: 'Please log in first' });
    }
    next();
}

/** @type {import('express').RequestHandler} */
export async function requireAdmin(req, res, next) {
    const users = await data.getAllUsers();
    const user = users.find((user) => user.id === req.session.userId);
    if (!user?.isAdmin) {
        return res.status(403).json({ status: 'fail', message: 'You need admin rights' });
    }
    next();
}

/**
 * The id of the logged-in user. Only use this after requireLogin.
 * @param {import('express').Request} req
 */
export function currentUserId(req) {
    return Number(req.session.userId);
}
