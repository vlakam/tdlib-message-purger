require('dotenv').config();
const { Client } = require('tdl');
//const { TDLib } = require('tdl-tdlib-ffi');
const { TDLib } = require('tdl-tdlib-addon')

const API_ID = parseInt(process.env.API_ID);
const API_HASH = process.env.API_HASH;
const CHAT_ID = parseInt(process.env.CHAT_ID);
const SENDER_ID = parseInt(process.env.SENDER_ID);

const client = new Client(new TDLib('./libtdjson.so'), {
    apiId: API_ID,
    apiHash: API_HASH,
});

function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const findAllMessages = async () => {
    let messages = [];
    let from = 0;
    while (true) {
        await timeout(5);
        const response = await client.invoke({
            _: 'searchChatMessages',
            chat_id: CHAT_ID,
            from_message_id: from,
            sender: { _: 'messageSenderUser', user_id: SENDER_ID },
            limit: 100
        });

        if (response.messages.length === 0) break;
        from = response.messages[response.messages.length - 1].id;

        const messageIds = response.messages
            .filter(msg => msg.can_be_deleted_for_all_users)
            .map((msg) => {
                if (msg.content && msg.content.text) {
                    console.log(`Adding to delete ${msg.id}: ${msg.content.text.text}`);
                } else {
                    console.log(`Adding to delete ${msg.id}`);
                }

                return msg.id;
            });

        messages = [...messages, ...messageIds];
    }

    return messages;
}

const main = async () => {
    await client.connect();
    await client.login();

    try {
        await timeout(500);
        const messages = await findAllMessages();
        console.log(`Deleting ${messages.length} messages in 15 seconds. Last time to cancel`);
        await timeout(15000);
        const deleteResponse = await client.invoke({
            _: 'deleteMessages',
            chat_id: CHAT_ID,
            revoke: true,
            message_ids: messages
        });
        console.log(deleteResponse);
    } catch (e) {
        console.error(e);
    }

    console.log('Moving out');
    process.exit(0);
};

main();
