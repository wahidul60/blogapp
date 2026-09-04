import { CommentStatus } from "../../../generated/prisma"
import { prisma } from "../../lib/prisma"

const createComment = async (payload: { postID: string, content: string, parentId: string, authorId: string }) => {
    await prisma.post.findUniqueOrThrow({
        where: {
            id: payload.postID
        }
    })

    if (payload.parentId) {
        await prisma.comment.findFirstOrThrow({
            where: {
                id: payload.parentId
            }
        })
    }

    return await prisma.comment.create({
        data: payload

    })
}


const getCommentByauthorId = async (authorId: string) => {
    return await prisma.comment.findMany({
        where: {
            authorId: authorId
        },
        orderBy: {
            createdAt: "desc"
        },
        include: {
            post: {
                select: {
                    id: true,
                    title: true
                }
            }
        }
    })
}

const deleteComment = async (commentId: string, authorId: string) => {
    const commentData = await prisma.comment.findFirst({
        where: {
            id: commentId,
            authorId
        },
        select: {
            id: true
        }
    })

    if (!commentData) {
        throw new Error("Enter valid Comment Id")
    }

    return await prisma.comment.delete({
        where: {
            id: commentData.id
        }
    })
}

const updateComment = async (id: string, data:{content? : string, status? : CommentStatus}, authorId : string) => {
    const commentData = await prisma.comment.findFirst({
        where: {
            id            
        },
        select :{
            id : true,
            status : true
        }
        
    })   


    if (commentData?.status === data.status) {
        throw new Error(`Your provided status (${data.status}) is already up to date`)
    }

    return await prisma.comment.update({
        where: {
            id,
            authorId
        }, 
        data
    })
}

export const commentService = { createComment, getCommentByauthorId, deleteComment, updateComment }