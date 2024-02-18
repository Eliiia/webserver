import { permLevel } from "./db.ts"

declare module "express" {

    interface AuthUser {
        name: string | undefined;
        permission: permLevel;  
    }

    interface Request {
        user?: AuthUser;  
    }

}