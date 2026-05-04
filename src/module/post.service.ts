import { Post, Prisma } from "../../generated/prisma";
import { prisma } from "../lib/prisma";

const createPost = async (data: Prisma.PostCreateInput) => {
    const result = await prisma.post.create({
        data
    })
    return result
}

export const postService = {
    createPost
}