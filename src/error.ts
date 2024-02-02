import { Response } from "express";
import { readFileSync } from "fs";

export default function sendError(res: Response, err: (403|404|500)) {
    const file = readFileSync(`./static/err/${err}.html`);

    res
        .status(err)
        .setHeader("content-type", "text/html")
        .send(file);
}