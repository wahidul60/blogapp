import { prisma } from "../../lib/prisma"

const createComment = async (payload: { postID: string, content: string, parentId : string, authorId : string}) => {
    await prisma.post.findUniqueOrThrow({
        where : {
            id : payload.postID
        }
    })

    if(payload.parentId){
        await prisma.comment.findFirstOrThrow({
            where : {
                id : payload.parentId
            }
        })
    }

    return await prisma.comment.create({
        data : payload
        
    })
}

export const commentService = { createComment }