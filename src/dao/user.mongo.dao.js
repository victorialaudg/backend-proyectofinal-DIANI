import UserModel from '../models/user.model.js'

export default class UserMongoDAO {
    getAll = async()=> await UserModel.find().lean().exec()
    getById = async(uid)=> await UserModel.findById(uid).lean().exec()
    create = async(data) => await UserModel.create(data)
    update = async(uid,data)=> await UserModel.findByIdAndUpdate(uid,data,{returnDocument:'after'})
    delete = async(uid)=> await UserModel.findByIdAndDelete(uid)
}