
import express from "express"
import morgan from "morgan"
import route from "./src/routes/router.js"
import {connectDB} from "./src/config/db.js"



const server = express();
const PORT = process.env.PORT || 5000; 
server.use(express.json())
server.use(morgan('dev'))
server.use(route);

connectDB().then(() => {
    server.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
    });
});

