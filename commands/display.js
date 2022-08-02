const {
  SlashCommandBuilder,
  TextInputAssertions,
} = require("@discordjs/builders");
const deadlineModel = require("../models/deadlineSchema");
const displayEmbed = require("../embed/displayDeadlines");

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
    const currDate = new Date();
    courses.forEach((course) => {
      course.deadlineArray = course.deadlineArray.filter((assignment) => {
        const assignmentDate = new Date(assignment.date);
        return assignment.status === 1 && assignmentDate >= currDate;
      });
    });

    const embed = displayEmbed(courses);
    await interaction.reply({
      embeds: [embed],
    });
  },
};
