const express = require("express");
const app = express();

//To show html elements 
//app.set("view engine", "ejs")

let port=3001;

app.listen(port, ()=>{
    console.log(`server strted on port ${port}`);
});

app.get('/', (req, res) => {
    console.log('hinasd');
    res.send('yo');
});



/* example for calendar routing
app.get("/calendar", (req,res) => {
    console.log("hi");
    req.render("pages/calendar/full");
})
*/
