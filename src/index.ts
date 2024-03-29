import express, {Request, Response} from "express"
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";

import { PORT } from "./config.js";
import { connectDb } from "./db.js";

const app = express()

connectDb();

app.use(cookieParser())
app.use(bodyParser.json());

// Middleware
import { authorisation } from "./user.js";
import { logger } from "./log.js";
app.use(authorisation)
app.use(logger)

// User
import { whoami, login, register } from "./user.js";
app.get("/user/whoami", (req: Request, res: Response) => whoami(req, res));
app.post("/user/login", (req: Request, res: Response) => login(req, res));
app.post("/user/register", (req: Request, res: Response) => register(req, res));

// Chat
import { getChatMessages, sendChatMessage } from "./chat.js";
app.put("/chat/get", (req: Request, res: Response) => getChatMessages(req, res)); // why can't this be a GET? 
app.post("/chat/send", (req: Request, res: Response) => sendChatMessage(req, res));

// File handler
import fileHandler from "./fileHandler.js"
app.get("*", (req: Request, res: Response) => fileHandler(req, res))
 
// Start app
app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`)
})