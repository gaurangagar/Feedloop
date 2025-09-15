import dbConnect from "@/lib/dbConnect";
import organizationModel from "@/models/organization";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
    await dbConnect();
    try {
        const { email,password,organizationName } = await request.json();
        if (!email || !password || !organizationName) {
            return Response.json(
                {
                success: false,
                message: "All fields are required",
                },
                { status: 400 }
            );
        }
        const existingOrg = await organizationModel.findOne({ email });
        if (existingOrg) {
            return Response.json(
                {
                success: false,
                message: "Organization with this email already exists",
                },
                { status: 409 }
            );
        }
        const hashedPassword=await bcrypt.hash(password,10)
        const newOrg = new organizationModel({
            email,
            password:hashedPassword,
            name:organizationName,
        });
        await newOrg.save();
        return Response.json(
            {
                success: true,
                message: "Organization created successfully",
                data: {
                id: newOrg._id,
                email: newOrg.email,
                organizationName: newOrg.name,
                category: newOrg.category,
                },
            },
            { status: 201 }
        );
        
    } catch(error) {
        console.error("Error creating organization:", error);
        return Response.json(
        {
            success: false,
            message: "Something went wrong while creating organization",
        },
        { status: 500 }
        );
    }
}