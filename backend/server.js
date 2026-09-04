import express from "express";
import { createServer } from "http";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { Server } from "socket.io";
import { YSocketIO } from "y-socket.io/dist/server";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

const httpServer = createServer(app);

const io = new Server(httpServer, {
    cors: {
        origin: "*"
    }
});

const ysocketio = new YSocketIO(io);
ysocketio.initialize();

let onlineUsers = 0;

io.on("new_namespace", (namespace) => {
    namespace.on("connection", (socket) => {
        onlineUsers++;
        const time = new Date().toLocaleTimeString();
        console.log(`[${time}] User connected`);
        console.log("Socket ID:", socket.id);
        console.log("Users online:", onlineUsers);
        console.log("-----------------------------");

        socket.on("disconnect", (reason) => {
            onlineUsers = Math.max(0, onlineUsers - 1);
            const leaveTime = new Date().toLocaleTimeString();
            console.log(`[${leaveTime}] User disconnected`);
            console.log("Socket ID:", socket.id);
            console.log("Reason:", reason);
            console.log("Users online:", onlineUsers);
            console.log("-----------------------------");
        });
    });
});

app.get("/", (req, res) => {
    res.render("index", {
        title: "Code Editor"
    });
});

httpServer.listen(4000, () => {
    console.log("Server running on http://localhost:4000");
});

// YSocketIO uses its own namespaces, so listen for new_namespace → then connection.
// Plain Socket.IO uses io.on("connection") directly.