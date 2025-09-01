import { NextAuthOptions } from "next-auth";
import dbConnect from "@/lib/dbConnect";
import GoogleProvider from "next-auth/providers/google"
import organizationModel from "@/models/organization";

export const authOptions:NextAuthOptions={
    providers:[
        GoogleProvider({
            clientId: process.env.GOOGLE_ID!,
            clientSecret: process.env.GOOGLE_SECRET!
        }),
    ],
    
    callbacks:{
        async session({session, token}) {
            if(token && session.user) {
                session.user.email = token.email as string;
                session.user.name = token.name as string;
            }
            return session
        },
        async jwt({token,user}) {
            if(user) {
                await dbConnect();
                const orgUser=await organizationModel.findOne({email:user.email})
                if (orgUser && orgUser.email) {
                    token.name = orgUser.name
                    token.email = orgUser.email.toString();
                } else {
                    const newOrg=await organizationModel.create({
                        email:user.email,
                        name: user.name
                    })
                    if (newOrg && newOrg.email) {
                        token.name = newOrg.name
                        token.email = newOrg.email.toString();
                    }
                }
            }
            return token
        }
    },
    pages:{
        //signIn: '/auth/sign-in',
        error: '/auth/error',
    },
    session:{
        strategy:"jwt"
    },
    secret:process.env.NEXTAUTH_SECRET
}