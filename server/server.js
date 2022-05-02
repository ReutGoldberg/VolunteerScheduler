const express = require('express');
const app = express();

let port=5000;

app.listen(port, () => console.log(`Listening on port ${port}...`));

app.get('/', (req, res) => {
    console.log('hinasd');
    res.send('Danit');
});

//real-life example: 
app.get('/api/volunteers', (req, res) => {
// Present a nice componenet   
// get all the volunteers from DB
// send them as a response to the frontEnd
});

//w/o db version:
app.get('/api/volunteers_noDB', (req, res) => {
    res.send([1,2,3]);
    });


/* example for calendar routing
app.get("/calendar", (req,res) => {
    console.log("hi");
    req.render("pages/calendar/full");
})
*/
