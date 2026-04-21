// import dotenv from 'dotenv';
import "dotenv/config"; // ✅ MUST BE FIRST
import connectionDB from "./db/index.js";
import { app } from "./app.js";
import redisClient from "./utils/redisClient.js";
// dotenv.config({
//     path: '../.env'
// })

connectionDB()
  .then(async () => {
    app.on("error", (error) => {
      console.log("err", error);
      throw error;
    });

    // ✅ connect once
    await redisClient.connect();
    console.log(`server is running on port ${process.env.PORT}`);
    app.listen(process.env.PORT || 8080, () => {
      console.log(`server is running on port ${process.env.PORT}`);
    });

  })
  .catch((error) => {
    console.log("MONGODB db connection failed !!!", error);
    process.exit(1);
  });

process.on("SIGINT", async () => {
  console.log("Closing Redis...");
  await redisClient.quit();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  console.log("Closing Redis...");
  await redisClient.quit();
  process.exit(0);
});
