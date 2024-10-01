/*  
    const apiUrlAssig = "https://canvas.kdg.be/api/v1/courses/49719/assignments";
    const apiData = await API.regularCanvasAPICall(apiUrlAssig, requestOptions.basic, client);
    reminderController.test(apiData)
  */

async function test(apiData){
    const date = apiData[2].due_at;
    const day = date.split(/[-T]/)[2];
    const month = date.split(/[-T]/)[1];
    const year = date.split(/[-T]/)[0];

    const currentDate = new Date().toISOString();
    console.log(currentDate);
    const currentDay = currentDate.split(/[-T]/)[2];
    const currentMonth = currentDate.split(/[-T]/)[1];
    const currentYear = currentDate.split(/[-T]/)[0];

    if(year === currentYear && month === currentMonth && day-1 === currentDay){
        console.log("REMINDER!!!!!!!!!!!!!!!");
    }else{
        console.log("Ge hebt nog tijd");
    }
}

async function sendReminder(apiData){
    const date = apiData.due_at;
    const day = date.split(/[-T]/)[2];
    const month = date.split(/[-T]/)[1];
    const year = date.split(/[-T]/)[0];

    const currentDate = new Date().toISOString();
    const currentDay = currentDate.split(/[-T]/)[2];
    const currentMonth = currentDate.split(/[-T]/)[1];
    const currentYear = currentDate.split(/[-T]/)[0];

    var assigmentDate = new Date(date);
    var dayBeforeAssingment = new Date();
    dayBeforeAssingment.setDate(assigmentDate.getDate() - 1);
    dayBeforeAssingment = dayBeforeAssingment.toISOString().split(/[-T]/)[2];

    if(year === currentYear && month === currentMonth && dayBeforeAssingment === currentDay){
        return "Title: " + apiData.name + "\ndescription: " + apiData.description;
    }

}


module.exports = {
    test,
    sendReminder,
}