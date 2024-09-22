async function sendMessageToChannel(client, message, channel_id) {
  //wait for promise to be resolved
  const channel = await client.channels.fetch(channel_id);
  channel.send(message)
};


module.exports = {
  sendMessageToChannel,
}