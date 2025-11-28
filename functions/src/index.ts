import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import express from 'express';
import { createHandler } from '@/lib/middleware/handler';

admin.initializeApp();

const app = express();

// Example protected route using our middleware composition
const apiHandler = createHandler();

apiHandler.get(async (req, res) => {
    res.json({ message: 'Hello from Firebase Functions! 🎉' });
});

app.use('/api/hello', apiHandler);

export const api = functions.https.onRequest(app);
