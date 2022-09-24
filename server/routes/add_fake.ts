import express, {Request, Response} from "express";
import { addNewFakeUser, addNewFakeLabel, addNewFakeLog, addNewFakeEvent, enrollToFakeEvent} from "../fake_db";
import { isValidEmail } from "../server_utils";
const config = require('../config')
const router = express.Router();


router.post('/user', async (req:Request, res:Response) => {
    const {firstName, lastName, email, is_admin} = req.body;
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
            const user = await addNewFakeUser(firstName, lastName, email, authToken, is_admin);      
            res.json(user);
        }
    }
    catch(err:any){
        console.log("In add fake User from add_fake.ts (server router)");
        console.error(err.message);
        res.status(500).send({error:err});
    }
});


router.post('/event', async (req:Request, res:Response) => {
    const eventData = req.body;
    const authToken = req.headers.authorization ? req.headers.authorization : "";    
    try{
        if(authToken !== "fake_event"){ //verifing that the fake auth token starts with the expected prefix
            const msg = `Event's auth token has issues \n Got: ${authToken}`
            res.status(401);
            throw new Error(msg);
        }
        else{
            const event = await addNewFakeEvent(eventData);            
            res.json(event);
        }
    }
    catch(err:any){
        console.log("In add fake Event from add_fake.ts (server router)");
        console.error(err.message);
        res.status(500).send({error:err});
    }
});

router.post('/enroll_to_event/', async (req:Request, res:Response) => {
    const {num_enrolls} = req.body;
    const authToken = req.headers.authorization ? req.headers.authorization : "";    
    try{
        if(authToken !== "fake_eventEnroll"){ //verifing that the fake auth token starts with the expected prefix
            const msg = `Event's auth token has issues \n Got: ${authToken}`
            res.status(401).send({error:msg});
            throw new Error(msg);
        }
        else{
            //todo remove log when done testing
            console.log(`Got the following: num_enrolls: ${num_enrolls}`)
            const event = await enrollToFakeEvent(Number(num_enrolls));            
            res.json(event);
        }
    }
    catch(err:any){
        console.log("In add fake Enroll_to_event from add_fake.ts (server router)");
        console.error(err.message);
        res.status(500).send({error:err});
    }
});



router.post('/label', async (req:Request, res:Response) => {
    const {name} = req.body;
    const authToken = req.headers.authorization ? req.headers.authorization : "";
    try{
        if(authToken !== "fake_label"){ //verifing that the fake auth token starts with the expected prefix
            const msg = `label's auth token has issues \n Got: ${authToken}`
            res.status(401).send({error:msg});
            throw new Error(msg);
        }
        else{
            const label = await addNewFakeLabel(name);      
            res.json(label);
        }
    }
    catch(err:any){
        console.log("In add fake Label from add_fake.ts (server router)");
        console.error(err.message);
        res.status(500).send({error:err});
    }
});

router.post('/log', async (req:Request, res:Response) => {
    const {text, time} = req.body;
    const authToken = req.headers.authorization ? req.headers.authorization : "";
    try{
        if(authToken !== "fake_log"){ //verifing that the fake auth token starts with the expected prefix
            const msg = `Log's auth token has issues \n Got: ${authToken}`
            res.status(401).send({error:msg});
            throw new Error(msg);
        }
        else{
            const label = await addNewFakeLog(text,time);            
            res.json(label);
        }
    }
    catch(err:any){
        console.log("In add fake Log from add_fake.ts (server router)");
        console.error(err.message);
        res.status(500).send({error:err});
    }
});


module.exports = router;