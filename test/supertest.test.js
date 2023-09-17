import mongoose from 'mongoose';
import chai from 'chai';
import supertest from 'supertest';

const expect = chai.expect
const requester = supertest('mongodb://localhost:27017/test')

describe('Testing ecommerce', ()=>{
    describe('Test de ecommerce', () => {
        it('En el endpoint POST /api/products debe registrar un producto', async() => {
            const response = await requester.post('/api/products').send({
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
            expect(response._body.payload).to.have.property('_id')
        })
    })
})