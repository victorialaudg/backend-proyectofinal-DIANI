import ticketModel from '../models/ticket.model.js'

export default class TicketMongoDAO {
    getAll = async()=> await ticketModel.find().lean().exec()
    getById = async(cid)=> await ticketModel.findById(cid).lean().exec()
    create = async(data) => await ticketModel.create(data)
    update = async(cid,data)=> await ticketModel.findByIdAndUpdate(cid,data,{returnDocument:'after'})
    delete = async(cid)=> await ticketModel.findByIdAndDelete(cid)
}