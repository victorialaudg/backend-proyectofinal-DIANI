export default class TicketRepository {
    constructor(dao) {
        this.dao = dao
    }
    getAll = async() => await this.dao.getAll()
    getById = async(cid) => await this.dao.getById(cid)
    getAllPaginate = async(req, PORT) => await this.dao.getAllPaginate(req, PORT)
    create = async(data) => await this.dao.create(data)
    update = async(cid, data) => await this.dao.update(cid, data)
    delete = async(cid) => await this.dao.delete(cid)
}