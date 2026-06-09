import { Post, Prisma } from "../../generated/prisma";
import { prisma } from "../lib/prisma";


const createPost = async (data: Prisma.PostCreateInput, id: string) => {
    const result = await prisma.post.create({
        data: {
            ...data,
            authorId: id
        }
    })
    console.log(result)
    return result
}

const getAllPost = async ({ search, tags, isFeature, authorId }:
    { search: string | undefined, tags: string[] | [], isFeature: boolean | undefined, authorId: string }) => {

    const andCondition: Prisma.PostWhereInput[] = []
    if (search) {
        andCondition.push(
            {
                OR: [
                    {
                        title: {
                            contains: search,
                            mode: "insensitive"
                        }
                    },
                    {
                        content: {
                            contains: search,
                            mode: "insensitive"
                        }
                    },
                    {
                        tags: {
                            has: search
                        }
                    }]
            }
        )
    }

    if (tags?.length) {
        andCondition.push({
            tags: {
                hasEvery: tags
            }
        })
    }

    if (typeof isFeature === 'boolean') {
        andCondition.push({
            isFeature
        })

    }

    if(authorId){
        andCondition.push({
            authorId
        })
    }

    const result = await prisma.post.findMany({
        where: {
            AND: andCondition
        }
    })
    return result;
}

export const postService = {
    createPost, getAllPost
}