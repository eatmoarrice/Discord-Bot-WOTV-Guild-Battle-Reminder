const Discord = require('discord.js');
const bot = new Discord.Client();
let cron = require('node-cron');
require('dotenv').config();
const token = process.env.TOKEN;
const pexelsAPI = process.env.PEXEL;
const unsplashAK = process.env.UNSPLASH_ACCESSKEY;
const WOTV = process.env.WOTV_BACKEND;
const fetch = require('node-fetch');

const yes = [
	`Yes!`,
	`My daddy says yes!`,
	`Oh, it's a little fuzzy but I think my crystal ball says yes...`,
	`Absolutely!`,
	`Yes, I'm sure!`,
	`For sure!`,
	`Yup!`,
	`Yeah, it seems so.`,
	`Surprisingly, yes.`,
	`Obviously duh!`,
	`HELL YES!`,
	`Abso-fucking-lutely!`,
	`FUCK YEAH!`,
	`A million times, yes!`,
	`That is true. Now shut up.`,
	`A resounding yes!`,
	`Thumbs-up from me!`,
	`Of course yes!`,
	`Of course! Do you even need to ask?`,
	`Duh! Everybody knows that!`,
];
const no = [
	`No, I don't think so.`,
	`Oh man, why do you ask? But that's a NO from me.`,
	`Yikes! No way!`,
	`Sadly, no.`,
	`HELL NAW!`,
	`Nope!`,
	`You thought I'd say yes, but it's a hard NO!`,
	`No way Jose!`,
	`Maybe. What's it to you?`,
	`Sorry but no.`,
	`Sorry I just ran out of fucks to give.`,
	`My papa tells me no.`,
	// `Dory keeps saying 'no' but I'm not sure if she's even talking to me.`,
	`My fortune cookie says no.`,
	`Why don't you just roll a dice? My vote is no.`,
	`There’s a 100% chance that I’m going say no to that one.`,
];

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
	let url = `https://api.unsplash.com/search/photos?query=${query}`;
	let data = await fetch(url, {
		method: 'GET',
		headers: { Authorization: `Client-ID ${unsplashAK}` },
	});
	let response = await data.json();
	response = response.results;
	if (response.length > 0) {
		let random = Math.floor(Math.random() * response.length);
		return response[random];
	} else return '';
};

const pickOne = (array) => {
	let choice = array[Math.floor(Math.random() * array.length)].replace(',', '').trim();
	return `'${choice.charAt(0).toUpperCase() + choice.slice(1)}'`;
};

function setTimeout_(fn, delay) {
	var maxDelay = Math.pow(2, 31) - 1;

	if (delay > maxDelay) {
		var args = arguments;
		args[1] -= maxDelay;

		return setTimeout(function () {
			setTimeout_.apply(undefined, args);
		}, maxDelay);
	}

	return setTimeout.apply(undefined, arguments);
}

const getTimeout = (messageArray) => {
	let timer = 0; // in seconds

	let minuteIndex = messageArray.findIndex((item) => item == 'minute(s)');
	let secondIndex = messageArray.findIndex((item) => item == 'second(s)');
	let hourIndex = messageArray.findIndex((item) => item == 'hour(s)');
	let dayIndex = messageArray.findIndex((item) => item == 'day(s)');

	if (secondIndex > 0 && !isNaN(messageArray[secondIndex - 1])) {
		timer += parseInt(messageArray[secondIndex - 1]);
	}
	if (minuteIndex > 0 && !isNaN(messageArray[minuteIndex - 1])) {
		timer += parseInt(messageArray[minuteIndex - 1]) * 60;
	}
	if (hourIndex > 0 && !isNaN(messageArray[hourIndex - 1])) {
		timer += parseInt(messageArray[hourIndex - 1]) * 3600;
	}
	if (dayIndex > 0 && !isNaN(messageArray[dayIndex - 1])) {
		timer += parseInt(messageArray[dayIndex - 1]) * 3600 * 24;
	}
	return timer;
};

