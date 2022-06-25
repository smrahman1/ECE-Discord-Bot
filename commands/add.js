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

module.exports = {
  data: new SlashCommandBuilder()
    .setName("add")
    .setDescription("Adds deadline to database")
    .addStringOption((option) =>
      option
        .setName("coursecode")
        .setDescription("The course code numbers")
        .setRequired(true)
        .addChoices(...tempArray)
    )
    .addStringOption((option) =>
      option
        .setName("date")
        .setDescription("Date formatted as: Month/Day")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("title")
        .setDescription("Title for deadline")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("desc")
        .setDescription("Description for deadline")
        .setRequired(false)
    ),
  async execute(interaction) {
    const courseCode = interaction.options.getString("coursecode");
    const date = interaction.options.getString("date");
    const title = interaction.options.getString("title");
    const desc = interaction.options.getString("desc");
    const addCourse = await deadlineModel.findOne({ courseCode });
    addCourse.deadlineArray.push({
      name: "assignment 1",
      date,
      title,
      desc,
    });
    await addCourse.save();

    await interaction.reply({
      content: `Deadline has been added!`,
      // ephemeral: true,
    });
  },
};
