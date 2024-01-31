import express, {Request, Response} from "express";
import { existsSync, readFileSync } from "fs";

import sendErr from "./error.js";

enum Mime {
    Html = "text/html",
    Css = "text/css",
    Unknown = "",
}

const translation: { [key: string]: Mime} = {
    html: Mime.Html,
    css: Mime.Css
}

function getMime(s: String): Mime {
    // Get last part
    const s1 = s.split("/");
    const s2 = s1[s1.length-1];
    const s3 = s2.split(".");
    const s4 = s3[s3.length-1];

    if (translation[s4] != undefined) return translation[s4]
    else return Mime.Unknown
}

export default function handler(req: Request, res: Response) {
    let mime = getMime(req.path)

    // Add .html or index.html and remove first char
    let path = req.path.substring(1)
    if (mime == Mime.Unknown) {
        mime = Mime.Html;
        path = req.path.endsWith("/")
            ? path + "index.html" 
            : path + ".html";
    }

    // Check for existence and send 404 if need be
    if (!existsSync(`./static/${path}`)) {
        return sendErr(res, 404);
    }

    console.log(`${req.ip} => ${req.path} => ${path}`)

    // Get file
    const file = readFileSync(`./static/${path}`)

    res.status(200).setHeader("content-type", mime).send(file);
}