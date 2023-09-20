# Roblox ranking bot 

This is a bot that can be used to rank up people in a Roblox group.

Setup: 
- Make a Discord bot
- Add a Discord webhook to the channel you want to have logs in 
- Rename .env.example to .env and fill out the details:
  - Roblox token: log into Roblox from an incognito tab, copy token, close that tab 
  - Group ID: ID of the group you want to change ranks in 
  - Password: password submitted with every request - helps prevent abuse as you only know the password 
  - Discord token: used to log in to discord
- Install all required Node modules (npm install)
- Run the bot 

To send requests to the bot in Roblox, you could do something like this: 

```lua
local HttpService = game:GetService("HttpService")
local password = "the password defined in the .env file"
local url = "http://your server's ip address:3000/changeRank"
local postData = string.format("userId=%d&requesterId=%d&rankId=%d&password=%s",
	userId, requesterId, rankId, HttpService:UrlEncode(password))

local success, response = pcall(function()
    return HttpService:PostAsync(url, postData, Enum.HttpContentType.ApplicationUrlEncoded, false)
end)

if success then
    local decodedResponse = HttpService:JSONDecode(response)
    if decodedResponse.success then
        RankCache.updateCache(userId, rankId)
    end
    return decodedResponse.success, decodedResponse.error
else
    warn("Error sending HTTP request:", response)
    return false, "An error occurred while sending the request."
end
```
