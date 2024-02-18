import { Schema, model, connect } from "mongoose";
import { MONGODB_URL } from "./config.js";

export async function connectDb() {
    await connect(MONGODB_URL);
    console.log(`[DB] Connected to MongoDB database at ${MONGODB_URL}`);
}

export enum permLevel {
    Admin = 0,
    VeryTrusted, // 1
    Trusted, // 2
    Untrusted, // 3
}

interface IUser {
    name: string;
    pw_hash: string;
    permission: permLevel;
}

const userSchema = new Schema<IUser>({
    name: { type: String, required: true, unique: true },
    pw_hash: { type: String, required: true },
    permission: { type: Number, required: true },
});

export const User = model<IUser>("User", userSchema);

export interface IMessage {
    user: string,
    text: string,
    timestamp: Date,
}

interface IChatroom {
    name: string,
    messages: IMessage,
    requiredPermission: number,
}

const chatroomSchema = new Schema<IChatroom>({
    name: { type: String, required: true, unique: true },
    messages: [{
        user: {
            type: String,
            ref: "User",
            required: true,
        },
        text: { type: String, required: true },
        timestamp: { type: Date, required: true },
    }],
    requiredPermission: { type: Number, required: true },
});

export const Chatroom = model<IChatroom>("Chatroom", chatroomSchema);