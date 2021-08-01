"use strict";
const { token, guild_id, prefix, usernames_to_ignore } = require("../config");
const { data } = require("./commands/slashCommands.json");
const utils = require("./utils");

const Discord = require("discord.js");
const client = new Discord.Client();

let peekMessages = [];

client.once("ready", () => {
  console.log("Ready cap'n");
  data.map((item) =>
    client.api
      .applications(client.user.id)
      .guilds(guild_id)
      .commands.post({ data: item })
  );

  client.ws.on("INTERACTION_CREATE", async (interaction) => {
    const command = interaction.data.name.toLowerCase();
    const args = interaction.data.options;

    if (command === "nuke") {
      console.log(interaction);
      const channel = client.channels.cache.get(interaction.channel_id);
      switch (args[0].value) {
        case "delete_all":
          {
            try {
              channel.messages
                .fetch({ limit: 10 })
                .then(
                  (messages) => {
                    messages.forEach((message) => {
                      console.log(message);
                      if (
                        !usernames_to_ignore.includes(message.author.username)
                      )
                        peekMessages.push(
                          `${message.author.username}: ${message.content}`
                        );
                    });
                  },
                  () => console.log("Couldn't save the messages.")
                )
                .catch((e) => {
                  console.log(e);
                  utils.reply(
                    client,
                    interaction.id,
                    interaction.token,
                    e.message
                  );
                });
              utils.cloneChannelAndDelete(channel);
              utils.reply(client, interaction.id, interaction.token);
            } catch (e) {
              console.log(e);
              utils.reply(
                client,
                interaction.id,
                interaction.token,
                "Couldn't delete channel! Be an administrator and administrate that shit yourself."
              );
            }
          }
          break;
        case "delete_last":
          channel.messages
            .fetch({ limit: 1 })
            .then(
              (messages) => {
                try {
                  const lastMessage = messages.first();
                  console.log(`Last message: ${lastMessage}`);
                  channel.messages.delete(lastMessage);
                  utils.reply(client, interaction.id, interaction.token);
                } catch (e) {
                  throw new Error("Damn! Couldn't delete that last one.");
                }
              },
              () => console.log("failed")
            )
            .catch((e) => {
              console.log(e);
              utils.reply(client, interaction.id, interaction.token, e.message);
            });
          break;
      }
    } else if (command === "peek") {
      const reply =
        peekMessages.length > 1
          ? peekMessages.reverse().join("\n")
          : "Nothing to peek.";
      utils.reply(client, interaction.id, interaction.token, reply);
      peekMessages = [];
    }
  });
});

client.login(token);
