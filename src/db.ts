import { Schema, model, connect } from "mongoose";
import { MONGODB_URL } from "./config.js";

interface IUser {
    name: string;
    id: string;
    pw_hash: string;
}

const userSchema = new Schema<IUser>({
    name: { type: String, required: true, unique: true },
    pw_hash: { type: String, required: true },
});

export const User = model<IUser>("User", userSchema);

export async function connectDb() {
    await connect(MONGODB_URL);
    console.log(`[DB] Connected to MongoDB database at ${MONGODB_URL}`);
}