import express, {Request, Response} from "express"

import { PORT } from "./config.js";

const app = express()

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!')
})

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`)
})