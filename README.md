# tdlib-message-purger

Delete all your telegram messages in selected group

## Getting started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites 

You need to obtain API key from [Telegram](https://my.telegram.org) and built [tdlib](https://github.com/tdlib/td) binary.
Please note that currently only works on Linux.
Put libtdjson.so in the project root directory.
Then copy .env.sample as .env and write next lines
```
API_ID=YOUR_API_ID_FROM_TELEGRAM
API_HASH=YOUR_API_HASH_FROM_TELEGRAM
CHAT_ID=CHAT_THAT_YOU_WANT_TO_DELETE_MESSAGES_FROM
SENDER_ID=YOUR_USER_ID
```

Install node modules with ```npm install``` and you are good to go!
See how your messages disappear.

### Example of .env

```
API_ID=2222
API_HASH=1234567890abcdef
CHAT_ID=-100123456790
SENDER_ID=123456790
```


## Built with

* Love
* Despair
* Anxiety
