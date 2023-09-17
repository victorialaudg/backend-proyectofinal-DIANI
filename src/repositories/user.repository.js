export default class UserRepository {
    constructor(dao) {
        this.dao = dao
    }
    getAll = async() => await this.dao.getAll()
    getById = async(uid) => await this.dao.getById(uid)
   // getAllPaginate = async(req, PORT) => await this.dao.getAllPaginate(req, PORT)
    create = async(data) => await this.dao.create(data)
    update = async(uid, data) => await this.dao.update(uid, data)
    delete = async(uid) => await this.dao.delete(uid)
}