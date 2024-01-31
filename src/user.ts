import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

import { SECRET_KEY } from "./config.js";
import sendErr from "./error.js";

export function authorisation(req: Request, res: Response, next: NextFunction) {
    const token = req.cookies.access_token;

    // TO DO: 
    // - VERIFY TOKEN
    // - then READ TOKEN AND OBTAIN ID FROM THERE
    // - then SAVE TO req

    next();
}

export function whoami(req: Request, res: Response) {
    const token = req.cookies.access_token;

    if (!token) {
        return sendErr(res, 403);
    }

    // TO DO: 
    // - obtain data from db
    // - show all data i **can**
}

export function login(req: Request, res: Response) {
    // TO DO: 
    // - implement check against password in db
    // - have data show all data that the user needs
    const token = jwt.sign({ userid: "1" }, SECRET_KEY);

    return res
        .cookie("access_token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production"
        })
        .status(200)
        .send("logged in successfully");
}

export function register(req: Request, res: Response) {
    // TO DO: 
    // - hook up to db
}