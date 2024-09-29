const Pusher = require('pusher');


function sendDataToPi(stringMessage){
    const pusher = new Pusher({
        appId: process.env.PUSHER_APP_ID,
        key: process.env.PUSHER_KEY,
        secret: process.env.PUSHER_SECRET,
        cluster: process.env.PUSHER_CLUSTER,
        useTLS: process.env.PUSHER_USE_TLS
      });
      
      pusher.trigger("raspberry", "message", {
        message: stringMessage
      })
      .then(() => {
          console.log("Event triggered successfully");
      });

      return;
}

module.exports ={
    sendDataToPi
};
