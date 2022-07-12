const {
  SlashCommandBuilder,
  TextInputAssertions,
} = require("@discordjs/builders");

const getArray = require("../getChoices");
const deadlineModel = require("../models/deadlineSchema");

let tempArray = [
  { name: "ECE140", value: "ECE140" },
  { name: "ECE106", value: "ECE106" },
  { name: "ECE105", value: "ECE105" },
];

let monthArray = [
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

let days = [];
for (let i = 1; i <= 25; i++) {
  days.push({ name: i.toString(), value: i.toString() });
}

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
        .setName("day")
        .setDescription("Day (Number)")
        .setRequired(true)
        .addChoices(...days)
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
        .setDescription("Year23")
        .setRequired(true)
        .addChoices(...years)
    )
    .addStringOption((option) =>
      option.setName("desc").setDescription("Description for deadline")
    ),
  async execute(interaction) {
    const courseCode = interaction.options.getString("coursecode");
    const date = interaction.options.getString("date");
    const title = interaction.options.getString("title");
    const desc = interaction.options.getString("desc");
    const addCourse = await deadlineModel.findOne({ courseCode });
    if (addCourse) {
      addCourse.deadlineArray.push({
        title,
        date,
        desc,
        status: 1,
      });
      await addCourse.save();
    }
    await interaction.reply({
      content: `Deadline has been added!`,
      // ephemeral: true,
    });
  },
};
