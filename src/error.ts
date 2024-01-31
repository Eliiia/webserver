import { Response } from "express";
import { readFileSync } from "fs";

export default function handleError(res: Response, err: (403|404)) {
    const file = readFileSync(`./static/err/${err}.html`);

    res
        .status(err)
        .setHeader("content-type", "text/html")
        .send(file);
}