const getBossData = async (name) => {
	console.log(name);
	let url = `${WOTV}/boss/name/${name}`;
	let data = await fetch(url);
	let response = await data.json();
	return response.data;
};

const getAllBosses = async () => {
	let url = `${WOTV}/boss/`;
	let data = await fetch(url);
	let response = await data.json();
	let names = response.data.map((item) => item.name);
	return names;
};

const getRes = async (name) => {
	let url = `${WOTV}/characters/${name}`;
	let data = await fetch(url);
	let response = await data.json();
	console.log(response);
	return response.data.resImgUrl;
};

bot.on('message', async (msg) => {
	let message = msg.content.replace(/\s+/g, ' ').trim().toLowerCase();
	let words = message.split(' ');

	if (words[0] === '<@!746413258759602246>' || words[0] === '<@746413258759602246>' || words[0] === '<@&746420675178135623>') {
		// LIST COMMANDS
		if (words[1] === 'list' && words[2] === 'commands') {
			return msg.channel.send('Type "list raid" to see all the bosses. Type "raid [name of boss]" to see details of a boss.');
		}

		if (words[1] === 'list' && words[2] === 'raid' && !words[3]) {
			let allBosses = await getAllBosses();
			return msg.channel.send(`I have data for: ${allBosses.join(', ')}`);
		}
		// UNIT RES
		if (words.length === 3 && words[1] === 'res') {
			let imgURL = await getRes(words[2]);
			return msg.channel.send(imgURL);
		}

		// RAID
		if (words[1] === 'raid' && words[2]) {
			let bossName = [];
			for (let i = 2; i < words.length; i++) {
				bossName.push(words[i]);
			}
			let data = await getBossData(bossName.join(' '));
			msg.channel.send(`Raid Boss: ${data.name}  Element: ${data.element}`);
			msg.channel.send(`Description: ${data.description}`);
			return msg.channel.send(data.url);
		}

		// PICK ONE
		if (words[1] === 'pick' && words[2] === 'one:') {
			let choices = [];
			for (let i = 3; i < words.length; i++) {
				choices.push(words[i]);
			}
			choices = choices.join(' ').split(',');
			let choice = pickOne(choices);
			return msg.reply(`${choice} sounds good!`);
		}

		// FUCK YOU
		if (words[1] === 'fu' || (words[1] === 'fuck' && words[2] === 'you')) {
			return msg.reply(`Fuck you too, bitch!`);
		}

		// MADE BY PANDA
		if (message.includes('who') && message.includes('made') && message.includes('you')) {
			return msg.reply(`<@!240277779415957504> made me. Who's your Daddy?`);
		}

		// SITE
		if (message.includes('site')) {
			return msg.reply(`https://wotv-guide.com`);
		}

		// EMOJIS
		if (message.includes('emojis')) {
			return msg.reply(`You can find our emojis at https://wotv-guide.com/miscellaneous or ask for help in <#746278576717824001>`);
		}

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

		// I LOVE YOU
		if (message.includes('i love you') || message.includes('i wuv you')) {
			return msg.channel.send('I love me too! Now disappear from my sight!');
		}
		// REMINDER
		if (words[1] == 'remind' && words[2] == 'me' && words[3] == 'in' && words.includes('to') && words.length > 6) {
			let remindTextArray = [];
			let timeArray = [];
			let toIndex = words.findIndex((item) => item == 'to');
			console.log(toIndex);
			for (let i = 4; i < words.length; i++) {
				if (i < toIndex) timeArray.push(words[i]);
				else remindTextArray.push(words[i]);
			}
			if (words.includes('year') || words.includes('month') || words.includes('years') || words.includes('months')) {
				return msg.reply(`I can't remember that long! I'm a fish ffs!`);
			}

			for (let i = 0; i < timeArray.length; i++) {
				if (timeArray[i].includes('min')) timeArray[i] = 'minute(s)';
				if (timeArray[i].includes('sec')) timeArray[i] = 'second(s)';
				if (timeArray[i].includes('hr') || timeArray[i].includes('hour')) timeArray[i] = 'hour(s)';
				if (timeArray[i].includes('day')) timeArray[i] = 'day(s)';
			}

			let seconds = getTimeout(timeArray);
			remindTextArray.forEach((item, index) => {
				if (item == 'me' || item == 'i') remindTextArray[index] = 'you';
				if (item == 'am') remindTextArray[index] = 'are';
				if (item == "i'm") remindTextArray[index] = "you're";
				if (item == 'you') remindTextArray[index] = 'Nemo';
				if (item == "you're") remindTextArray[index] = "I'm";
				if (item == 'your') remindTextArray[index] = 'my';
				if (item == 'yours') remindTextArray[index] = 'mine';
				if (item == 'mine') remindTextArray[index] = 'yours';
				if (item == 'my') remindTextArray[index] = 'your';
			});

			let niceMessage = remindTextArray.join(' ');
			let timeMessage = timeArray.join(' ');
			msg.reply(`OK I'll remind you to ${niceMessage} in ${timeMessage}!`);
			setTimeout_(() => msg.reply(`I am here to remind you ${niceMessage}!`), seconds * 1000);
			return;
		}
		// YES/NO QUESTIONS
		if (
			words[1] === 'is' ||
			words[1] === 'are' ||
			words[1] === 'will' ||
			words[1] === 'do' ||
			words[1] === 'does' ||
			words[1] === 'did' ||
			words[1] === 'am' ||
			words[1] === 'can' ||
			words[1] === 'could' ||
			words[1] === 'may' ||
			words[1] === 'might' ||
			words[1] === 'would' ||
			words[1] === 'shall' ||
			words[1] === 'should' ||
			words[1] === 'was' ||
			words[1] === 'were' ||
			words[1] === 'have' ||
			words[1] === 'has' ||
			words[1] === 'had' ||
			((words[1] === 'how' || words[1] === 'what') && words[2] === 'about')
		) {
			let answer = Math.floor(Math.random() * 2) === 0 ? 'yes' : 'no';
			if (answer === 'yes') {
				return msg.channel.send(yes[Math.floor(Math.random() * yes.length)]);
			} else {
				return msg.channel.send(no[Math.floor(Math.random() * no.length)]);
			}
			return;
		}

		// PEXELS
		// if (words[1] === 'show' && words[2] === 'me') {
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
		if (words[1] === 'show' && words[2] === 'me') {
			let keyword = message.split(' ').slice(3).join(' ');
			let photoObject = await fetchUnsplash(keyword);
			if (!photoObject) {
				msg.channel.send(`I can't find '${keyword}' on Unsplash. :(`);
			} else {
				msg.channel.send(`Photo by ${photoObject.user.name}`);
				if (photoObject.description) msg.channel.send(`Description: ${photoObject.description}`);
				else if (photoObject.alt_description) msg.channel.send(`Description: ${photoObject.alt_description}`);
				msg.channel.send(photoObject.urls.small);
				msg.channel.send(`<${photoObject.links.html}>`);
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
		if (words[1] === 'who') {
			await msg.channel.send(`C'mon! Everyone knows it's ${person}!!`);
			// } else if (message.startsWith('<@!746413258759602246>') && message.endsWith('?')) {
			// 	await msg.channel.send(eightball);
		} else msg.reply('Why are you talking to me?! Go do your guild battles!!');
	}
});

bot.once('ready', () => {
	cron.schedule(
		// min hour day month dayOfWeek
		'0 11 1-31 1-12 0,1,3,4,5,6',
		async () => {
			try {
				const channel = await bot.channels.fetch('698917300040106084');
				if (channel) channel.send('@everyone 3 hours until GB ends!! Try your best!');
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
