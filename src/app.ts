import express from "express"
import { postRouter } from "./module/post.router";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth";
import cors from "cors"
const app = express()

app.use(cors({
    origin: process.env.BETTER_AUTH_URL,
    credentials: true
}));

app.all('/api/auth/{*any}', toNodeHandler(auth));

app.use(express.json());
app.use("/post", postRouter)

app.get("/", (req, res) => {
    res.send("Hello world")
})


export default app;