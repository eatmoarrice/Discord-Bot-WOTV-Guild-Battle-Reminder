const Discord = require('discord.js');
const bot = new Discord.Client();
let cron = require('node-cron');
require('dotenv').config();
const token = process.env.TOKEN;
const pexelsAPI = process.env.PEXEL;
const unsplashAK = process.env.UNSPLASH_ACCESSKEY;
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

const fetchMeme = async () => {
	let url = 'https://meme-api.herokuapp.com/gimme';
	let data = await fetch(url);
	let response = await data.json();
	return { title: response.title, url: response.url };
};

const fetchJoke = async (options) => {
	let option = 'Any';
	if (options.join('')) {
		option = options.filter((str) => str).join(',');
	}
	let url = `https://sv443.net/jokeapi/v2/joke/${option}?blacklistFlags=nsfw,racist,sexist`;
	let data = await fetch(url);
	let response = await data.json();
	return response;
};

const fetchDadJoke = async () => {
	let url = `https://icanhazdadjoke.com/`;
	let data = await fetch(url, {
		method: 'GET',
		headers: { Accept: 'application/json' },
	});
	let response = await data.json();

	return response.joke;
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

const fetchUnsplash = async (query) => {
	let url = `https://api.unsplash.com/photos/random?query=${query}&count=5`;
	let data = await fetch(url, {
		method: 'GET',
		headers: { Authorization: `Client-ID ${unsplashAK}` },
	});
	let response = await data.json();
	if (response.length > 0) {
		let random = Math.floor(Math.random() * response.length);
		return response[random];
	} else return '';
};

bot.on('message', async (msg) => {
	let message = msg.content.replace(/\s+/g, ' ').trim();
	let words = message.split(' ');
	if (words[0] === '<@!746413258759602246>' || words[0] === '<@746413258759602246>') {
		// MEME
		if (message.includes('meme')) {
			let meme = await fetchMeme();
			msg.channel.send(meme.title, {
				files: [meme.url],
			});
			return;
		}

		// DAD JOKE
		if (message.includes('dad joke')) {
			let dadjoke = await fetchDadJoke();
			msg.channel.send(dadjoke);
			return;
		}
		// NORMAL JOKE
		if (message.includes('joke') || message.includes(' pun')) {
			let options = [];
			if (message.includes('dark')) {
				options.push('Dark');
			}
			if (message.includes('programming')) {
				options.push('Programming');
			}
			if (message.includes('pun')) {
				options.push('Pun');
			}
			let joke = await fetchJoke(options);
			if (joke.setup) {
				msg.channel.send(joke.setup);
				setTimeout(function () {
					msg.channel.send(joke.delivery);
				}, 3000);
			}
			if (joke.joke) {
				msg.channel.send(joke.joke);
			}
			return;
		}

		// YES/NO QUESTIONS
		if (
			words[1].toLowerCase() === 'is' ||
			words[1].toLowerCase() === 'are' ||
			words[1].toLowerCase() === 'will' ||
			words[1].toLowerCase() === 'do' ||
			words[1].toLowerCase() === 'does' ||
			words[1].toLowerCase() === 'did' ||
			words[1].toLowerCase() === 'am' ||
			words[1].toLowerCase() === 'can' ||
			words[1].toLowerCase() === 'could' ||
			words[1].toLowerCase() === 'may' ||
			words[1].toLowerCase() === 'might' ||
			words[1].toLowerCase() === 'would' ||
			words[1].toLowerCase() === 'shall' ||
			words[1].toLowerCase() === 'should' ||
			words[1].toLowerCase() === 'was' ||
			words[1].toLowerCase() === 'were' ||
			words[1].toLowerCase() === 'have' ||
			words[1].toLowerCase() === 'has' ||
			words[1].toLowerCase() === 'had'
		) {
			let answer = Math.floor(Math.random() * 2) === 0 ? 'yes' : 'no';
			msg.channel.send(`My dad says ${answer}!`);
			return;
		}

		// PEXELS
		// if (words[1].toLowerCase() === 'show' && words[2].toLowerCase() === 'me') {
		// 	let keyword = message.split(' ').slice(3).join(' ');
		// 	let url = await fetchPxels(keyword);
		// 	if (!url) {
		// 		msg.channel.send(`I can't find '${keyword}' on Pexels. :(`);
		// 	} else
		// 		msg.channel.send(`I found this on Pexels for '${keyword}':`, {
		// 			files: [url],
		// 		});
		// 	return;
		// }

		// UNSPLASH
		if (words[1].toLowerCase() === 'show' && words[2].toLowerCase() === 'me') {
			let keyword = message.split(' ').slice(3).join(' ');
			let photoObject = await fetchUnsplash(keyword);
			if (!photoObject) {
				msg.channel.send(`I can't find '${keyword}' on Unsplash. :(`);
			} else {
				msg.channel.send(`Photo by ${photoObject.user.name}`);
				msg.channel.send(photoObject.urls.small);
			}
			return;
		}

		// DOG PIC
		if (message.includes('dog')) {
			let url = await fetchDog();
			return msg.channel.send({
				files: [url],
			});
		}

		// CAT PIC
		if (message.includes('cat')) {
			let url = await fetchCat();
			return msg.channel.send({
				files: [url],
			});
		}

		// GUILD BATTLE REMINDER
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
