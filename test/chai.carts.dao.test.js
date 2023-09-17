import mongoose from 'mongoose';
import CartMongoDAO from '../src/dao/cart.mongo.dao.js';
import chai from 'chai';

//Conecto a la base de datos de prueba
mongoose.connect('mongodb+srv://coder:coder@backend39755.v9fwrug.mongodb.net/')

const expect= chai.expect

describe('Testing GET of Cart DAO', ()=>{
    before(async function(){
        this.cartsDao = new CartMongoDAO()
    })
    it('El GET debe devolver un array', async function(){
        const result = await this.cartsDao.getAll()
        expect(result).to.be.deep.equal([])
    }).timeout(50000)
    
})

