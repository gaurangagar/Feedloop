import mongoose,{Schema,Document} from 'mongoose';

export interface Customer extends Document{
    name:string,
    email:string,
    password:string,
    phone:string
}

const CustomerSchema:Schema<Customer>=new Schema({
    name:{
        type:String,
        required:[true,"name is required"],
        trim:true,
    },
    email:{
        type:String,
        required:[true,"email is required"],
        unique:true,
        match:[/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,"please use a valid email address"]
    },
    password:{
        type:String,
        required:[true,"password is required"],
    },
    phone:{
        type:String,
        match: [
            /^\+?\d{1,3}?[-.\s]?\(?\d{1,4}?\)?[-.\s]?\d{3,4}[-.\s]?\d{4}$/,
            "please use a valid phone number"
        ]
    }
},{timestamps:true})

const CustomerModel=(mongoose.models.Customer as mongoose.Model<Customer>) || mongoose.model<Customer>("Customer",CustomerSchema)

export default CustomerModel;