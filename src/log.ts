import { NextFunction, Request, Response } from "express";


export function logger(req: Request, res: Response, next: NextFunction) {
    console.log(`${req.ip} (${req.user ? req.user.name : "N/A"}) ${req.method} ${req.path}`);

    next();
}