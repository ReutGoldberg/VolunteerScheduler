import express, {Express, Request, Response} from "express";
import jwt_decode from "jwt-decode";
import { isVerifiedUser } from "./server_utils";
import {editEvent, getUserByToken,getAllLabels,getEvent, getAllEvents, getAllUsers, deleteEventById, addNewEvent, enrollToEvent, getPersonalEvents, unenrollToEvent} from "./db";


const config = require('./config')

const app: Express = express();
var cors = require('cors');
app.use(cors({origin: config.client_app.localhost})) 

app.use(express.json());

const myPort = config.server_app.port;

/* Connecting the server with its sub routes*/

const addFakeRouter = require('./routes/add_fake');
app.use("/add_fake",addFakeRouter);


const userRouter = require('./routes/user');
app.use("/user",userRouter);

/*END*/

app.listen(myPort, ()=>{
    console.log(`server running on port ${myPort}`);
});

app.get('/', (req:Request, res:Response) => {
    res.send("You're on Root with TS enabled !");
    res.status(200);
});


app.get('/all_users', async (req:Request, res:Response) => {
    const token = req.headers.authorization ? req.headers.authorization : "";
    try{
        if(!(await isVerifiedUser(token))){
            throw new Error("user is not certified");
        }
        const users = await getAllUsers();
        res.json(users);   
    }
    catch(err:any){
        console.error(err.message);
        res.status(500);
    }
});

app.get('/all_events', async (req:Request, res:Response) => {
    console.log("get all event before ")
    const token = req.headers.authorization ? req.headers.authorization : "";
    console.log("get all event after")
    try{
        if(!(await isVerifiedUser(token))){
            throw new Error("user is not certified");
        }
        const events = await getAllEvents();
        res.json(events);
    }
    catch(err:any){
        console.error(err.message);
        res.status(500);
    }
});

app.get('/personal_events', async (req:Request, res:Response) => {
    console.log("get personal event before ")
    const token = req.headers.authorization ? req.headers.authorization : "";
    try{
        if(!(await isVerifiedUser(token))){
            throw new Error("user is not certified");
        }
        //@ts-ignore
        const token_sub = jwt_decode(token).sub;
        const events = await getPersonalEvents(token_sub);
        res.json(events);
    }
    catch(err:any){
        console.error(err.message);
        res.status(500);
    }
});

app.get('/all_labels', async (req:Request, res:Response) => {
    const token = req.headers.authorization ? req.headers.authorization : "";
    try{
        if(!(await isVerifiedUser(token))){
            throw new Error("user is not certified");
        }
        const labels = await getAllLabels();
        res.json(labels);
    }
    catch(err:any){
        console.error(err.message);
        res.status(500);
        throw err;
    }
});

app.get('/event_details/:event_id', async (req:Request, res:Response) => {
    const eventId = Number(req.params.event_id)
    console.log(`This is the event id: ${eventId}`)//todo: remove when done testing
    const token = req.headers.authorization ? req.headers.authorization : "";
    console.log(token)
    console.log(req.headers.authorization)
    try{
        if(!(await isVerifiedUser(token))){
            throw new Error("user is not certified");
        }
        console.log("good")
        const event_details = await getEvent(eventId);
        var labels=[]
        for (var label of event_details["EventLabelMap"]){
            labels.push(label["Labels"])
        }
        const full_event_details={
            id: event_details["id"],
            startAt: event_details["start_time"],
            endAt: event_details["end_time"],
            title: event_details["title"],
            details: event_details["details"],
            color: 'blue', //todo: not hardcode the color
            allDay: false,
            labels: labels,
            location: event_details["location"],
            created_by: event_details["created_by"],
            min_volenteers: event_details["min_volenteering"],
            max_volenteers: event_details["max_volenteering"],
        }
        console.log("event details after parsing:")
        console.log(full_event_details)
        res.json(full_event_details);
    }
    catch (error:any) {
        console.error(error);
        res.status(500);
    }
});
//Pushes data to the DB based on the request body


app.post('/enroll_to_event', async (req:Request, res:Response) => {
    const authToken = req.headers.authorization ? req.headers.authorization : "";
    const {event_id} = req.body;
    console.log('--------------- enroll to Event ---------------')
    try{
        if(!(await isVerifiedUser(authToken))){
            throw new Error("user is not certified");
        }
        else{
            //@ts-ignore
            const sub_token = jwt_decode(authToken).sub
            console.log(sub_token)
            const result_event = await enrollToEvent(event_id, sub_token);
            res.json(result_event);
        }
    }
    catch(err:any){
        console.error(err.message);
        res.status(500);
    }
});

app.post('/unenroll_to_event', async (req:Request, res:Response) => {
    const authToken = req.headers.authorization ? req.headers.authorization : "";
    const {event_id} = req.body;
    console.log('--------------- unenroll to Event ---------------')
    try{
        if(!(await isVerifiedUser(authToken))){
            throw new Error("user is not certified");
        }
        else{
            //@ts-ignore
            const sub_token = jwt_decode(authToken).sub
            console.log(sub_token)
            const result_event = await unenrollToEvent(event_id, sub_token);
            res.json(result_event);
        }
    }
    catch(err:any){
        console.error(err.message);
        res.status(500);
    }
});

app.post('/unenroll_to_event', async (req:Request, res:Response) => {
    const authToken = req.headers.authorization ? req.headers.authorization : "";
    const {event_id} = req.body;
    console.log('--------------- unenroll to Event ---------------')
    try{
        if(!(await isVerifiedUser(authToken))){
            throw new Error("user is not certified");
        }
        else{
            //@ts-ignore
            const sub_token = jwt_decode(authToken).sub
            console.log(sub_token)
            const result_event = await unenrollToEvent(event_id, sub_token);
            res.json(result_event);
        }
    }
    catch(err:any){
        console.error(err.message);
        res.status(500);
    }
});



app.post('/edit_event', async (req:Request, res:Response) => {
    const authToken = req.headers.authorization ? req.headers.authorization : "";
    console.log('--------------- edit Events ---------------')
    console.log(req.body)
    try{
        if(!(await isVerifiedUser(authToken))){
            throw new Error("user is not certified");
        }
        else{
            const result_event = await editEvent(req.body);
            res.json(result_event);
        }
    }
    catch(err:any){
        console.error(err.message);
        res.status(500);
    }
});

app.delete('/delete_event/:event_id', async (req:Request, res:Response) => {
    const authToken = req.headers.authorization ? req.headers.authorization : "";
    console.log('--------------- Delete Event By Id ---------------')
    try{
        if(!(await isVerifiedUser(authToken))){
            throw new Error("user is not certified");
        }
        const webUser = jwt_decode(authToken);
        //@ts-ignore
        if(!(await getUserByToken(webUser.sub).then((user) => user.is_admin))){
            throw new Error("User is not admin");
        }
        else{
            const deletedEvent = await deleteEventById(Number(req.params.event_id));
            res.json(deletedEvent);
        }
    }
    catch(err:any){
        console.error(err.message);
        res.status(500);
    }
});








