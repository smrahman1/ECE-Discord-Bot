require("dotenv").config();
const moment = require("moment");
moment.tz.setDefault("America/Toronto");
global.timeoutArray = [];

const token = process.env.DISCORD_TOKEN;

const deadlineModel = require("./models/deadlineSchema");
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
  if (interaction.isCommand()) {
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
  }
  if (interaction.isAutocomplete()) {
    if (interaction.commandName === "add") {
      const focusedValue = interaction.options.getFocused(true);
      if (focusedValue.name === "coursecode") {
        const choices = await deadlineModel.find({}, { courseCode: 1, _id: 0 });
        const filtered = choices.filter((choice) => {
          return choice.courseCode.startsWith(focusedValue.value);
        });
        const filteredOptions = filtered.map((filter) => filter.courseCode);
        await interaction.respond(
          filteredOptions.map((choice) => ({ name: choice, value: choice }))
        );
      }
    }
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

const setTimeouts = async () => {
  const courses = await deadlineModel.find({});
  courses.forEach((course) => {
    course.deadlineArray.forEach((deadline) => {
      const ONE_DAY = 1000 * 60 * 60 * 24;
      const now = moment();
      const deadlineDate = moment(deadline.date);

      const date = moment(deadlineDate);
      now.setHours(now.getHours() - 5 + moment(now).isDST());
      const delay = date.valueOf() - now - ONE_DAY;

      let formattedDate = moment(deadlineDate);
      formattedDate = moment(formattedDate)
        .add(5 - moment(now).isDST(), "hours")
        .format("MMMM D, h:mm A");

      if (delay > 0 && deadlineDate.getTime() - now.getTime() <= ONE_DAY * 21) {
        console.log(
          "ADDING TIMEOUT TO " +
            course.courseCode +
            "\nDEADLINE NAME: " +
            deadline.title
        );
        const timeoutId = setTimeout(async () => {
          const channel = client.channels.cache.find(
            (channel) => channel.name === "general"
          );
          channel.send(
            "DEADLINE 1 DAY LEFT FOR COURSE " +
              course.courseCode +
              " ASSIGNMENT: " +
              deadline.title +
              " at " +
              formattedDate
          );
        }, delay);
        global.timeoutArray.push(timeoutId);
      }
    });
  });
};

// Reset all timeouts every 5 days to prevent timeout integer overflow
setInterval(() => {
  global.timeoutArray.forEach((timeout) => {
    clearTimeout(timeout);
  });
  global.timeoutArray = [];
  setTimeouts();
}, 432000000);

setTimeouts();
client.login(token);
