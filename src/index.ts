import express, {Request, Response} from "express"
import cookieParser from "cookie-parser";

import { PORT } from "./config.js";

const app = express()

app.use(cookieParser())

// User
import { authorisation, whoami, login, register } from "./user.js";
app.use(authorisation)
app.get("/user/whoami", (req: Request, res: Response) => whoami(req, res));
app.post("/user/login", (req: Request, res: Response) => login(req, res));
app.post("/user/register", (req: Request, res: Response) => register(req, res));

// File handler
import fileHandler from "./fileHandler.js"
app.get("*", (req: Request, res: Response) => fileHandler(req, res))
 
// Start app
app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`)
})