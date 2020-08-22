const Discord = require('discord.js');
const bot = new Discord.Client();
let cron = require('node-cron');
require('dotenv').config();
const token = process.env.TOKEN;
const pexelsAPI = process.env.PEXEL;
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

const fetchPxels = async (query) => {
	let url = `https://api.pexels.com/v1/search?query=${query}&per_page=10`;
	let data = await fetch(url, {
		method: 'GET',
		headers: { Authorization: pexelsAPI },
	});
	let response = await data.json();
	let photos = response.photos;
	if (photos.length > 0) {
		let random = Math.floor(Math.random() * photos.length);
		return photos[random].src.landscape;
	} else return '';
};

bot.on('message', async (msg) => {
	let message = msg.content.replace(/\s+/g, ' ').trim();
	let words = message.split(' ');
	if (words[0] === '<@!746413258759602246>' || words[0] === '<@746413258759602246>') {
		if (
			words[1].toLowerCase() === 'is' ||
			words[1].toLowerCase() === 'are' ||
			words[1].toLowerCase() === 'will' ||
			words[1].toLowerCase() === 'do' ||
			words[1].toLowerCase() === 'does' ||
			words[1].toLowerCase() === 'am' ||
			words[1].toLowerCase() === 'can' ||
			words[1].toLowerCase() === 'could' ||
			words[1].toLowerCase() === 'may' ||
			words[1].toLowerCase() === 'might' ||
			words[1].toLowerCase() === 'would'
		) {
			let answer = Math.floor(Math.random() * 2) === 0 ? 'yes' : 'no';
			msg.channel.send(`My dad says ${answer}!`);
			return;
		}
		if (words[1].toLowerCase() === 'show' && words[2].toLowerCase() === 'me') {
			let keyword = message.split(' ').slice(3).join(' ');
			let url = await fetchPxels(keyword);
			if (!url) {
				msg.channel.send(`I can't find '${keyword}' on Pexels. :(`);
			} else
				msg.channel.send(`I found this on Pexels for '${keyword}':`, {
					files: [url],
				});
			return;
		}
		if (message.includes('dog') || message.includes('cat')) {
			if (message.includes('dog')) {
				let url = await fetchDog();
				msg.channel.send({
					files: [url],
				});
			}
			if (message.includes('cat')) {
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
		if (words[1].toLowerCase() === 'who') {
			await msg.channel.send(`C'mon! Everyone knows it's ${person}!!`);
			// } else if (message.startsWith('<@!746413258759602246>') && message.endsWith('?')) {
			// 	await msg.channel.send(eightball);
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
