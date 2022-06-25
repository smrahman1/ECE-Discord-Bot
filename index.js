require("dotenv").config();

const token = process.env.DISCORD_TOKEN;

const mongoose = require("mongoose");

// Discord Setup and Setting up link to command files
const fs = require("node:fs");
const path = require("node:path");
const { Client, Collection, Intents } = require("discord.js");
const { mainModule } = require("node:process");

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

client.commands = new Collection();
const commandsPath = path.join(__dirname, "commands");
const commandFiles = fs
  .readdirSync(commandsPath)
  .filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = require(filePath);
  client.commands.set(command.data.name, command);
}

// Client Events
client.once("ready", (c) => {
  console.log(`Ready as ${c.user.tag}`);
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) return;

  const command = client.commands.get(interaction.commandName);

  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    await interaction.reply({
      content: "There was an error while executing this command!",
      ephemeral: true,
    });
  }
});

mongoose
  .connect(process.env.MONGODB_SRV)
  .then(() => {
    console.log("Connected to database");
  })
  .catch((e) => {
    console.log(e);
  });

client.login(token);
