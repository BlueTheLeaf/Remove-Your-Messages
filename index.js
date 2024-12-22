const prompt = require("prompt-sync")();

// Get the TOKEN & Channel ID
const TOKEN = prompt("Please enter your token: ");
const channel_id = prompt("Please enter the channel ID: ");
let delay = prompt(
  "Please enter the delay between deleting each mesasge (seconds): "
);

delay = delay * 1000;

const { Client } = require("discord.js-selfbot-v13");

const client = new Client({
  checkUpdate: false,
});

client.login(TOKEN);

client.on("ready", async () => {
  console.log(
    "----------------------------------------------------\nIf the information is correct, press enter, if its wrong restart the bot or ask for help\n"
  );
  prompt(`Logged in as ${client.user.tag}`);

  const channel = await client.channels.fetch(channel_id);

  if (channel.type === "DM") {
    prompt(`Erasing all of YOUR messages in dms with ${channel.recipient.tag}`);
  } else {
    prompt(`Erasing all if YOUR messages from ${channel.name}`);
  }

  // Fetch all messages in the channel
  let fetchedMessages;
  let lastMessageId;
  const clientMessages = [];

  do {
    fetchedMessages = await channel.messages.fetch({
      limit: 100,
      before: lastMessageId,
    });
    const filteredMessages = fetchedMessages.filter(
      (msg) => msg.author.id === client.user.id
    );
    clientMessages.push(...filteredMessages.values());
    lastMessageId = fetchedMessages.last()?.id;
  } while (fetchedMessages.size > 0);

  prompt(
    `Found ${clientMessages.length} messages, are you sure you want to remove them all?`
  );

  for (const msg of clientMessages) {
    try {
      await msg.delete();
      console.log(`Deleted message: ${msg.content}`);
      await new Promise((resolve) => setTimeout(resolve, delay));
    } catch (err) {
      console.error(`Failed to delete message: ${msg.content} - ${err}`);
    }
  }

  console.log("Finished deleting messages.");
});
