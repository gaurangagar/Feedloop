export interface FeedbackEmailInterface {
    productname:string,
    customername:string,
    orderno:number,
    organizationName:string,
    gstin:string,
    date:Date,
    feedbackForm:string //link redirecting to feedback form
    customerEmail:string
}