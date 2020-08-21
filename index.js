const Discord = require('discord.js');
const bot = new Discord.Client();
let cron = require('node-cron');
require('dotenv').config();
const token = process.env.TOKEN;
const fetch = require('node-fetch');

bot.on('ready', () => {
	console.log('Naggy Nemo is alive!');
});

const fetchDog = async () => {
	let url = 'https://random.dog/woof.json';
	let data = await fetch(url);
	let response = await data.json();
	return response.url;
};

const fetchCat = async () => {
	let url = 'https://aws.random.cat/meow';
	let data = await fetch(url);
	let response = await data.json();
	return response.file;
};

bot.on('message', async (msg) => {
	console.log(msg.content);
	if (msg.content.startsWith('<@!746413258759602246>')) {
		if (msg.content.includes('dog') || msg.content.includes('cat')) {
			if (msg.content.includes('dog')) {
				let url = await fetchDog();
				msg.channel.send({
					files: [url],
				});
			}
			if (msg.content.includes('cat')) {
				let url = await fetchCat();
				msg.channel.send({
					files: [url],
				});
			}
			return;
		}
		const members = await msg.guild.members.fetch();
		let membersArray = [];
		members.map((member) => {
			membersArray.push(member);
		});
		const random = Math.floor(Math.random() * membersArray.length);
		const person = membersArray[random].user.username;
		if (msg.content.startsWith('<@!746413258759602246> Who is')) {
			await msg.channel.send(`C'mon! Everyone knows it's ${person}!!`);
		} else if (msg.content.startsWith('<@!746413258759602246>') && msg.content.endsWith('?')) {
			await msg.channel.send(eightball);
		} else msg.reply('Why are you talking to me?! Go do your guild battles!!');
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
