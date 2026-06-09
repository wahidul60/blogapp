import { Request, Response } from "express"
import { postService } from "./post.service"

const createPost = async (req: Request, res: Response) => {

    try {
        if (!req.user) {
            return res.status(404).json({
                error: "Unauthorized",

            })
        }
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

        const isFeature = req.query.isFeature
            ? req.query.isFeature === 'true'
                ? true
                : req.query.isFeature === 'false'
                    ? false
                    : undefined
            : undefined

        console.log({ isFeature })
        const searchString = typeof search === 'string' ? search : undefined

        const result = await postService.getAllPost({ search: searchString, tags, isFeature, authorId })
        res.status(200).json({
            success: true,
            message: "post service worked",
            result: result
        })
    } catch (err) {
        console.log(err)
    }
}

export const postController = { createPost, getAllPost }