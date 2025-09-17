import dbConnect from "@/lib/dbConnect";
import organizationModel from "@/models/organization";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function POST(request: Request) {
    await dbConnect();
    try {
        const { email,password } = await request.json();
        if (!email || !password) {
            return Response.json(
                {
                success: false,
                message: "All fields are required",
                },
                { status: 400 }
            );
        }
        const orgUser = await organizationModel.findOne({ email });
            if (!orgUser) {
                return Response.json(
                    { 
                        success: false,
                        message: "Invalid credentials" 
                    },{ status: 401 }
                );
            }
            const isMatch = await bcrypt.compare(password, orgUser.password as string);
            if (!isMatch) {
                return Response.json(
                    { success: false, message: "Invalid credentials" },
                    { status: 401 }
                );
            }
            const token = jwt.sign(
            {
                id: orgUser._id,
                email: orgUser.email,
                name: orgUser.name,
            },
            process.env.JWT_SECRET!,
            { expiresIn: "7d" }
            );
            return NextResponse.json(
            {
                success: true,
                message: "Sign-in successful",
                token,
                user: {
                email: orgUser.email,
                organizationName: orgUser.name,
                },
            },
            { status: 200 }
            );
        
    } catch(error) {
        console.error("Error in sign-in route:", error);
        return NextResponse.json(
            { success: false, message: "Server error" },
            { status: 500 }
        );
    }
}