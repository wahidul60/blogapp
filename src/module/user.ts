import { Response, Request } from "express"
import { prisma } from "../lib/prisma"

const getAllUser = async (req: Request, res: Response) => {


    try {
        const result = await prisma.user.findMany()
        res.status(200).json({
            data: result
        })
        return result
    } catch (e) {
        res.status(404).json({
            err: e
        })
    }


}
export default getAllUser