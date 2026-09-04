import { Request, Response } from "express"
import { postService } from "./post.service"
import paginationHelper from "../helper/paginationHelper"

const createPost = async (req: Request, res: Response) => {

    try {
        if (!req.user) {
            return res.status(404).json({
                error: "Unauthorized",

            })
        }
        console.log("requestion:", req.user)
        const result = await postService.createPost(req.body, req.user.id as string)
        res.status(200).json({
            result
        })
    } catch (err) {
        res.status(400).json({
            error: err
        })
    }
}

const getAllPost = async (req: Request, res: Response) => {
    try {
        const search = req.query.search

        const authorId = req.query.authorId as string

        const tags = req.query.tags ? (req.query.tags as string).split(",") : []

        const { page, limit, skip, shortBy, shortOrder } = paginationHelper(req.query)

        const isFeature = req.query.isFeature
            ? req.query.isFeature === 'true'
                ? true
                : req.query.isFeature === 'false'
                    ? false
                    : undefined
            : undefined

        console.log({ isFeature })
        const searchString = typeof search === 'string' ? search : undefined

        const result = await postService.getAllPost({ search: searchString, tags, isFeature, authorId, skip, limit, shortBy, shortOrder, page })
        res.status(200).json({
            success: true,
            message: "post service worked",
            result: result
        })
    } catch (err) {
        console.log(err)
    }
}

const getAllById = async (req: Request, res: Response) => {
    const { id } = req.params
    try {
        if (!id) {
            throw new Error("Post id is required!")
        }
        const result = await postService.getAllById(id as string)

        res.status(200).json(result)
    } catch (err) {
        res.status(400).json({
            error: "Getting post by id failed",
            details: err
        })
    }
}


const getMyPost = async (req: Request, res: Response) => {
    try {
        const authorId = req.user?.id
        if (!authorId) {
            throw new Error("user Not found")
        }
        const result = await postService.getMyPost(authorId as string)
        res.status(200).json({
            result
        })
    } catch (e) {
        const errorMessage = (e instanceof Error) ? e.message : "this is error"
        res.status(404).json({
            success: false,
            error: errorMessage
        })
    }
}

const updatePost = async (req: Request, res: Response) => {
    try{
        const authorId = req.user?.id
        const {postId} = req.params

        if(!authorId){
            throw new Error("user not found")
        }

        const result = await postService.updatePost(postId as string, authorId, req.body) 

        res.status(200).json({
            success : true,
            data : result
        })
    }catch(e){
        const errMessage = (e instanceof Error) ? e.message : "your are unauthorised"
        res.status(404).json({
            success : false,
            error : errMessage
        })
    }
}

export const postController = { createPost, getAllPost, getAllById, getMyPost, updatePost }