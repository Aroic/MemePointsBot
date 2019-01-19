const Discord = require("discord.js");
const auth = require('.././auth.json');
const util = require('util');
const fuzzy = require('fuzzyset.js');


const client = new Discord.Client();
const prefix = "!";
const nameConfidence = Number(auth.confidence);

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
	var channel = message.channel;
	//Assumes message format of <cmd> <user>:<points>
	const args = message.content.slice(prefix.length).trim().split(":");
	const cmd = args.shift().toLowerCase();
	var returnArr = [];
	var reply = "Something went wrong, did you format correctly? !<cmd>:<user>:<points> ";
	console.log(util.format("Starting message fn\ncmd = %s\nargs = %s | %d", cmd, args[0], args[1]));
	if (cmd === "memepoints" || cmd === "mp"){
		//Assigning Meme points
		//Scrub input. 
		debugger;
		returnArr = scrubInput(args[0], args[1]);
		console.log(util.format("(MP)Scrubbed Successfully, returned=>\nuser:%s | points:%d", returnArr[0], returnArr[1]));
		//If we passed, apply points and send message.
		if (returnArr[1] === true){		
			var userName = returnArr[0];
			var points = Number(args[1]);
			MemeDictionary[userName] += points;
			reply = (`${userName} has gained ${points} Meme points.`)
		}
		else{
			//We failed, let them know.
			reply = returnArr[0];
		}		
	}
	if (cmd === "toxicpoints" || cmd === "tp"){
		//Assigning Toxic points
		//Scrub input. 
		returnArr = scrubInput(args[0], args[1]);
		console.log(util.format("(TP)Scrubbed Successfully, returned=>\nuser:%s | points:%d", returnArr[0], returnArr[1]));
		//If we passed, apply points and send message.
		if (returnArr[1] === true){		
			var userName = returnArr[0];
			var points = Number(args[1]);
			ToxicDictionary[userName] += points;
			reply = (`${userName} has gained ${points} Toxic points.`);
		}
		else{
			//We failed, let them know.
			reply = returnArr[0];
		}		
	}
	if (cmd === "ranks" || cmd === "r"){
		//Show all scores
		reply = (`\n\tName\t|\tMemePoints\t|\tToxicPoints\n`);
		for (var i = 0; i < our_guild.memberCount; i++ ){
			reply += (`\t${userNames[i]}\t:\t${MemeDictionary[userNames[i]]}\t|\t${ToxicDictionary[userNames[i]]}\n`);
		}
	}
	channel.send(reply)
	.catch(console.error);
});

client.login(auth.token);

// Fill dictionary with 0's.
function FillDictionary(){
	if (our_guild !== null || our_guild !== undefined){
		if (our_guild.memberCount > 0){
			console.log(`Member count: ${our_guild.memberCount}`);
			var arr = our_guild.members.map(m=>m.user.username);
			for (var i = 0; i < our_guild.memberCount; i++){
				console.log(arr[i]);
				MemeDictionary[arr[i]] = Number(0);				
				ToxicDictionary[arr[i]] = Number(0);
				userNames[i] = arr[i];
			}
		}
	}
}

//Scrub the input.
//Returns an array of (string, bool), if bool is false
//then the input is bad and just return an error message.

function scrubInput(user, points){
	console.log(util.format("Scrubbing User Input: %s : %d", user, points));
	var userName = ApproxName(user);
	if (userName === null){
		reply = (`Couldn't find ${user} in this discord! Try again.`);
		return [reply, false];
	}
	if (isNaN(points)){
		reply = (`${points} is not a valid number! Try again.`);
		return [reply, false];
	}
	// If we're here, the username and points are valid.
	return [userName, true];
	
}

//Find approx user with fuzzy search.
//If no valid name is found, return undef.
//fuzzy.get returns a double array [[score, username]]
function ApproxName(nameToSearch){
	console.log("Applying FuzzySearch to %s ", nameToSearch)
	var fuzzyData = FuzzySet(userNames);
	var result = fuzzyData.get(nameToSearch, null, nameConfidence);	
	if (result === null){
		return result;
	}
	console.log(util.format("Result of fuzzy: %s, %d ", result[0][0], result[0][1]))
	return result[0][1];
}