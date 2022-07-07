const {
  SlashCommandBuilder,
  TextInputAssertions,
} = require("@discordjs/builders");

const deadlineModel = require("../models/deadlineSchema");

let tempArray = [
  { name: "ECE140", value: "ECE140" },
  { name: "ECE106", value: "ECE106" },
  { name: "ECE105", value: "ECE105" },
];

module.exports = {
  data: new SlashCommandBuilder()
    .setName("delete")
    .setDescription("Deletes a deadline from the database")
    .addStringOption((option) =>
      option
        .setName("coursecode")
        .setDescription("The course code numbers")
        .setRequired(true)
        .addChoices(...tempArray)
    )
    .addStringOption((option) =>
      option
        .setName("title")
        .setDescription("Title for deadline")
        .setRequired(true)
    ),
  async execute(interaction) {
    const courseCode = interaction.options.getString("coursecode");
    const title = interaction.options.getString("title");
    const deleteCourse = await deadlineModel.findOne({ courseCode });

    if (deleteCourse) {
      deleteCourse.deadlineArray = deleteCourse.deadlineArray.map(
        (deadline) => {
          if (deadline.title === title) {
            deadline.status = 0;
          }
          return deadline;
        }
      );
    }
    deleteCourse.markModified("deadlineArray");
    await deleteCourse.save();
    await interaction.reply({
      content: `Deadline has been deleted!`,
      // ephemeral: true,
    });
  },
};
