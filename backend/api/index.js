// api/index.js
import serverless from "serverless-http";
import connectionDB from "../src/db/index.js";
import { app } from "../src/app.js";

let mongoConnection = null;

// Wrap the serverless handler
const handler = async (req, res) => {
    if (!mongoConnection) {
        try {
            mongoConnection = await connectionDB(); // connect once per instance
            console.log("✅ MongoDB connected");
        } catch (err) {
            console.error("❌ DB connection failed:", err);
            return res.status(500).json({ error: "Database connection failed" });
        }
    }

    // Reuse the same expressHandler every time
    return serverless(app)(req, res);
};

export default handler;
