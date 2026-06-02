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

const getAllPost = async ({ search, tags }: { search: string | undefined, tags: string[] | [] }) => {

    const searchOrTags : Prisma.PostWhereInput[] = []
    if (search) {
        searchOrTags.push(
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
                            contains: search ,
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
        searchOrTags.push({
            tags: {
                hasEvery: tags 
            }
        })
    }

    const result = await prisma.post.findMany({
        where: {
            AND: searchOrTags
        }
    })
    return result;
}

export const postService = {
    createPost, getAllPost
}