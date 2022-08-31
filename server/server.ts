import express, {Express, Request, Response} from "express";
import jwt_decode from "jwt-decode";
import { isVerifiedUser } from "./server_utils";
import {getUserByToken,getAllLabels, getUserByEmail,getEvent, getAllEvents, getAllUsers,addNewUser,updateUser,deleteUserById, deleteEventById, addNewAdmin, addNewEvent, getAllAdminUsers} from "./db";


const config = require('./config')

const app: Express = express();
var cors = require('cors');
app.use(cors({origin: config.client_app.localhost})) 

app.use(express.json());

const myPort = config.server_app.port;
const myLocalhost = config.server_app.localhost;
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
        if(await !isVerifiedUser(token)){
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
    const token = req.headers.authorization ? req.headers.authorization : "";
    try{
        if(await !isVerifiedUser(token)){
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

app.get('/all_labels', async (req:Request, res:Response) => {
    const token = req.headers.authorization ? req.headers.authorization : "";
    try{
        if(await !isVerifiedUser(token)){
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
    try{
        if(await !isVerifiedUser(token)){
            throw new Error("user is not certified");
        }
        const event_details = await getEvent(eventId);
        const full_event_details={
            id: event_details["id"],
            startAt: event_details["start_time"],
            endAt: event_details["end_time"],
            title: event_details["title"],
            details: event_details["details"],
            color: 'blue', //todo: not hardcode the color
            allDay: false,
            labels: [],//TODO:change Danit labels backend+DB
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

app.post('/add_user', async (req:Request, res:Response) => {
    const {firstName, lastName, email} = req.body;
   

    const authToken = req.headers.authorization ? req.headers.authorization : "";

    try{
        //@ts-ignore
        const webTokenSub = jwt_decode(authToken).sub;
        if(await !isVerifiedUser(authToken)){
            throw new Error("user is not certified");
        }
        else{
            const user = await addNewUser(firstName, lastName, email, webTokenSub);
            res.json(user);
        }
    }
    catch(err:any){
        console.error(err.message);
        res.status(500);
    }
});

//todo: verify logic bc I didn't write this, just modified this.
app.post('/add_event', async (req:Request, res:Response) => {
    const authToken = req.headers.authorization ? req.headers.authorization : "";
    console.log('--------------- Creates new Events ---------------')
    console.log(req.body)
    try{
        if(await !isVerifiedUser(authToken)){
            throw new Error("user is not certified");
        }
        else{
            const result_event = await addNewEvent(req.body);
            res.json(result_event);
        }
    }
    catch(err:any){
        console.error(err.message);
        res.status(500);
    }
});

app.delete('/delete_event', async (req:Request, res:Response) => {
    const authToken = req.headers.authorization ? req.headers.authorization : "";
    try{
        if(await !isVerifiedUser(authToken)){
            throw new Error("user is not certified");
        }
        const webUser = jwt_decode(authToken);
        //@ts-ignore
        if(await !getUserByToken(webUser.sub).then((user) => user.is_admin)){
            throw new Error("User is not admin");
        }
        else{
            const deletedEvent = await deleteEventById(Number(req.params.id));
            res.json(deletedEvent);
        }
    }
    catch(err:any){
        console.error(err.message);
        res.status(500);
    }
});

//put and not post bc it updates a specific user and doesnt create a new one
app.put('/add_admin', async (req:Request, res:Response) => {
    const {email} = req.body;
    const authToken = req.headers.authorization ? req.headers.authorization : "";
    try {
        if(await !isVerifiedUser(authToken)){
            res.status(401);
            throw new Error("User is not verified");
        }
        const webUser = jwt_decode(authToken);
        //@ts-ignore
        if(await !getUserByToken(webUser.sub).then((user) => user.is_admin)){
            res.status(401);
            throw new Error("User is not admin");
        }

        const userToUpdate = getUserByEmail(email)
        .then((dbUser) => {addNewAdmin(dbUser.email);});

        res.json(userToUpdate);   
        res.status(200);
    } catch (error:any) {
        console.error(error.message);
    }
});

//Updates existing records based on request body
app.put('/users', async (req:Request, res:Response) => {
    const {userId, userName} = req.body;
    const authToken = req.headers.authorization ? req.headers.authorization : "";
    try {
        if(await !isVerifiedUser(authToken)){
            throw new Error("User is not verified");
        }
        const updatedUser = await updateUser(userId,userName);    
        res.json(updatedUser);
        res.status(200);

    } catch (error) {
        console.log(error);
        res.status(500);
    }
});


//delete specific user
app.delete('/users:id', async (req:Request, res:Response) => {
    
    const authToken = req.headers.authorization ? req.headers.authorization : "";
    try {
        if(await !isVerifiedUser(authToken)){
            throw new Error("User is not verified");
        }
        const webUser = jwt_decode(authToken);
        //@ts-ignore
        if(await !getUserByToken(webUser.sub).then((user) => user.is_admin)){
            throw new Error("User is not admin");
        }
        const userId = req.params.id;
        const deletedUser = await deleteUserById(Number(userId));    
        res.json(deletedUser);
    } catch (error) {
        console.log(error);
        res.status(500);
    }
});

//Retrevie data from DB section:

app.get('/user/userEmail/', async (req:Request, res:Response) => {
    const authToken = req.headers.authorization ? req.headers.authorization : "";
    try {
        if(await !isVerifiedUser(authToken)){
            throw new Error("User is not verified");
        } 
        //@ts-ignore
        const user = await getUserByToken(jwt_decode(authToken).sub);
        res.json(user);
    }
    catch(err:any){
        console.log(err);
        console.error(err.message);       
    }
 });

//only serves the login page for new users - doesn't suport query for all emails
 app.get('/user/isNewUser/', async (req:Request, res:Response) => {
    const authToken = req.headers.authorization ? req.headers.authorization : "";
    try {
        if(await !isVerifiedUser(authToken, true)){ //checks the auth token is ok and user's email is in a valid formation
            throw new Error("User doesn't have a valid JWT");
        }   
        //@ts-ignore
        const user = await getUserByToken(jwt_decode(authToken).sub);
        if (user == null){
            return res.json(false);
        }
        return res.json(true);


    } catch (error:any) {
        console.error(error.message);
        res.status(500);
    }
 });


 app.get('/user/adminsUserEmail/', async (req:Request, res:Response) => {
    const authToken = req.headers.authorization ? req.headers.authorization : "";
    try {
        if(await !isVerifiedUser(authToken)){ //checks the auth token is ok and user's email is in a valid formation
            throw new Error("User is not verified");
        }
        getAllAdminUsers().then(adminUsers => res.json(adminUsers));
    } catch (error:any) {
        console.error(error.message);
        res.status(500);
    }
    
 });



