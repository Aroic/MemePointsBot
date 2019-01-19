const Discord = require("discord.js");
const auth = require('.././auth.json');
const util = require('util');

const client = new Discord.Client();
const prefix = "!";

//The specific ID of piwi.
const PIWI_GUILD_ID = auth.guild_id;

// dictionary of users => (memepoints, toxicpoints)
var MemeDictionary = [];
var ToxicDictionary = [];
var our_guild;
var userNames = [];

client.on("ready", () => {
	console.log(`Bot has started, connected to server ${client.guilds.size}.\nUsing guild ID: ${PIWI_GUILD_ID}`);
	our_guild = client.guilds.get(PIWI_GUILD_ID);
	FillDictionary();
});

client.on("message", async message => {
	//ignore other bots
	if(message.author.bot) return;
	
	//ignore messages not meant for us
	if (message.content.indexOf(prefix) !== 0) return;
	
	//Assumes message format of <cmd> <user> <points>
	const args = message.content.slice(prefix.length).trim().split(" ");
	const cmd = args.shift().toLowerCase();
	var reply;
	
	if (cmd === "memepoints" || cmd === "mp"){
		//Assigning Meme points
		if (userNames.indexOf(args[0]) === -1){
			reply = (`${args[0]} is not a user in this discord. Try again.`);
		}
		else if (isNaN(args[1])){
			reply = (`${args[0]} is not a valid number`);
		}
		else{
			var index = userNames.indexOf(args[0]);
			MemeDictionary[index] += Number(args[1]);
			reply = (`${args[0]} has gained ${args[1]} Meme points.`)
		}
		
	}
	if (cmd === "toxicpoints" || cmd === "tp"){
		//Assigning toxic points
		if (userNames.indexOf(args[0]) === -1){
			reply = (`${args[0]} is not a user in this discord. Try again.`);
		}
		else if (isNaN(args[1])){
			reply = (`${args[0]} is not a valid number`);
		}
		else{
			var index = userNames.indexOf(args[0]);
			ToxicDictionary[index] += Number(args[1]);
			reply = (`${args[0]} has gained ${args[1]} Toxic points.`)
		}
	}
	if (cmd === "ranks" || cmd === "r"){
		//Show all scores
		reply = (`\n\tName\t|\tMemePoints\t|\tToxicPoints\n`)
		for (var i = 0; i < our_guild.memberCount; i++ ){
			reply += (`\t${userNames[i]}\t:\t${MemeDictionary[i]}\t|\t${ToxicDictionary[i]}\n`)
		}
	}
	message.reply(reply);
});

client.login(auth.token);

// Fill dictionary with 0's.
function FillDictionary(){
	if (our_guild !== null || our_guild !== undefined){
		if (our_guild.memberCount > 0){
			console.log(`Member count: ${our_guild.memberCount}`);
			var arr = our_guild.members.map(m=>m.user.username);
			var arrUserNames = our_guild.members.map(m=>m.user.username);
			for (var i = 0; i < our_guild.memberCount; i++){
				console.log(arr[i]);
				MemeDictionary[i] = Number(0);				
				ToxicDictionary[i] = Number(0);
				userNames[i] = arr[i];
			}
		}
	}
}