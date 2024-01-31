import express, {Request, Response} from "express"

import { PORT } from "./config.js";

const app = express()

// File handler
import fileHandler from "./fileHandler.js"
app.get('*', (req: Request, res: Response) => fileHandler(req, res))

// Start app
app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`)
})