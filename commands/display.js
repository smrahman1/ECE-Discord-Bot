const {
  SlashCommandBuilder,
  TextInputAssertions,
} = require("@discordjs/builders");
const deadlineModel = require("../models/deadlineSchema");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("display")
    .setDescription("Display courses and deadlines")
    .addStringOption((option) =>
      option.setName("coursecode").setDescription("The course code")
    ),

  async execute(interaction) {
    const coursecode = interaction.options.getString("coursecode");
    let courses = await deadlineModel.find({ coursecode });
    let response = "";

    if (!courses) {
      courses = await DeadlineModel.find();
    }
    courses.forEach((course) => {
      course.deadlineArray = course.deadlineArray.filter(
        (assign) => assign.status === 1
      );
    });

    courses.forEach((course) => {
      if (course.deadlineArray.length !== 0) {
        response += `***${course.courseCode}***\n`;
        course.deadlineArray.forEach((assignment) => {
          response += `${assignment.title ? assignment.title : ""} ${
            assignment.date ? assignment.date : ""
          } ${assignment.desc ? assignment.desc : ""}\n`;
        });
      }
    });

    await interaction.reply({
      content: response,
      // ephemeral: true,
    });
  },
};
