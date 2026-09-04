import express from 'express'
import { postController } from './post.controller'
import authMiddleware, { UserRole } from '../middleware/auth'



const router = express.Router()

router.get(
    '/',
    postController.getAllPost
)
router.get('/my-post', authMiddleware(UserRole.ADMIN, UserRole.USER), postController.getMyPost)
router.patch('/:postId', authMiddleware(UserRole.ADMIN, UserRole.USER), postController.updatePost)

router.get('/:id', postController.getAllById)


router.post(
    '/',
    authMiddleware(UserRole.USER),
    postController.createPost)


export const postRouter = router