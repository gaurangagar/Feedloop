import mongoose,{Schema,Document, Types} from 'mongoose';

export interface feedbackForm extends Document{
    productRating: number;
    shopRating: number;
    answers: { question: string; answer: string }[];
}

const feedbackFormSchema:Schema<feedbackForm>=new Schema({
    productRating: {
        type: Number,
        required: [true, "Product rating is required"],
        min: 1,
        max: 5,
    },
    shopRating: {
        type: Number,
        required: [true, "Shop rating is required"],
        min: 1,
        max: 5,
    },
    answers: [
      {
        question: { type: String, required: true },
        answer: { type: String, required: true },
      },
    ],
},{timestamps:true})

const feedbackFormModel=(mongoose.models.feedbackForm as mongoose.Model<feedbackForm>) || mongoose.model<feedbackForm>("feedbackForm",feedbackFormSchema)

export interface Order extends Document{
    productName:string,
    customeremail:string,
    organizationid:Types.ObjectId,
    orderId:string,
    date:Date,
    feedbackForm: mongoose.Types.ObjectId,
    orderNo:string,
    gstin:string,
}

const OrderSchema: Schema<Order> = new Schema({
    productName: {
        type: String,
        required: [true, "product name is required"],
    },
    customeremail: {
        type: String,
        required: [true, "Email of customer is required"],
    },
    organizationid: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, "Organization id is required"],
        ref: "Organization",
    },
    orderId: {
        type: String,
        required: [true, "Order id is required"],
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
    },
}, { timestamps: true });

const OrderModel=(mongoose.models.Order as mongoose.Model<Order>) || mongoose.model<Order>("Order",OrderSchema)

export default OrderModel;