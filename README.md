# MemePointsBot
Discord Bot for tracking meme points

Very basic node js bot for discord.
Uses discord.js library found here: https://github.com/discordjs/discord.js/
And FuzzySet.js found here: https://github.com/Glench/fuzzyset.js

## NOTES
Assumes your auth.json file is one directory higher, and contains your `token`, `guild_id` and `confidence` values.


`Token` is the token for your bot obtained from https://discordapp.com/developers/applications/
`guild_id` is the id of the guild this bot is in, currently only 1 is supported.
`confidence` is the confidence in which fuzzySearch decides the user name that is provided by the user. (0-1), 0 will grab any name randomly, 1 requires an exact match (case-insensitive).
