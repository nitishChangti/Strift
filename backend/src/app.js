import express from "express"
const app = express()

import cors from "cors"
app.use(cors({
    // origin: process.env.CORS_ORIGIN,
    origin: 'http://localhost:5173',
    credentials: true
}))
import cookieParser from "cookie-parser";
app.use(cookieParser())
app.use(express.json({ limit: "10mb" }))
app.use(express.urlencoded({ extended: true })) //, limit: "16kb"
app.use(express.json());

// import path from 'path';
// Serve static files from the 'public' directory
// app.use(express.static('../public'));

import session from 'express-session';
app.use(session({
    secret: 'GfEdCbAaBcDeFgHiJkLmNoPqRsTuVwXyZ1234567890',
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 3600000
    },
}));

// ADD ROOT ROUTE - This is crucial!
app.get('/', (req, res) => {
    res.json({
        message: "API is running successfully!",
        status: "healthy",
        timestamp: new Date().toISOString()
    });
});

import UserRouter from './routes/user/user.routes.js';
app.use("", UserRouter)

import categoryrouter from './routes/admin/category.routes.js'
app.use("/admin", categoryrouter)

import productrouter from './routes/admin/product.routes.js'
app.use('/admin', productrouter)

// Handle 404 for unmatched routes
app.use('*', (req, res) => {
    res.status(404).json({
        error: "Route not found",
        path: req.originalUrl
    });
});
export { app }
