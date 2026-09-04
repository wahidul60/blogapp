import express from 'express'
import { commentController } from './comment.controller'
import authMiddleware, { UserRole } from '../../middleware/auth'

const router = express.Router()


router.get(
    "/:authorId",
    authMiddleware(UserRole.USER),
    commentController.getCommentByauthorId
)

router.post(
    "/",
    authMiddleware(UserRole.USER),
    commentController.createComment)

router.delete(
    "/:commentId"
    ,
    commentController.deleteComment)

router.patch(
    "/:commentId"
    ,
    commentController.updateComment)


export const commentRouter = router