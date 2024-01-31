import dotenv from "dotenv";

dotenv.config();

function processVariable(name: String, v: String | undefined, type: Function): any {
    // check whether variable is missing or wrong type
    if (v == undefined) return new Error(`[CONFIG] ${name}: .dotenv variable missing`)
    let x = type(v)
    if (x == undefined) return new Error(`[CONFIG] ${name}: .dotenv variable wrong type`)
    
    // if not, load that it has been loaded
    console.log(`[CONFIG] ${name} loaded as ${v}`)
    return x
}

export const PORT = processVariable("Port", process.env.PORT, Number)