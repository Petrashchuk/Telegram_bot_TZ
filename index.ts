import express, {Express} from 'express';
import dotenv from 'dotenv';
import TelegramBot from 'node-telegram-bot-api';

dotenv.config();


const app: Express = express();
const port = process.env.PORT || 8000;

/**
 *  можна через env змінні добавити токен іншого бота,
 *  дефолтний залишив токен на бота, який розробляв
 */
const token = process.env.API_BOT_KEY || "6341638673:AAG1MKuaI_G-NvhAawiDBkhnx7Hzdg3KaM8";

const bot = new TelegramBot(token, {polling: true});

/**
 *  цю функцію можна можна винести в файлик utils для прикладу,
 *  але немає змісту для нашого кейсу.
 */
const createChatInviteLink = (channelPublicName: string) => bot.createChatInviteLink(channelPublicName);

bot.on('message', async (msg) => {
    try {
        if (msg.text && msg.text.startsWith('@')) {
            const {invite_link} = await createChatInviteLink(msg.text);
            bot.sendMessage(msg.chat.id, `Приватне посилання: ${invite_link}`);
        }
    } catch (error: any) {
        const errMsg = error.message || "Сталася помилка під час конвертації публічного лінка. Спробуйте ще раз пізніше.";
        bot.sendMessage(msg.chat.id, errMsg);
    }
})


app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
