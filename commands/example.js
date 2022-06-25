const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("example")
    .setDescription("Replies with Pong!")
    .addStringOption((option) =>
      option.setName("input").setDescription("Enter a string")
    ),
  async execute(interaction) {
    const string = interaction.options.getString("input");
    console.log(string);

    await interaction.reply(
      `Server name: ${interaction.guild.name}\nTotal members: ${interaction.guild.memberCount}`
    );
  },
};
