require('dotenv').config();
const { Client } = require('tdl');
const { TDLib } = require('tdl-tdlib-ffi');

const API_ID = parseInt(process.env.API_ID);
const API_HASH = process.env.API_HASH;
const CHAT_ID = parseInt(process.env.CHAT_ID);
const SENDER_ID = parseInt(process.env.SENDER_ID);

const client = new Client(new TDLib('./libtdjson.so'), {
    apiId: API_ID,
    apiHash: API_HASH,
});

const main = async () => {
    await client.connect();
    await client.login();

    try {
        while(true) {
            const response = await client.invoke({
                _: 'searchChatMessages',
                chat_id: CHAT_ID,
                sender_user_id: SENDER_ID,
                limit: 100
            });

            const messageIds = response.messages.reduce((acc, message) => {
                if (message.can_be_deleted_for_all_users) {
                    acc.push(message.id);
                    if (message.content && message.content.text) {
                        console.log(`Deleting ${message.id}: ${message.content.text.text}`);
                    } else {
                        console.log(`Deleting ${message.id}`);
                    }
                }

                return acc;
            }, []);

            if (messageIds.length === 0) {
                break;
            }

            const deleteResponse = await client.invoke({
                _: 'deleteMessages',
                chat_id: CHAT_ID,
                revoke: true,
                message_ids: messageIds
            });
        }
    } catch (e) {
        console.error(e);
    }

    console.log('Moving out');
    process.exit(0);
};

main();
