const {
  SlashCommandBuilder,
  TextInputAssertions,
} = require("@discordjs/builders");

const deadlineModel = require("../models/deadlineSchema");
const moment = require("moment");
moment.tz.setDefault("America/Toronto");
const monthArray = [
  { name: "January", value: "January" },
  { name: "February", value: "February" },
  { name: "March", value: "March" },
  { name: "April", value: "April" },
  { name: "May", value: "May" },
  { name: "June", value: "June" },
  { name: "July", value: "July" },
  { name: "August", value: "August" },
  { name: "September", value: "September" },
  { name: "October", value: "October" },
  { name: "November", value: "November" },
  { name: "December", value: "December" },
];

const referenceMonths = {
  January: 0,
  February: 1,
  March: 2,
  April: 3,
  May: 4,
  June: 5,
  July: 6,
  August: 7,
  September: 8,
  October: 9,
  November: 10,
  December: 11,
};

const AMPM = [
  { name: "AM", value: "AM" },
  { name: "PM", value: "PM" },
];

let years = [];
for (let i = 2022; i <= 2026; i++) {
  years.push({ name: i.toString(), value: i.toString() });
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName("add")
    .setDescription("Adds deadline to database")
    .addStringOption((option) =>
      option
        .setName("coursecode")
        .setDescription("The course code numbers")
        .setRequired(true)
        .setAutocomplete(true)
    )
    .addStringOption((option) =>
      option
        .setName("title")
        .setDescription("Title for deadline")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("time")
        .setDescription("What Time is it due (EST) HH:MM")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("ampm")
        .setDescription("Is it AM or PM")
        .setRequired(true)
        .addChoices(...AMPM)
    )
    .addStringOption((option) =>
      option.setName("day").setDescription("Day (Number)").setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("month")
        .setDescription("Month")
        .setRequired(true)
        .addChoices(...monthArray)
    )
    .addStringOption((option) =>
      option
        .setName("year")
        .setDescription("Year")
        .setRequired(true)
        .addChoices(...years)
    )
    .addStringOption((option) =>
      option.setName("desc").setDescription("Description for deadline")
    ),
  async execute(interaction) {
    const courseCode = interaction.options.getString("coursecode");
    const day = interaction.options.getString("day");
    const month = interaction.options.getString("month");
    const year = interaction.options.getString("year");
    const time = interaction.options.getString("time");
    const AMOrPM = interaction.options.getString("ampm");
    const title = interaction.options.getString("title");
    const desc = interaction.options.getString("desc");
    const addCourse = await deadlineModel.findOne({ courseCode });
    let hours = parseInt(time.split(":")[0]);
    if (AMOrPM === "PM") {
      hours += 12;
    }
    console.log(year, referenceMonths[month], day, hours, time.split(":")[1]);
    const deadlineDate = new Date(
      year,
      referenceMonths[month],
      day,
      hours,
      time.split(":")[1]
    );
    let daylightSavings = moment(currDate).isDST();

    deadlineDate.setHours(deadlineDate.getHours() - 6 + daylightSavings);

    if (addCourse) {
      addCourse.deadlineArray.push({
        title,
        date: deadlineDate.toISOString(),
        desc,
        status: 1,
      });
      await addCourse.save();

      const client = interaction.client;
      const currDate = new Date();
      currDate.setHours(currDate.getHours() - 6 + daylightSavings);
      const delay = deadlineDate.getTime() - currDate - 24 * 60 * 60 * 1000;

      let formattedDate = new Date(deadlineDate);
      formattedDate = moment(formattedDate)
        .add(4 - daylightSavings, "hours")
        .format("MMMM D, h:mm A");
      if (delay > 0) {
        const timeout = setTimeout(async () => {
          const channel = client.channels.cache.find(
            (channel) => channel.name === "general"
          );
          channel.send(
            "DEADLINE 1 DAY LEFT FOR COURSE " +
              courseCode +
              " ASSIGNMENT: " +
              title +
              " at " +
              formattedDate
          );
        }, delay);
        global.timeoutArray.push(timeout);
      }
    }
    await interaction.reply({
      content: `Deadline has been added!`,
      ephemeral: true,
    });
  },
};
