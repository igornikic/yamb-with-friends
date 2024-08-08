import http from "http";
import dotenv from "dotenv";
import app from "./app";
import initializeSocket from "./socket/index";
import connectDatabase from "./config/database";

dotenv.config({ path: "src/config/config.env" });

connectDatabase();

const server = http.createServer(app);
initializeSocket(server);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
