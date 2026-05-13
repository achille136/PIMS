import express from 'express';
import session from 'express-session';
import db from './config/db.js';
import authRouter from './routes/auth.route.js';
import categoryRouter from './routes/category.route.js';
import inventoryRouter from './routes/inventory.route.js';
import salesRouter from './routes/sales.route.js';
import medicineRouter from './routes/medicine.route.js';


const app = express();

app.use(express.json());

app.use(session({
    secret: "This is a sexy secret key",
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        secure: false,
        maxAge: 1000 * 60 * 60 * 24
    }
}));

app.use('/auth', authRouter);
app.use('/medicine', medicineRouter);
app.use('/category', categoryRouter);
app.use('/sales', salesRouter);
app.use('/inventory', inventoryRouter);

app.listen(8002, () => {
    console.log('Server is running on port 8002');
});