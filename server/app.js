import express from 'express';
import session from 'express-session';
import cors from 'cors';
import { userRouter } from './routes/user.js';
import { adminRouter } from './routes/admin.js';
import { initStore } from './data.js';

const app = express();

// Enable Cross-Origin Resource Sharing (CORS)
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
}));


// Use sessions
app.use(session({
    name: 'sessionIdCookie',
    secret: 'for-prod-env-never-hard-code-your-secret-key-like-i-am',
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
        maxAge: 1000 * 60 * 60 * 24,
    },
}));

// Parse JSON request bodies
app.use(express.json());

// Use routers
app.use('/api/user', userRouter);
app.use('/api/admin', adminRouter);

// Used by the network example: count feedback messages in memory
let feedbackReceived = 0;
app.post('/api/feedback', (req, res) => {
    feedbackReceived++;
    res.status(201).json({ status: 'success', received: feedbackReceived });
});

await initStore();

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

export default app;
