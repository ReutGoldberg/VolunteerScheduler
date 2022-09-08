import express, {Request, Response} from "express";
import { addNewUser, addNewLabel, addNewLog, addNewEvent } from "../db";
import { isValidEmail } from "../server_utils";
const config = require('../config')
const router = express.Router();


router.post('/user', async (req:Request, res:Response) => {
    const {firstName, lastName, email} = req.body;
    const authToken = req.headers.authorization ? req.headers.authorization : "";
    try{
        if(!authToken.startsWith(config.FakeDB.preToken)){ //verifing that the fake auth token starts with the expected prefix
            const msg = `In add_fake_user \n  fake data token is wrong. \n Got: ${authToken}`
            console.log(msg);
            throw new Error(msg);

        }
        if(!isValidEmail(email)){
            const msg = "In POST add_fake_user, got invalid user email"
            console.log(msg);
            throw new Error(msg);
        }
        else{
            //authToken = "fake_data"
            const user = await addNewUser(firstName, lastName, email, authToken);            
            res.json(user);
        }
    }
    catch(err:any){
        console.error(err.message);
        res.status(500);
    }
});


router.post('/label', async (req:Request, res:Response) => {
    const {name} = req.body;
    const authToken = req.headers.authorization ? req.headers.authorization : "";
    try{
        if(authToken !== "fake_label"){ //verifing that the fake auth token starts with the expected prefix
            const msg = `label's auth token has issues \n Got: ${authToken}`
            throw new Error(msg);
        }
        else{
            const label = await addNewLabel(name);            
            res.json(label);
        }
    }
    catch(err:any){
        console.error(err.message);
        res.status(500);
    }
});



router.post('/log', async (req:Request, res:Response) => {
    const {text, time} = req.body;
    const authToken = req.headers.authorization ? req.headers.authorization : "";
    try{
        if(authToken !== "fake_log"){ //verifing that the fake auth token starts with the expected prefix
            const msg = `Log's auth token has issues \n Got: ${authToken}`
            throw new Error(msg);
        }
        else{
            const label = await addNewLog(text,time);            
            res.json(label);
        }
    }
    catch(err:any){
        console.error(err.message);
        res.status(500);
    }
});


router.post('/event', async (req:Request, res:Response) => {
    const eventData = req.body;
    const authToken = req.headers.authorization ? req.headers.authorization : "";
    try{
        if(authToken !== "fake_event"){ //verifing that the fake auth token starts with the expected prefix
            const msg = `Event's auth token has issues \n Got: ${authToken}`
            throw new Error(msg);
        }
        else{
            const event = await addNewEvent(eventData);            
            res.json(event);
        }
    }
    catch(err:any){
        console.error(err.message);
        res.status(500);
    }
});

module.exports = router;