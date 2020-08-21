const Discord = require('discord.js');
const bot = new Discord.Client();
let cron = require('node-cron');
require('dotenv').config();

const token = process.env.TOKEN;

bot.on('ready', () => {
	console.log('Naggy Nemo is alive!');
});

bot.on('message', async (msg) => {
	if (msg.content === '<@!746413258759602246> Who is my lover?') {
		const members = await msg.guild.members.fetch();
		let membersArray = [];
		members.map((member) => {
			membersArray.push(member);
		});
		console.log('hee', membersArray[0]);
		const random = Math.floor(Math.random() * membersArray.length);
		msg.reply(`C'mon! Everyone know your lover is ${membersArray[random].user.username}`);
	} else if (msg.content.includes('<@!746413258759602246>')) {
		msg.reply('Why are you talking to me?! Go do your guild battles!!');
	}
});

bot.once('ready', () => {
	cron.schedule(
		// '0-59 * * * *',
		'0 11 1-31 1-12 0,1,3,4,5,6',
		async () => {
			try {
				const channel = await bot.channels.fetch('698917300040106084');
				if (channel) channel.send('@here 3 hours until GB ends!! Try your best!');
				if (channel) channel.send('<:mongoose:740392968015577121>');
				else console.log('Could not find channel');
			} catch (err) {
				console.error(err);
			}
		},
		{
			scheduled: true,
			timezone: 'Asia/Bangkok',
		}
	);
});

bot.login(token);
