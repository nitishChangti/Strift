import dotenv from 'dotenv';
import { DB_NAME } from './constants.js';
import connectionDB from './db/index.js';
import { app } from './app.js';

import serverless from 'serverless-http';

dotenv.config({
    path: '../.env'
})
await connectionDB().catch((error) => {
    console.log("MONGODB db connection failed !!!", error);
    process.exit(1);
});

// ❌ Remove app.listen()
// ✅ Export a handler for Vercel
export const handler = serverless(app);

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