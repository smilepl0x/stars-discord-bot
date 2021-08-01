
const cloneChannelAndDelete = async (channel) => {
  try {
    const newChannel = await channel.clone();
    console.log("Cloned Channel. New ID: " + newChannel.id);
    channel.delete();
  } catch (e) {
    console.log(`There was an error: ${e}`);
    throw new Error("Whoopsie. I couldn't nuke the messages.");
  }
};

const reply = (client, iId, iToken, message = "Done.") => {
  client.api.interactions(iId, iToken).callback.post({
    data: {
      type: 4,
      data: {
        content: message,
      },
    },
  });
};

exports.cloneChannelAndDelete = cloneChannelAndDelete;
exports.reply = reply;
