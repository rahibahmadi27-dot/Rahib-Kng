import connectToWhatsapp from './Digix/crew.js'
import handleIncomingMessage from './events/messageHandler.js'
import express from 'express'

const app = express()
const PORT = process.env.PORT || 3000

// صفحه اصلی برای Render
app.get("/", (req, res) => {
    res.send("🚀 Rahib King MD Bot is Running")
})

// بررسی سلامت سرور
app.get("/health", (req, res) => {
    res.json({
        status: "online",
        bot: "Rahib King MD",
        time: new Date()
    })
})

// اجرای سرور
app.listen(PORT, () => {
    console.log(`🌐 Server running on port ${PORT}`)
})

// اتصال واتساپ
async function startBot() {
    try {

        await connectToWhatsapp(handleIncomingMessage)

        console.log("✅ WhatsApp connection established!")

    } catch (err) {

        console.error("❌ Error connecting to WhatsApp:")
        console.error(err)

        // تلاش دوباره بعد از 10 ثانیه
        setTimeout(startBot, 10000)

    }
}

// اجرای ربات
startBot()

// جلوگیری از کرش شدن ربات
process.on("uncaughtException", (err) => {
    console.error("⚠️ Uncaught Exception:", err)
})

process.on("unhandledRejection", (reason) => {
    console.error("⚠️ Unhandled Rejection:", reason)
})
