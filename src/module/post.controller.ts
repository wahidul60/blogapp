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

export const postController = { createPost, getAllPost, getAllById }