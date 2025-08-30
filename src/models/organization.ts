import mongoose,{Schema,Document} from 'mongoose';

export interface Organization extends Document{
    name:string,
    email:string,
    password:string,
    about?:string,
    rating:number,
    ratingCount:number,
    ratingSum:number,
    category:string,
    phone?:string,
    website?:string,
}

const organizationSchema:Schema<Organization>=new Schema({
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
    about:{
        type:String,
        required:false,
        trim:true
    },
    rating:{
        type:Number,
        default:null
    },
    ratingCount:{
        type:Number,
        default:0
    },
    ratingSum:{
        type:Number,
        default:0
    },
    category:{
        type:String,
        required:[true,"Type of organization is required"],
    },
    phone:{
        type:String,
        match: [
            /^\+?\d{1,3}?[-.\s]?\(?\d{1,4}?\)?[-.\s]?\d{3,4}[-.\s]?\d{4}$/,
            "please use a valid phone number"
        ],
        required:false
    },
    website: {
        type: String,
        match: [/^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/[^\s]*)?$/, "please use a valid website URL"],
        required:false
    }
},{ timestamps: true })

organizationSchema.methods.addRating = function(newRating: number) {
  this.ratingSum += newRating;
  this.ratingCount += 1;
  this.rating = this.ratingSum / this.ratingCount;
  return this.save();
};

const organizationModel=(mongoose.models.Organization as mongoose.Model<Organization>) || mongoose.model<Organization>("Organization",organizationSchema)

export default organizationModel;