import { Request, Response } from "express";
import { commentService } from "./comment.service";

const createComment = async (req:Request, res:Response)=> {
    try{    
         req.body.authorId = req.user?.id
        const result = await commentService.createComment(req.body)        
        res.status(200).json({
            success : true,
            data : result
        })
    }catch(e){
        res.status(400).json({
            success : false,
            error : e
        })
    }
}

export const commentController = {createComment}