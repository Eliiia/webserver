import { Request, Response } from "express";
import { Chatroom, IMessage, User, permLevel } from "./db.js";

export async function getChatMessages(req: Request, res: Response) {
    if (!req.user) return res.status(403).send({ msg: "NO CREDENTIALS" });

    // Check that user is logged in
    if (!req.user) return res.status(403).send({ msg: "NO CREDENTIALS" });
    // Check that all data needed is in message
    if (!req.body.chatroom) return res.status(400).send({ msg: "MISSING DATA" });
    // And the other data
    if (!req.body.amount || !Number(req.body.amount)) req.body.amount = 5; 

    // Find chatroom
    const room = await Chatroom.findOne({name: req.body.chatroom});
    if (!room) return res.status(404).send({ msg: "CHATROOM NOT FOUND" });

    // Check permission level
    if (req.user.permission > room.requiredPermission) return res.status(403).send({ msg: "MISSING PERMISSION" });

    // Get last 5 messages
    let roomMessages = (room.messages as unknown as Array<IMessage>)
    roomMessages = roomMessages.slice(Math.max(roomMessages.length - req.body.amount, 0));
    
    // Get usernames and prettify object
    let out: {user: string, text: string, timestamp: Date}[] = [];

    for (const message of roomMessages) {
        const foundUser = await User.findOne({ name: message.user });

        out.push({
            user: foundUser!.name,
            text: message.text,  
            timestamp: message.timestamp
        });
    };

    // Send
    res.status(200).send(out);
}

export async function sendChatMessage(req: Request, res: Response) {
    // Check that user is logged in
    if (!req.user) return res.status(403).send({ msg: "NO CREDENTIALS" });
    // Check that all data needed is in message
    if (!req.body.chatroom || !req.body.message) return res.status(400).send({ msg: "MISSING DATA" });

    // Formulate new message
    const newMessage: IMessage = {
        user: req.user.name as string,
        text: req.body.message,
        timestamp: new Date(),
    }

    // Try to find room and update it if can
    const room = await Chatroom.findOne({name: req.body.chatroom});

    // If no room found, create new room with the message and send it
    if (!room) {
        const newRoom = new Chatroom({
            name: req.body.chatroom,
            messages: [
                newMessage
            ],
            requiredPermission: permLevel.Untrusted,
        });

        await newRoom.save();

        res.status(200).send({ msg: "CHATROOM CREATED" });
    }
    // Otherwise do permission check and send
    else {
        if (req.user.permission > room.requiredPermission) return res.status(403).send({ msg: "MISSING PERMISSION" });

        await room.updateOne({$push: {messages: newMessage}});
        res.status(200).send();
    }
}