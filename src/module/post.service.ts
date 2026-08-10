import { Post, Prisma } from "../../generated/prisma";
import { prisma } from "../lib/prisma";


const createPost = async (data: Prisma.PostCreateInput, id: string) => {
    const result = await prisma.post.create({
        data: {
            ...data,
            authorId: id
        }
    })
   
    return result
}

const getAllPost = async (
    { search, tags, isFeature, authorId, skip, limit, shortBy, shortOrder, page }:
        { search: string | undefined, tags: string[] | [], isFeature: boolean | undefined, authorId: string, skip: number, limit: number, shortOrder: string, shortBy: string, page: number }
) => {

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

    if (authorId) {
        andCondition.push({
            authorId
        })
    }

    const result = await prisma.post.findMany({
        skip: skip,
        take: limit,

        orderBy:
        {
            [shortBy]: shortOrder
        },

        where: {
            AND: andCondition
        }
    })

    const total = await prisma.post.count({
        where: {
            AND: andCondition
        }
    })


    return {
        data: result,
        pagination: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit)
        }

    };
}

const getAllById = async (id: string) => {
    const result = await prisma.$transaction(async (tx) => {
        await tx.post.update({
            where: {
                id: id
            },
            data: {
                views: {
                    increment: 1
                }
            }
        })
        const postData = await tx.post.findUnique({
            where: {
                id: id
            }
        })
        return postData
    })

    return result
}

export const postService = {
    createPost, getAllPost, getAllById
}