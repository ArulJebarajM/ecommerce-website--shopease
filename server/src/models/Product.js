import mongoose from 'mongoose'
const productSchema = new mongoose.Schema({
  name:{type:String,required:true,trim:true,maxlength:120},
  category:{type:String,required:true,trim:true},
  price:{type:Number,required:true,min:0},
  description:{type:String,default:''},
  image:{type:String,default:'/images/backpack.png'},
  badge:{type:String,default:'EVERYDAY PICK'},
  stock:{type:Number,default:10,min:0}
},{timestamps:true})
export default mongoose.model('Product',productSchema)
