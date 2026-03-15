import connectToWhatsapp from './Digix/crew.js';
import handleIncomingMessage from './events/messageHandler.js';
import express from 'express';
import fs from 'fs';
import path from 'path';

// فایل ذخیره پیرینگ
const pairingFile = path.join(process.cwd(), 'pairing.json');
let pairings = {};
if (fs.existsSync(pairingFile)) {
    pairings = JSON.parse(fs.readFileSync(pairingFile, 'utf-8'));
} else {
    fs.writeFileSync(pairingFile, JSON.stringify(pairings, null, 2));
}

// تابع ذخیره امن
function savePairings() {
    fs.writeFileSync(pairingFile, JSON.stringify(pairings, null, 2));
}

// اتصال واتساپ
(async () => {
    await connectToWhatsapp(handleIncomingMessage);
    console.log('✅ WhatsApp connection established!');
})();

const app = express();

// صفحه اصلی سایت
app.get("/", (req, res) => {
    res.send("Rahib WhatsApp Bot is Running");
});

// سایت پیرینگ حرفه‌ای
app.get("/pairing-site", (req, res) => {
    res.send(`
    <html>
    <head>
        <title>Rahib WhatsApp Bot Pairing</title>
        <style>
            body { background: #0f111a; color: #cfcfcf; font-family: Arial, sans-serif; display: flex; justify-content: center; align-items: center; height: 100vh; }
            .container { background: #1b1e2a; padding: 30px; border-radius: 10px; width: 350px; }
            input, select, button { width: 100%; padding: 10px; margin: 8px 0; border-radius: 5px; border: none; }
            button { background: #4caf50; color: white; font-weight: bold; cursor: pointer; }
            button:hover { background: #45a049; }
            h2 { text-align: center; color: #00ff99; }
        </style>
    </head>
    <body>
        <div class="container">
            <h2>Pair Rahib Bot</h2>
            <form action="/pair" method="get">
                <label>Phone Number (with country code, no +)</label>
                <input type="text" name="phone" placeholder="989123456789" required>
                <label>Select Server</label>
                <select name="server">
                    <option value="1">Server 1</option>
                    <option value="2">Server 2</option>
                    <option value="3">Server 3</option>
                    <option value="4">Server 4</option>
                    <option value="5">Server 5</option>
                </select>
                <button type="submit">Pair Now</button>
            </form>
        </div>
    </body>
    </html>
    `);
});

// مسیر پیرینگ واقعی
app.get("/pair", (req, res) => {
    const phone = req.query.phone;
    const server = req.query.server || '1';
    if (!phone) return res.send("⚠️ Please provide your phone number with ?phone=");

    // تولید Session ID واقعی (می‌تواند UUID یا hash واقعی باشد)
    const sessionID = `wolf_${Math.random().toString(36).substring(2, 10)}`;

    // ذخیره در فایل
    pairings[phone] = { sessionID, server };
    savePairings();

    console.log(`📌 Phone ${phone} paired on server ${server} with Session ID: ${sessionID}`);
    res.send(`
        <h3>Success ✅</h3>
        <p>Phone: ${phone}</p>
        <p>Server: ${server}</p>
        <p>Session ID: <b>${sessionID}</b></p>
        <a href="/pairing-site">Back to Pairing</a>
    `);
});

// لغو پیرینگ
app.get("/depair", (req, res) => {
    const phone = req.query.phone;
    if (!phone) return res.send("⚠️ Please provide your phone number with ?phone=");

    if (pairings[phone]) {
        delete pairings[phone];
        savePairings();
        console.log(`📌 Phone ${phone} depaired`);
        res.send(`Phone ${phone} successfully depaired!`);
    } else {
        res.send(`Phone ${phone} not found in pairing system.`);
    }
});

// سرور اجرا
app.listen(process.env.PORT || 3000, () => {
    console.log("🌐 Server running on port 3000 or environment PORT");
});
