import connectToWhatsapp from './Digix/crew.js'
import handleIncomingMessage from './events/messageHandler.js'
import express from 'express'
import fs from 'fs'
import path from 'path'

// ---------------------------
// مسیر فایل ذخیره‌سازی پیرینگ
const pairingFile = path.join(process.cwd(), 'pairing.json')

// بارگذاری داده‌ها یا ایجاد فایل اگر وجود ندارد
let pairings = {}
if (fs.existsSync(pairingFile)) {
    pairings = JSON.parse(fs.readFileSync(pairingFile, 'utf-8'))
} else {
    fs.writeFileSync(pairingFile, JSON.stringify(pairings, null, 2))
}

// تابع ذخیره‌سازی امن در فایل
function savePairings() {
    fs.writeFileSync(pairingFile, JSON.stringify(pairings, null, 2))
}

// ---------------------------
// اتصال به واتساپ
(async () => {
    await connectToWhatsapp(handleIncomingMessage)
    console.log('WhatsApp connection established!')
})()

// ---------------------------
// راه‌اندازی Express
const app = express()

app.get("/", (req, res) => {
    res.send("Rahib WhatsApp Bot is Running")
})

// ---------------------------
// لینک پیر کردن شماره
app.get("/pair", (req, res) => {
    const phone = req.query.phone;
    if (!phone) return res.send("شماره تلفن خود را با پارامتر ?phone= وارد کنید");

    const pairingCode = Math.floor(100000 + Math.random() * 900000); // ۶ رقمی

    // ذخیره در فایل
    pairings[phone] = pairingCode;
    savePairings();

    console.log(`Phone ${phone} paired with code: ${pairingCode}`);
    res.send(`شماره ${phone} با موفقیت پیر شد! کد شما: ${pairingCode}`);
});

// ---------------------------
// لغو پیرینگ
app.get("/depair", (req, res) => {
    const phone = req.query.phone;
    if (!phone) return res.send("شماره تلفن خود را با پارامتر ?phone= وارد کنید");

    if (pairings[phone]) {
        delete pairings[phone];
        savePairings();
        console.log(`Phone ${phone} depaired`);
        res.send(`شماره ${phone} با موفقیت از سیستم پیرینگ خارج شد!`);
    } else {
        res.send(`شماره ${phone} قبلاً پیر نشده است.`);
    }
});

// ---------------------------
// فرم وب برای پیر کردن شماره توسط کاربر
app.get("/pairing-site", (req, res) => {
    res.send(`
        <h2>Pairing Rahib WhatsApp Bot</h2>
        <form action="/pair" method="get">
            <label>شماره تلفن خود را وارد کنید:</label><br>
            <input type="text" name="phone" placeholder="مثال: 989123456789" required><br><br>
            <button type="submit">Pair Now</button>
        </form>
    `)
})

// ---------------------------
// اجرای سرور
app.listen(process.env.PORT || 3000, () => {
    console.log("Server running")
})
