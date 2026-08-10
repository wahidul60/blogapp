import express from "express"
import { postRouter } from "./module/post.router";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth";
import cors from "cors"
import { commentRouter } from "./module/comment/comment.router";
import getAllUser from "./module/user";
const app = express()

app.use(cors({
    origin: process.env.BETTER_AUTH_URL,
    credentials: true
}));


app.use(express.json());

app.use((req, res, next) => {
    console.log("Method:", req.method);
    console.log("Path:", req.path);
    console.log("Body:", req.body);
    next();
});


app.all('/api/auth/{*any}', toNodeHandler(auth));


app.use("/post", postRouter)
app.use("/comment", commentRouter)
app.use("/user", getAllUser )

app.get("/", (req, res) => {
    res.send("Hello world")
})


export default app;