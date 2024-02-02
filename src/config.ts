import dotenv from "dotenv";

dotenv.config();

function processVariable(name: String, v: String | undefined, type: Function, secret?: boolean): any {
    // check whether variable is missing or wrong type
    if (v == undefined) return new Error(`[CONFIG] ${name}: .dotenv variable missing`)
    let x = type(v)
    if (x == undefined) return new Error(`[CONFIG] ${name}: .dotenv variable wrong type`)

    // if not, load that it has been loaded
    if (secret) v = "(SECRET)"
    console.log(`[CONFIG] ${name} loaded as ${v}`)
    return x
}

export const EPOCH = 1704067200;

export const PORT = processVariable("Port", process.env.PORT, Number)
export const SECRET_KEY = processVariable("Secret key", process.env.SECRET_KEY, String, true)
export const MONGODB_URL = processVariable("MongoDB path", process.env.MONGODB_URL, String)