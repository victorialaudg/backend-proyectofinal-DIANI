import cartModel from '../models/cart.model.js'

export default class CartMongoDAO {
    getAll = async()=> await cartModel.find().lean().exec()
    getById = async(cid)=> await cartModel.findById(cid).lean().exec()
    create = async(data) => await cartModel.create(data)
    update = async(cid,data)=> await cartModel.findByIdAndUpdate(cid,data,{returnDocument:'after'})
    delete = async(cid)=> await cartModel.findByIdAndDelete(cid)
}
