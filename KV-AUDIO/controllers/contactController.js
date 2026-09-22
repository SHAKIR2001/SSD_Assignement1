import ContactMessage from "../models/contactMessage.js";
import { isItADMIN } from "./userController.js";


async function getNextContactMessageId() { //use to create an uniq ID for messages
    let id = 0;

    const last = await ContactMessage.find().sort({ id: -1 }).limit(1);
    if (last.length === 0) {
        id = 1;
    } else {
        id = last[0].id + 1;
    }

    return id;
}

export async function createContactMessage(req, res) {
    try {
         const data = req.body
         data.id = await getNextContactMessageId()

        const newMessage = new ContactMessage(data);
        const saved = await newMessage.save();

        res.status(201).json({
            message: "Message sent successfully",
            id: saved.id,
        });
    } catch (e) {
        res.status(500).json({ message: "Message cannot be sent" });
    }
}

export async function getAllContactMessages(req, res) {
    try {
        if (!isItADMIN(req)) {
            res.status(403).json({ message: "You are not authorized to perform this action" });
            return;
        }

        const messages = await ContactMessage.find().sort({ createdAt: -1 }); //sort use to get the messages in descending order
        res.json(messages);
    } catch (e) {
        res.status(500).json({ message: "Failed to get contact messages" });
    }
}

export async function resolveContactMessage(req, res) {
    try {
        if (!isItADMIN(req)) {
            res.status(403).json({ message: "You are not authorized to perform this action" });
            return;
        }

        const id = req.params.id;
        const result = await ContactMessage.updateOne(
            { id: id },
            { isResolved: true }
        );

        if (result.matchedCount === 0) {
            res.status(404).json({ message: "Contact message not found" });
            return;
        }

        res.json({ message: "Message marked as resolved" });
    } catch (e) {
        res.status(500).json({ message: "Failed to update contact message" });
    }
}
