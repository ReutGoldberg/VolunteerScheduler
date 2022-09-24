import express, {Request, Response} from "express";
import { addNewLabel, getAllLabels, getUserByToken } from "../db";
import { isVerifiedUser } from "../server_utils";
import jwt_decode from "jwt-decode";

const config = require('../config')
const router = express.Router();

router.post('/add_label', async (req:Request, res:Response) => {
    console.log("add_label");
    const {labelName} = req.body;
    const authToken = req.headers.authorization ? req.headers.authorization : "";
    try{
        if(!(await isVerifiedUser(authToken))){
            throw new Error(config.notVerifiedUserMsg);
        }
        const webUser:any = jwt_decode(authToken);
        if(!(await getUserByToken(webUser.sub).then((user) => user.is_admin))){            
            throw new Error(config.noAdminRightsMsg);
        }
        const result_event = await addNewLabel(labelName);
        res.json(result_event);

    }
    catch(err:any){
        console.log("Error in Post add_label to Labels.ts (server router)")
        console.error(err.message);
        err.message === config.notVerifiedUserMsg? res.status(401).send({error:err}):res.status(500).send({error:err});  
    }
});

router.get('/all_labels', async (req:Request, res:Response) => {
    console.log("all_labels");
    const token = req.headers.authorization ? req.headers.authorization : "";
    try{
        if(!(await isVerifiedUser(token))){
            throw new Error(config.notVerifiedUserMsg );
        }
        const labels = await getAllLabels();
        res.json(labels);
    }
    catch(err:any){
        console.log("Error in get all_labels from labels.ts (server router)")
        console.error(err.message);
        err.message === config.notVerifiedUserMsg ? res.status(401).send({error:err}):res.status(500).send({error:err});  
    }
});

module.exports = router;