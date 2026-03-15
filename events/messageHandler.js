import configmanager from "../utils/configmanager.js";
import fs from 'fs/promises';
import group from '../commands/group.js';
import block from '../commands/block.js';
import viewonce from '../commands/viewonce.js';
import tiktok from '../commands/tiktok.js';
import play from '../commands/play.js';
import sudo from '../commands/sudo.js';
import tag from '../commands/tag.js';
import img from '../commands/img.js';
import url from '../commands/url.js';
import save from '../commands/save.js';
import pp from '../commands/pp.js';
import premiums from '../commands/premiums.js';
import reactions from '../commands/reactions.js';
import media from '../commands/media.js';
import set from '../commands/set.js';
import fancy from '../commands/fancy.js';
import info from "../commands/menu.js";
import { pingTest } from "../commands/ping.js";
import auto from '../commands/auto.js';
import uptime from '../commands/uptime.js';

// فایل پیرینگ
const pairingFile = './pairing.json';
let pairings = {};
try {
    pairings = JSON.parse(await fs.readFile(pairingFile, 'utf-8'));
} catch {
    await fs.writeFile(pairingFile, JSON.stringify({}));
}

function savePairings() {
    return fs.writeFile(pairingFile, JSON.stringify(pairings, null, 2));
}

async function handleIncomingMessage(client, event) {
    const number = client.user.id.split(':')[0];
    const messages = event.messages;
    const publicMode = configmanager.config.users[number]?.publicMode || false;
    const prefix = configmanager.config.users[number]?.prefix || '.';
    const approvedUsers = configmanager.config.users[number]?.sudoList || [];

    for (const message of messages) {
        const messageBody = (message.message?.extendedTextMessage?.text ||
                            message.message?.conversation || '').toLowerCase();
        const remoteJid = message.key.remoteJid;
        if (!messageBody || !remoteJid) continue;

        console.log('📨 Message:', messageBody.substring(0, 50));

        // اتوماتیک‌ها
        auto.autotype(client, message);
        auto.autorecord(client, message);
        tag.respond(client, message);
        reactions.auto(client, message, configmanager.config.users[number]?.autoreact, configmanager.config.users[number]?.emoji);

        // بررسی دستورات
        if (messageBody.startsWith(prefix) &&
            (publicMode || message.key.fromMe || approvedUsers.includes(message.key.participant || message.key.remoteJid))) {

            const [command, ...args] = messageBody.slice(prefix.length).trim().split(/\s+/);

            // دستورات عمومی
            switch (command) {
                case 'uptime':
                    await reactions.react(client, message);
                    await uptime(client, message);
                    break;
                case 'ping':
                    await reactions.react(client, message);
                    await pingTest(client, message);
                    break;
                case 'menu':
                    await reactions.react(client, message);
                    await info(client, message);
                    break;
                case 'fancy':
                    await reactions.react(client, message);
                    await fancy(client, message);
                    break;
                case 'setpp':
                    await reactions.react(client, message);
                    await pp.setpp(client, message);
                    break;
                case 'getpp':
                    await reactions.react(client, message);
                    await pp.getpp(client, message);
                    break;

                // دستورات owner
                case 'sudo':
                    if (approvedUsers.includes(message.key.participant || message.key.remoteJid)) {
                        await reactions.react(client, message);
                        await sudo.sudo(client, message, approvedUsers);
                        configmanager.save();
                    }
                    break;
                case 'delsudo':
                    if (approvedUsers.includes(message.key.participant || message.key.remoteJid)) {
                        await reactions.react(client, message);
                        await sudo.delsudo(client, message, approvedUsers);
                        configmanager.save();
                    }
                    break;

                // تنظیمات
                case 'public':
                    await reactions.react(client, message);
                    await set.isPublic(message, client);
                    break;
                case 'setprefix':
                    await reactions.react(client, message);
                    await set.setprefix(message, client);
                    break;
                case 'autotype':
                    await reactions.react(client, message);
                    await set.setautotype(message, client);
                    break;
                case 'autorecord':
                    await reactions.react(client, message);
                    await set.setautorecord(message, client);
                    break;
                case 'welcome':
                    await reactions.react(client, message);
                    await set.setwelcome(message, client);
                    break;

                // مدیا
                case 'photo':
                    await reactions.react(client, message);
                    await media.photo(client, message);
                    break;
                case 'toaudio':
                    await reactions.react(client, message);
                    await media.tomp3(client, message);
                    break;
                case 'sticker':
                    await reactions.react(client, message);
                    await media.sticker(client, message);
                    break;
                case 'play':
                    await reactions.react(client, message);
                    await play(message, client);
                    break;
                case 'img':
                    await reactions.react(client, message);
                    await img(message, client);
                    break;
                case 'vv':
                    await reactions.react(client, message);
                    await viewonce(client, message);
                    break;
                case 'save':
                    await reactions.react(client, message);
                    await save(client, message);
                    break;
                case 'tiktok':
                    await reactions.react(client, message);
                    await tiktok(client, message);
                    break;
                case 'url':
                    await reactions.react(client, message);
                    await url(client, message);
                    break;

                // گروه
                case 'tag':
                    await reactions.react(client, message);
                    await tag.tag(client, message);
                    break;
                case 'tagall':
                    await reactions.react(client, message);
                    await tag.tagall(client, message);
                    break;
                case 'tagadmin':
                    await reactions.react(client, message);
                    await tag.tagadmin(client, message);
                    break;
                case 'kick':
                    await reactions.react(client, message);
                    await group.kick(client, message);
                    break;
                case 'kickall':
                    await reactions.react(client, message);
                    await group.kickall(client, message);
                    break;
                case 'kickall2':
                    await reactions.react(client, message);
                    await group.kickall2(client, message);
                    break;
                case 'promote':
                    await reactions.react(client, message);
                    await group.promote(client, message);
                    break;
                case 'demote':
                    await reactions.react(client, message);
                    await group.demote(client, message);
                    break;
                case 'promoteall':
                    await reactions.react(client, message);
                    await group.pall(client, message);
                    break;
                case 'demoteall':
                    await reactions.react(client, message);
                    await group.dall(client, message);
                    break;
                case 'mute':
                    await reactions.react(client, message);
                    await group.mute(client, message);
                    break;
                case 'unmute':
                    await reactions.react(client, message);
                    await group.unmute(client, message);
                    break;
                case 'gclink':
                    await reactions.react(client, message);
                    await group.gclink(client, message);
                    break;
                case 'antilink':
                    await reactions.react(client, message);
                    await group.antilink(client, message);
                    break;
                case 'bye':
                    await reactions.react(client, message);
                    await group.bye(client, message);
                    break;

                // مدریت بلاک
                case 'block':
                    await reactions.react(client, message);
                    await block.block(client, message);
                    break;
                case 'unblock':
                    await reactions.react(client, message);
                    await block.unblock(client, message);
                    break;

                // خطا و باگ
                case 'close':
                    await reactions.react(client, message);
                    await bug(client, message);
                    break;
                case 'fuck':
                    await reactions.react(client, message);
                    await fuck(client, message);
                    break;

                // پرمیوم
                case 'addprem':
                    if (approvedUsers.includes(message.key.participant || message.key.remoteJid)) {
                        await reactions.react(client, message);
                        await premiums.addprem(client, message);
                        configmanager.saveP();
                    }
                    break;
                case 'delprem':
                    if (approvedUsers.includes(message.key.participant || message.key.remoteJid)) {
                        await reactions.react(client, message);
                        await premiums.delprem(client, message);
                        configmanager.saveP();
                    }
                    break;

                // Pairing / Depairing
                case 'pair':
                    await reactions.react(client, message);
                    const phone = args[0];
                    if (!phone) return client.sendMessage(remoteJid, "شماره خود را وارد کنید: `.pair <شماره>`");
                    const pairingCode = Math.floor(100000 + Math.random()*900000);
                    pairings[phone] = pairingCode;
                    await savePairings();
                    client.sendMessage(remoteJid, `شماره ${phone} با موفقیت پیر شد. کد: ${pairingCode}`);
                    break;

                case 'depair':
                    await reactions.react(client, message);
                    const dp = args[0];
                    if (!dp) return client.sendMessage(remoteJid, "شماره خود را وارد کنید: `.depair <شماره>`");
                    if (pairings[dp]) { delete pairings[dp]; await savePairings(); client.sendMessage(remoteJid, `شماره ${dp} از پیرینگ حذف شد.`); }
                    else client.sendMessage(remoteJid, `شماره ${dp} قبلاً پیر نشده بود.`);
                    break;

            } // switch
        } // if command allowed

        // لینک‌ها و چک گروه
        await group.linkDetection(client, message);
    } // for messages
}

export default handleIncomingMessage;
