import dotenv from 'dotenv';
import connectionDB from './db/index.js';
import { app } from './app.js';

import serverless from 'serverless-http';

dotenv.config({
    path: '../.env'
})

let isConnected = false;

const handler = async (req, res) => {
    if (!isConnected) {
        try {
            await connectionDB();
            isConnected = true;
            console.log("✅ MongoDB connected");
        } catch (err) {
            console.error("❌ DB connection failed:", err);
            return res.status(500).json({ error: "Database connection failed" });
        }
    }

    const expressHandler = serverless(app);
    return expressHandler(req, res);
};


// dotenv.config({
//     path: '../.env'
// })

// connectionDB()
//     .then(() => {
//         app.on('error', (error) => {
//             console.log("err", error)
//             throw error
//         })

//         console.log(`server is running on port ${process.env.PORT}`)
//         app.listen(process.env.PORT || 8080, () => {
//             console.log(`server is running on port ${process.env.PORT}`)
//         })

//     })
//     .catch((error) => {
//         console.log('MONGODB db connection failed !!!', error)
//     })