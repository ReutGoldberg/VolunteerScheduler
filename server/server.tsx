const express = require("express");
const app = express();
const port=2000
//const {Pool} = require('pg')
//require('dotenv').config();

//let pool = new Pool()

app.listen(port, ()=>{
    console.log(`server strted on port ${port}`);
});

app.get('/', (req, res) => {
    console.log('hi');
    res.send('hello');
});