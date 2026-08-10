import express from 'express'
import { commentController } from './comment.controller'
import authMiddleware, { UserRole } from '../../middleware/auth'

const router = express.Router()

router.post("/",authMiddleware(UserRole.USER), commentController.createComment)

export const commentRouter = router