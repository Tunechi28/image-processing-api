"use strict"

import {Request, Response, NextFunction} from "express"

export default{
    validateImageParams(req: Request, res: Response, next: NextFunction){
        let imageId: string;
        let width: number;
        let height: number

        if(!req.query.imageId){
            return res.status(400).send('cannot proceed without image id')
        }else{
            imageId = req.query.imageId as string;
        }

        if(req.query.width && Number(req.query.width) <= 0){
            return res.status(400).send(`invalid width value : ${req.query.width}`)
        }else{
            width = Number(req.query.width) as number
        }

        if(req.query.height && Number(req.query.height) <= 0){
            return res.status(400).send(`invalid width value : ${req.query.height}`)
        }else{
            height = Number(req.query.height) as number
        }

        res.locals.imageId = imageId;
        res.locals.width = width;
        res.locals.height = height;
        next();
    }

    
}