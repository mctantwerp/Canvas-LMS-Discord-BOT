const Pusher = require('pusher');


function sendDataToPi(stringMessage){
    const pusher = new Pusher({
        appId: "1867626",
        key: "e91b5acb99e7070669a0",
        secret: "eaafc85da66e7f9b8839",
        cluster: "eu",
        useTLS: true
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
