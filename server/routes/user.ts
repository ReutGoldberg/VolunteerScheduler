import express, {Request, Response} from "express";
import { addNewUser, deleteUserById, getAllAdminUsers, getUserByEmail, updateUser,getUserByToken, setAdmin } from "../db";
import { isValidEmail, isVerifiedUser } from "../server_utils";
import jwt_decode from "jwt-decode";

const config = require('../config')
const router = express.Router();



//Updates existing records based on request body
router.put('/', async (req:Request, res:Response) => {
    const {userId, userName} = req.body;
    const authToken = req.headers.authorization ? req.headers.authorization : "";
    try {
        if(!(await isVerifiedUser(authToken))){
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

//Pushes data to the DB based on the request body

router.post('/add_user', async (req:Request, res:Response) => {
    const {firstName, lastName, email} = req.body;
    const authToken = req.headers.authorization ? req.headers.authorization : "";
    try{
        if(!isValidEmail(email)){
            const msg = " ------- In POST add_user, got invalid user email -------"
            throw new Error(msg);
        }       
        else{
            //@ts-ignore - to save the sub in the DB after that
            const webTokenSub = jwt_decode(authToken).sub; 
            const user = await addNewUser(firstName, lastName, email, webTokenSub);
            res.json(user);
        }
    }
    catch(err:any){
        console.error(err.message);
        res.status(500);
    }
});



//delete specific user
//todo: consider deleting this function as it's dangerous.
router.delete('/:id', async (req:Request, res:Response) => {
    
    const authToken = req.headers.authorization ? req.headers.authorization : "";
    try {
        if(!(await isVerifiedUser(authToken))){
            throw new Error("User is not verified");
        }
        //@ts-ignore
        if(!(await getUserByToken(webUser.sub).then((user) => user.is_admin))){
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

//Retrevie user data from DB section:
router.get('/userEmail/', async (req:Request, res:Response) => {
    const authToken = req.headers.authorization ? req.headers.authorization : "";
    try {
        if(!(await isVerifiedUser(authToken))){
            throw new Error("User is not verified");
        } 
        //@ts-ignore
        const user = await getUserByToken(jwt_decode(authToken).sub);
        //todo: remove when done: prints
        // console.log("-----------------------------------------------------")
        // console.log("User OBject from isADmin")
        // console.log(JSON.stringify(user));
        // console.log("-----------------------------------------------------")
        res.json(user);
    }
    catch(err:any){
        console.log(err);
        console.error(err.message);       
    }
 });

 //only serves the login page for new users - doesn't suport query for all emails
 router.get('/isNewUser/', async (req:Request, res:Response) => {
    const authToken = req.headers.authorization ? req.headers.authorization : "";
    try {
        if(!(await isVerifiedUser(authToken, true))){ //checks the auth token is ok and user's email is in a valid formation
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


 router.get('/adminsUserEmail/', async (req:Request, res:Response) => {
    const authToken = req.headers.authorization ? req.headers.authorization : "";
    try {
        if(!(await isVerifiedUser(authToken))){ //checks the auth token is ok and user's email is in a valid formation
            throw new Error("User is not verified");
        }
        getAllAdminUsers().then(adminUsers => res.json(adminUsers));
    } catch (error:any) {
        console.error(error.message);
        res.status(500);
    }
    
 });

 //put and not post bc it updates a specific user and doesnt create a new one
router.put('/add_admin', async (req:Request, res:Response) => {
    const {email, isAdminFlag} = req.body;
    const authToken = req.headers.authorization ? req.headers.authorization : "";
    try {
        if(!(await isVerifiedUser(authToken))){
            res.status(401);
            throw new Error("User is not verified");
        }
        const webUser = jwt_decode(authToken);
        //@ts-ignore
        if(!(await getUserByToken(webUser.sub).then((user) => user.is_admin))){
            res.status(401);
            throw new Error("User is not admin");
        }

        const userToUpdate = getUserByEmail(email)
        .then((dbUser) => {setAdmin(dbUser.email, isAdminFlag);});

        res.json(userToUpdate);   
        res.status(200);
    } catch (error:any) {
        console.error(error.message);
    }
});

 //put and not post bc it updates a specific user and doesnt create a new one
 router.put('/remove_admin', async (req:Request, res:Response) => {
    const {email, isAdminFlag} = req.body;
    const authToken = req.headers.authorization ? req.headers.authorization : "";
    try {
        if(!(await isVerifiedUser(authToken))){
            res.status(401);
            throw new Error("User is not verified");
        }
        const webUser = jwt_decode(authToken);
        //@ts-ignore
        if(!(await getUserByToken(webUser.sub).then((user) => user.is_admin))){
            res.status(401);
            throw new Error("Master User is not admin");
        }

        const userToUpdate = getUserByEmail(email)
        .then((dbUser) => {setAdmin(dbUser.email, isAdminFlag);});

        res.json(userToUpdate);   
        res.status(200);
    } catch (error:any) {
        console.error(error.message);
    }
});




module.exports = router;