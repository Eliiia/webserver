import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import bcrypt from "bcrypt"

import { EPOCH, SECRET_KEY } from "./config.js";
import sendError from "./error.js";

import { User } from "./db.js";

const saltRounds = (process.env.NODE_ENV == "PRODUCTION") ? 2 : 8;

export function authorisation(req: Request, res: Response, next: NextFunction) {
    // Check for missing cookie
    if (!req.cookies.access_token) {
        req.user = undefined;
        return next();
    }

    // Get user ID
    try {
        req.user = (jwt.verify(req.cookies.access_token, SECRET_KEY) as JwtPayload).user;
    } catch (error: any) {
        return res.status(403).send({ msg: "INVALID TOKEN" }) 
    }

    next();
}

export async function whoami(req: Request, res: Response) {
    // Check for authentication process
    if (!req.user) return res.status(403).send({ msg: "NO CREDENTIALS" });

    // Send details
    res.status(200).send({ name: req.user, });
}

export async function login(req: Request, res: Response) {    
    // Check for existence of name and password
    if (!req.body.name || !req.body.password) return res.status(400).send({ msg: "MISSING DATA" })

    // Verify password from database
    const user = await User.findOne({ name: req.body.name });
    if (!user) return res.status(403).send({ msg: "INVALID CREDENTIALS" });
    if (!bcrypt.compareSync(req.body.password, user.pw_hash)) return res.status(403).send({ msg: "INVALID CREDENTIALS" });

    // Generate token
    const token = jwt.sign({ user: user.name }, SECRET_KEY);

    // Respond with cookie
    return res
        .cookie("access_token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production"
        })
        .status(200)
        .send();
}

export async function register(req: Request, res: Response) {
    // Check for existence of name and password
    if (!req.body.name || !req.body.password) return res.status(400).send({ msg: "MISSING DATA" });

    // Check whether user exists
    if (await User.exists({ name: req.body.name })) return res.status(409).send({ msg: "DUPLICATE NAME" });

    // Check password security by checking length
    if (req.body.password.length > 8) return res.status(400).send({ msg: "PASSWORD TOO SHORT" });
    if (req.body.password == req.body.password.toUpperCase() ||
        req.body.password == req.body.password.toLowerCase()) return res.status(400).send({ msg: "PASSWORD MUST CONTAIN UPPERCASE AND LOWERCASE" })

    // Create password hash
    let hash: String;
    try {
        const salt = bcrypt.genSaltSync(saltRounds)
        hash = bcrypt.hashSync(req.body.password, salt);
    }
    catch {
        return sendError(res, 500);
    }

    // Send user to database
    const u = new User({
        name: req.body.name,
        pw_hash: hash,
    });

    try {
        await u.save();
    } catch (e: any) {
        if (e.code == 11000) return res.status(409).send({ msg: "DUPLICATE" });
        else throw e;
    }

    // Respond to user
    res.status(200).send();
}