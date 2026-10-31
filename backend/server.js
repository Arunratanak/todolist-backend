import "dotenv/config"
import express from "express"
import morgan from "morgan"
import path from "node:path"
import cors from "cors"
import cookieParser from "cookie-parser"
import { fileURLToPath } from "node:url"
import authRoute from "./src/routes/auth.js"   // NEW
import todoRoute from "./src/routes/todo.js"
import { connectDB } from "./src/config/db.js"

const server = express();
const PORT = process.env.PORT || 5000;
const backendDirectory = path.dirname(fileURLToPath(import.meta.url));

// NEW: only your React app may call this server, and it may send cookies
server.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
}));
server.use(express.json())
server.use(cookieParser())                      // NEW: lets Express read cookies
server.use(morgan('dev'))

server.use("/api/auth", authRoute); 
server.use(todoRoute);      // NEW: must come before your other routes


server.use("/assets", express.static(path.join(backendDirectory, "public"), { index: false }));


connectDB().then(() => {
    server.listen(PORT, () => {
        console.log(`🚀 Server is running on http://localhost:${PORT}`);
    });
});