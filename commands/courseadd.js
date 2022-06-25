const {
  SlashCommandBuilder,
  TextInputAssertions,
} = require("@discordjs/builders");
const deadlineModel = require("../models/deadlineSchema");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("courseadd")
    .setDescription("Adds a course to selection")
    .addStringOption((option) =>
      option
        .setName("coursecode")
        .setDescription("The course code")
        .setRequired(true)
    ),

  async execute(interaction) {
    const coursecode = interaction.options.getString("coursecode");
    const course = new deadlineModel({
      courseCode: coursecode,
      deadlineCount: 0,
      deadlineArray: [],
    });
    course.deadlineArray.push({ name: "hola", test: "test" });
    await course.save();

    await interaction.reply({
      content: `Course has been added!`,
      // ephemeral: true,
    });
  },
};
