import connectToWhatsapp from './Digix/crew.js'
import handleIncomingMessage from './events/messageHandler.js'

(async () => {
    await connectToWhatsapp(handleIncomingMessage)
    console.log('established !')
})();

// --- Express server برای نگه داشتن ربات آنلاین ---
import express from "express";
const app = express();

app.get("/", (req, res) => {
    res.send("Rahib WhatsApp Bot is Running");
});

app.listen(process.env.PORT || 3000, () => {
    console.log("Server running");
});
