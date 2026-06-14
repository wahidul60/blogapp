import { prisma } from "../lib/prisma"
import { UserRole } from "../middleware/auth"

const seedAdmin = async () => {
    try {
        const adminData = {
            name: "Wahidul Hassan 3",
            email: "wahidulhassan88@gmail.com",
            userRole: UserRole.ADMIN,
            password: "admin123"
        }

        const existingUser = await prisma.user.findUnique({
            where: {
                email: adminData.email
            }
        })

        if (existingUser) {
            throw new Error("admin data exist you are not allowed to create admin")
        }
        console.log("existing user", existingUser)

        const signUpAdmin = await fetch("http://localhost:5000/api/auth/sign-up/email", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Origin": "http://localhost:5000"
            },
            body: JSON.stringify(adminData)
        })
        if (signUpAdmin.ok) {
            await prisma.user.update({
                where: {
                    email: adminData.email
                },
                data: {
                    emailVerified: true
                }
            })
        }
        const text = await signUpAdmin.text()
        const status = signUpAdmin.status
        console.log("signup admin", signUpAdmin, text, status)


    } catch (err) {

    }
}

seedAdmin()