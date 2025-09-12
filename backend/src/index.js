import dotenv from 'dotenv';
import connectionDB from './db/index.js';
import { app } from './app.js';

dotenv.config({
    path: '../.env'
})

connectionDB()
    .then(() => {
        app.on('error', (error) => {
            console.log("err", error)
            throw error
        })

        console.log(`server is running on port ${process.env.PORT}`)
        app.listen(process.env.PORT || 8080, () => {
            console.log(`server is running on port ${process.env.PORT}`)
        })

    })
    .catch((error) => {
        console.log('MONGODB db connection failed !!!', error)
    })