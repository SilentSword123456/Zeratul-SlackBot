const axios = require("axios");

require("dotenv").config();

const { App } = require("@slack/bolt");

const app = new App({
    token: process.env.SLACK_BOT_TOKEN,
    appToken: process.env.SLACK_APP_TOKEN,
    socketMode: true
});

app.command("/zeratul-ping", async ({ command, ack, respond }) => {
    const start = Date.now();
    await ack();
    const latency = Date.now() - start;
    await respond({ text: `Pong!\nLatency: ${latency}ms` });
});

app.command("/zeratul-help", async ({ ack, respond }) => {
    await ack();
    await respond({
        text:
            `Available Commands:
/zeratul-ping - Check bot latency
/zeratul-help - Show available commands
/zeratul-fact - Get a useless fact
/zeratul-catfact - Get a cat fact
/zeratul-joke - Get a joke`

    });
});

app.command("/zeratul-catfact", async ({ ack, respond }) => {
    await ack();

    try {
        const response = await axios.get("https://catfact.ninja/fact");
        await respond({ text: `Cat Fact:\n${response.data.fact}` });
    } catch (err) {
        await respond({ text: "Failed to fetch a cat fact." });
    }
});

app.command("/zeratul-fact", async ({ ack, respond }) => {
    await ack();

    try {
        const res = await fetch('https://uselessfacts.jsph.pl/api/v2/facts/random?language=en');
        const data = await res.json();
        await respond({ text: `Useless Fact:\n${data.text}` });
    } catch (err) {
        await respond({ text: "Failed to fetch a useless fact." });
    }
});

app.command("/zeratul-joke", async ({ ack, respond }) => {
    await ack();

    try {
        const response = await axios.get("https://official-joke-api.appspot.com/random_joke");
        await respond({
            text:
                `${response.data.setup}

${response.data.punchline}`
        });
    } catch (err) {
        await respond({ text: "Failed to fetch a joke." });
    }
});

(async () => {
    await app.start();
    console.log("bot is running!");
})();