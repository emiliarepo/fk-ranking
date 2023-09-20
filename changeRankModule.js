
const rankingNoblox = require("noblox.js");

async function changeRank(robloxSecret, groupId, userId, rankId) {
  await rankingNoblox.setCookie(robloxSecret);
  console.log("changing rank for " + userId + " to " + rankId + " in " + groupId);
  await rankingNoblox.setRank(groupId, userId, parseInt(rankId));
  console.log("rank updated successfully");
}

process.on("message", async (message) => {
  if (message.type === "changeRank") {
    const { robloxSecret, groupId, userId, rankId } = message.payload;
    try {
      await changeRank(robloxSecret, groupId, userId, rankId);
      process.send({ success: true });
    } catch (err) {
      process.send({ success: false, error: err.message });
    }
  }
});
