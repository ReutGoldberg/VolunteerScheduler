import express, {Request, Response} from "express";
import { getAllEvents, getPersonalEvents, getEvent, addNewEvent, enrollToEvent, unenrollToEvent, editEvent, deleteEventById, getIsUserEnrolledToEvent, getUserByToken } from "../db";
import { isVerifiedUser } from "../server_utils";
import jwt_decode from "jwt-decode";
const config = require('../config')
const router = express.Router();



router.get('/all_events', async (req:Request, res:Response) => {
    const token = req.headers.authorization ? req.headers.authorization : "";
    console.log("get all events")
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

router.get('/personal_events', async (req:Request, res:Response) => {
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


router.get('/event_details/:event_id', async (req:Request, res:Response) => {
    const eventId = Number(req.params.event_id)
    console.log(`This is the event id: ${eventId}`)//todo: remove when done testing
    const token = req.headers.authorization ? req.headers.authorization : "";
    try{
        if(!(await isVerifiedUser(token))){
            throw new Error("user is not certified");
        }
        const event_details = await getEvent(eventId);
        var labels=[]
        for (var label of event_details["EventLabelMap"]){
            labels.push(label["Labels"])
        }
        const webUser = jwt_decode(token);
        var volunteers=[]
        var count_volunteers = event_details["EventVolunteerMap"].length;
        //@ts-ignore
        if((await getUserByToken(webUser.sub).then((user) => user.is_admin))){
            for (var volenteer of event_details["EventVolunteerMap"]){
                volunteers.push(volenteer["Users"])
            }
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
            min_volunteers: event_details["min_volenteering"],
            max_volunteers: event_details["max_volenteering"],
            count_volunteers: count_volunteers,
            volunteers: volunteers,
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

router.post('/enroll_to_event', async (req:Request, res:Response) => {
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
            const result_event = await enrollToEvent(event_id, sub_token);
            res.json(result_event);
        }
    }
    catch(err:any){
        console.error(err.message);
        res.status(500);
    }
});

router.post('/unenroll_to_event', async (req:Request, res:Response) => {
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

router.post('/add_event', async (req:Request, res:Response) => {
    const authToken = req.headers.authorization ? req.headers.authorization : "";
    console.log('--------------- Creates new Events ---------------')
    try{
        if(!(await isVerifiedUser(authToken))){
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


router.post('/edit_event', async (req:Request, res:Response) => {
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

router.delete('/delete_event/:event_id', async (req:Request, res:Response) => {
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

router.get('/:event_id', async (req:Request, res:Response) => {
    const authToken = req.headers.authorization ? req.headers.authorization : "";
    try{
        if(!(await isVerifiedUser(authToken))){
            throw new Error("user is not certified");
        }
        //@ts-ignore
        const webUserSub:string = String(jwt_decode(authToken).sub);
        const userEvent = await getIsUserEnrolledToEvent(Number(req.params.event_id), webUserSub);
        res.json(userEvent);  
    }
    catch(err:any){
        console.error(err.message);
        res.status(500);
    }
});

module.exports = router;