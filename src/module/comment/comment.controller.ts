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

const getCommentByauthorId = async (req:Request, res:Response)=> {
    try{    
        const {authorId} = req.params
        console.log("authorId :", authorId)

        if(!authorId){
            throw new Error ("author id not found")
        }
        const result = await commentService.getCommentByauthorId(authorId as string)        
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


const deleteComment = async (req : Request, res : Response) => {
    try{
        const {commentId} = req.params
        const user = req.user
        const result = await commentService.deleteComment(commentId as string, user?.id as string)
        res.status(200).json({
            success : true,
            data : result
        })
    }catch(e){
        res.status(400).json({
            success :false,
            error : e
        })
    }
}

const updateComment = async (req : Request, res : Response) => {
    try{
        const {commentId} = req.params
        const user = req.user
        const result = await commentService.updateComment(commentId as string, req.body, user?.id as string)
        res.status(200).json({
            success : true,
            data : result
        })
    }catch(e){
        const errorMessage = (e instanceof Error) ? e.message : "comment update failed!"
        res.status(400).json({
            success :false,
            error : errorMessage
        })
    }
}

export const commentController = {
    createComment,
    getCommentByauthorId,
    deleteComment,
    updateComment
}