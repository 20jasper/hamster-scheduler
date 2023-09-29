// import job from './cron.js';
import 'dotenv/config';
import { Client, Events, GatewayIntentBits } from 'discord.js';
import getCommands from './deployCommands.js';

// job.start();

const client = new Client({ intents: [GatewayIntentBits.Guilds] });
client.commands = await getCommands();

// When the client is ready, run this code (only once)
// We use 'c' for the event parameter to keep it separate from the already defined 'client'
client.once(Events.ClientReady, (c) => {
	console.log(`Ready! Logged in as ${c.user.tag}`);
});

client.on(Events.InteractionCreate, async (interaction) => {
	if (!interaction.isChatInputCommand()) return;

	const command = interaction.client.commands.get(interaction.commandName);

	if (!command) {
		console.error(`No command matching ${interaction.commandName} was found.`);
		return;
	}

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		if (interaction.replied || interaction.deferred) {
			await interaction.followUp({
				content: 'There was an error while executing this command!',
				ephemeral: true,
			});
		} else {
			await interaction.reply({
				content: 'There was an error while executing this command!',
				ephemeral: true,
			});
		}
	}
});

// client.commands = new Collection();
// console.log(pingCommand.data.name, pingCommand);
// client.commands.set(pingCommand.data.name, pingCommand);

client.login(process.env.DISCORD_TOKEN);
