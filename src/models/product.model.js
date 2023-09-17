import mongoose from 'mongoose'
import mongoosePaginate from 'mongoose-paginate-v2'

const productSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    code: { type: String, unique: true, required: true },
    status: { type: Boolean, default: true },
    stock: { type: Number, required: true },
    category: { type: String, required: true },
    thumbnails: { type: [String], default: [] },
    owner: { type: String, required: true, default: 'admin', ref: "users" }
})

mongoose.set('strictQuery', false)
productSchema.plugin(mongoosePaginate)
const productModel = mongoose.model('products', productSchema)

export default productModel