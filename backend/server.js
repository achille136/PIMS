import express from 'express';
import cors from 'cors';
import session from 'express-session';
import db from './config/db.js';
import authRouter from './routes/auth.route.js';
import categoryRouter from './routes/category.route.js';
import inventoryRouter from './routes/inventory.route.js';
import salesRouter from './routes/sales.route.js';
import medicineRouter from './routes/medicine.route.js';
import reportRouter from './routes/report.route.js';

const app = express();

app.use(
    cors({
        origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
        credentials: true,
    })
);

app.use(express.json());

app.use(
    session({
        secret: process.env.SESSION_SECRET || 'This is a sexy secret key',
        resave: false,
        saveUninitialized: false,
        cookie: {
            httpOnly: true,
            secure: false,
            maxAge: 1000 * 60 * 60 * 24,
            sameSite: 'lax',
        },
    })
);

app.use('/auth', authRouter);
app.use('/medicine', medicineRouter);
app.use('/category', categoryRouter);
app.use('/sales', salesRouter);
app.use('/inventory', inventoryRouter);
app.use('/reports', reportRouter);

app.listen(8002, () => {
    console.log('Server is running on port 8002');
});
