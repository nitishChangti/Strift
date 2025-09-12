// api/index.js
import dotenv from "dotenv";
import serverless from "serverless-http";
import connectionDB from "../src/db/index.js";
import { app } from "../src/app.js";

dotenv.config({ path: ".env" }); // now root .env, not ../.env

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

export default handler;
