// src/api.js
import dotenv from "dotenv";
import serverless from "serverless-http";
import connectionDB from "./db/index.js";
import { app } from "./app.js";

dotenv.config({ path: "../.env" });

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
