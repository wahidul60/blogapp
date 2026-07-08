type Ioptions = {
    page: number | string,
    limit: number | string,
    shortBy: string,
    shortOrder: string
}

const paginationHelper = (options: Ioptions) => {
    const page: number = Number(options.page ?? 1)
    const limit: number = Number(options.limit ?? 10)
    const skip: number = (page - 1) * limit
    const shortBy: string = options.shortBy || "createdAt"
    const shortOrder: string = options.shortOrder || "desc"

    return {
        page, limit, skip, shortBy, shortOrder
    }
}

export default paginationHelper;