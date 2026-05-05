import dotenv from "dotenv"
dotenv.config()
import app from './app'
import { prisma } from './lib/prisma'


const port = process.env.PORT || 5000  

async function server() {
    try {
        await prisma.$connect()
        console.log("prisma connect successfully")
        app.listen(port, () => {
            console.log("server is is listening localhost:", port)
        })
    } catch (err) {
        await prisma.$disconnect()
        console.log("an error has occured", err)
        process.exit(1)
    }

}


server() 