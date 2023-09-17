import mongoose from 'mongoose';
import ProductMongoDAO from '../src/dao/product.mongo.dao.js';
import Assert from 'assert';
import chai from 'chai';

//Conecto a la base de datos de prueba
mongoose.connect('mongodb://localhost:27017/test')

const assert= Assert.strict

describe('Testing GET Products DAO', ()=>{
    it('El GET debe devolver un array', async() => {
        before(function(){
            this.productsDao = new ProductMongoDAO()
        })
        beforeEach(function(){
            this.productsDao.getAll()
            this.timeout(10000)
        })
    })
})

xdescribe('Testing SAVE Products DAO', ()=>{
    it('El DAO debe poder crear productos', async() => {
        before(function(){
            this.productsDao = new ProductMongoDAO()
        })
        beforeEach(function(){
            this.productsDao.create({
                title: 'Test new product',
                description: 'Producto creado desde Testing',
                price: 0,
                code: 'XXX',
                status: true,
                stock: 1,
                category: 'cafe',
                thumbnails: 'xxx',
                owner: 'admin'
            })
            this.timeout(10000)
        })
        assert.ok(result._id)
    })
})

