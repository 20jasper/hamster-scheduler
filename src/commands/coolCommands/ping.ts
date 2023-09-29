import { SlashCommandBuilder } from 'discord.js';
import type { CommandInteraction } from 'discord.js';

const pingCommand = {
	// bot command
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Replies with HammerTime!'),
	async execute(interaction: CommandInteraction): Promise<void> {
		await interaction.reply('Ping Pong!');
	},
};

export default pingCommand;
