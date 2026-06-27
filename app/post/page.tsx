"use server"
import { auth } from "@/auth"
import { redirect } from "next/navigation"
import PostClient from "./post"

export default async function Post () {
    const session = await auth()
    if(!session){
<<<<<<< HEAD
        redirect("/auth/sighin")
    }
    return (
        <main className="min-h-dvh">
           <PostClient/>
=======
        redirect("/auth/signin")
    }
    return (
        <main className="min-h-dvh">
            <PostClient session={session}/>
>>>>>>> 436cfaf7a7983aedc15878fe50af95eef791aae2
        </main>
    )
}