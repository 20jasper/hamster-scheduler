import 'dotenv/config';
import { Collection, REST, Routes } from 'discord.js';
import fs from 'node:fs';
import path from 'node:path';
import * as url from 'url';
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function getCommands(): Promise<Collection<any, any>> {
	const commands = new Collection();
	const commandsArr: string[] = [];
	// Grab all the command files from the commands directory you created earlier
	const foldersPath = path.join(__dirname, 'commands');
	const commandFolders = fs.readdirSync(foldersPath);
	console.log({ commandFolders });

	for (const folder of commandFolders) {
		// Grab all the command files from the commands directory you created earlier
		const commandsPath = path.join(foldersPath, folder);
		const commandFiles = fs
			.readdirSync(commandsPath)
			.filter((file: string) => file.endsWith('.js'));
		// Grab the SlashCommandBuilder#toJSON() output of each command's data for deployment
		console.log({ commandFiles });
		for (const file of commandFiles) {
			const filePath = path.join(commandsPath, file);
			const { default: command } = await import(filePath);

			if ('data' in command && 'execute' in command) {
				commands.set(command.data.name, command);
				commandsArr.push(command.data.toJSON());
			} else {
				console.log(
					`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`,
				);
			}
		}
	}

	console.log({ commands });
	// Construct and prepare an instance of the REST module
	const rest = new REST().setToken(process.env.DISCORD_TOKEN!);

	// and deploy your commands!
	try {
		console.log(
			`Started refreshing ${commands.size} application (/) commands.`,
		);

		// The put method is used to fully refresh all commands in the guild with the current set
		const data = (await rest.put(
			Routes.applicationCommands(process.env.CLIENT_ID!),
			{ body: commandsArr },
		)) as unknown[];

		console.log(
			`Successfully reloaded ${data.length} application (/) commands.`,
		);
	} catch (error) {
		// And of course, make sure you catch and log any errors!
		console.error(error);
	}

	return commands;
}

export default getCommands;
