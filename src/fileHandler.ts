import {Request, Response} from "express";
import { existsSync, readFileSync } from "fs";

import sendError from "./error.js";

enum Mime {
    Html = "text/html",
    Css = "text/css",
    Unknown = "",
}

const translation: { [key: string]: Mime} = {
    html: Mime.Html,
    css: Mime.Css,
}

function getMime(s: String): Mime {
    // Get extension - split by slash, get last, split by dot, get last
    const ext = s.split("/").pop()!.split(".").pop();

    // If can't find a translation, return unknown
    return translation[ext!] ? translation[ext!] : Mime.Unknown;
}

export default function handler(req: Request, res: Response) {
    let mime = getMime(req.path);

    // Add .html or index.html and remove first char
    let path = req.path.substring(1)
    if (mime == Mime.Unknown) { // if no valid extension was found, assume missing .html
        mime = Mime.Html;
        path = req.path.endsWith("/")
            ? path + "index.html" 
            : path + ".html";
    }

    // Check for existence and send 404 if need be
    if (!existsSync(`./static/${path}`)) {
        return sendError(res, 404);
    }

    // Get file
    const file = readFileSync(`./static/${path}`)

    res.status(200).setHeader("Content-Type", mime).send(file);
}