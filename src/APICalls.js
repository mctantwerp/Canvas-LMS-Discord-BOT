const helpers = require('./helperFunctions.js');


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

module.exports = {
    canvasAPICall,
    regularCanvasAPICall,
};