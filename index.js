const dotenv = require("dotenv");
const express = require("express");
const { fork } = require("child_process");
const axios = require("axios").default;
const bodyParser = require("body-parser");

dotenv.config();
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

const groupId = process.env.GROUP_ID;
const robloxSecret = process.env.ROBLOX_TOKEN;
const password = process.env.PASSWORD;
const webhookUrl = process.env.WEBHOOK_URL;

let counter = 0;

app.post("/changeRank", async (req, res) => {
  const noblox = require("noblox.js");
  const userId = req.body.userId;
  const rankId = req.body.rankId;
  const requesterId = req.body.requesterId;
  const passwordEntry = req.body.password;

  if (passwordEntry !== password) {
    res.json({ success: false, error: "Incorrect password" });
    return;
  }

  counter++;

  const playerThumbnail =
    (await noblox.getPlayerThumbnail(requesterId, 150, "png", false, "Bust"))[0]
      .imageUrl;
  const requesterName = await noblox.getUsernameFromId(requesterId);
  const userName = await noblox.getUsernameFromId(userId);
  const rankName = (await noblox.getRole(groupId, parseInt(rankId))).name;

  let data = {
    "username": "Ranking Logs for " + requesterName,
    "avatar_url": playerThumbnail,
    "content":
      `[${counter}] **${requesterName}** (ID: ${requesterId}) has requested to rank **${userName}** (ID: ${userId}) to rank **${rankName}**.`,
  };
  await axios.post(webhookUrl, data);

  const child = fork("./changeRankModule.js"); // Path to the changeRankModule.js file
  const message = {
    type: "changeRank",
    payload: {
      robloxSecret,
      groupId,
      userId,
      rankId,
    },
  };

  child.send(message);

  child.on("message", async (result) => {
    if (result.success) {
      data.content =
        `**${requesterName}** (ID: ${requesterId}) has ranked **${userName}** (ID: ${userId}) to rank **${rankName}**.`;
      await axios.post(webhookUrl, data);
      res.json({ success: true });
    } else {
      data.content =
        `**${requesterName}** (ID: ${requesterId})'s ranking request failed due to an error: \`${result.error}\``;
      await axios.post(webhookUrl, data);
      res.json({ success: false, error: result.error });
    }
    child.kill(); // Terminate the child process
  });
});

app.listen(3000, () => console.log("Listening on port 3000"));
