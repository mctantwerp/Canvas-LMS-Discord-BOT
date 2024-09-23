const helpers = require('./helperFunctions.js');
const sendMessage = require("./sendMessageChannel.js");


//this api call handles announcement data and returns it
function canvasAPICall(apiUrl, requestOptions, client) {
    //fetching data from the api
    return fetch(apiUrl, requestOptions)
        .then(response => {
            //if no response, throw an error
            if (!response.ok) {
                throw new Error('Network response was not ok!');
            }
            return response.json();
        })
        .then(data => {
            //handling the data - converting html markup to text
            return helpers.announcementHTMLtoText(data, client);
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

//regular API canvas call, no data being handled
function regularCanvasAPICall(apiUrl, requestOptions, client) {
    //fetching data from the api
    return fetch(apiUrl, requestOptions)
        .then(response => {
            //if no response, throw an error
            if (!response.ok) {
                throw new Error('Network response was not ok!');
            }
            return response.json();
        })
        .then(data => {
            return data
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

function pollingCanvasAPICall(apiUrl, requestOptions, interval, client) {
    // Function to perform API polling
    const pollData = async () => {
        var data = await canvasAPICall(apiUrl, requestOptions, client);
        //is there data? then return it
        if (data) {
            await sendMessage.sendMessageToChannel(client, data, "1287211078249611287");
        } else {
            console.log('No data or an error occurred during polling.');
        }
    };
    setInterval(pollData, interval);
}


module.exports = {
    canvasAPICall,
    regularCanvasAPICall,
    pollingCanvasAPICall
};