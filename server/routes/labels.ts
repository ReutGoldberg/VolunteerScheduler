import express, {Request, Response} from "express";
import { getAllLabels } from "../db";
import { isVerifiedUser } from "../server_utils";
const config = require('../config')
const router = express.Router();


router.get('/all_labels', async (req:Request, res:Response) => {
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

module.exports = router;