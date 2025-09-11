import mongoose,{Schema,Document, Types} from 'mongoose';
import { Organization } from './organization';

export interface feedbackForm extends Document{
    isFilled:boolean,
    productRating: number;
    shopRating: number;
    answers: { question: string; answer: string }[];
    formid:string
}

const feedbackFormSchema:Schema<feedbackForm>=new Schema({
    isFilled:{
        type:Boolean,
        default:false
    },
    productRating: {
        type: Number,
        default:null,
        min: 1,
        max: 5,
    },
    shopRating: {
        type: Number,
        default:null,
        min: 1,
        max: 5,
    },
    answers: {
        type:[
            {
                question: { type: String, required: true },
                answer: { type: String, default:"" },
            },
        ],
        required:true,
        validate:{
            validator: (arr: { question: string; answer: string }[]) =>
                arr.length > 0,
            message: "At least one question-answer pair is required",
        },
    },
    formid:{
        type:String,
        required:true
    }
},{timestamps:true})

export const feedbackFormModel=(mongoose.models.feedbackForm as mongoose.Model<feedbackForm>) || mongoose.model<feedbackForm>("feedbackForm",feedbackFormSchema)

export interface Order extends Document{
    orderId:string
    productName:string,
    customeremail:string,
    date:Date,
    feedbackForm: mongoose.Types.ObjectId | feedbackForm,
    orderNo:string,
    gstin:string,
    organizationid:mongoose.Types.ObjectId | Organization
}

const OrderSchema: Schema<Order> = new Schema({
    orderId:{
        type:String,
        required: [true, "porderId is required"],
    },
    productName: {
        type: String,
        required: [true, "product name is required"],
    },
    customeremail: {
        type: String,
        required: [true, "Email of customer is required"],
        match:[
            /^\S+@\S+\.\S+$/,
            "Please provide a valid email address",
        ],
    },
    date: {
        type: Date,
        required: [true, "Date is required"],
    },
    feedbackForm: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "feedbackForm",
        required: [true, "Feedback form is required"],
    },
    orderNo: {
        type: String,
        required: [true, "Order number is required"],
    },
    gstin: {
        type: String,
        required: [true, "GSTIN is required"],
        match: [
            /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/,
            "Please provide a valid GSTIN",
        ],
    },
    organizationid:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Organization",
        required: [true, "Organization is required"],
    }
}, { timestamps: true });

const OrderModel=(mongoose.models.Order as mongoose.Model<Order>) || mongoose.model<Order>("Order",OrderSchema)

export default OrderModel;