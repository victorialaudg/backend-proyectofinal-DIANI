import chai from 'chai';
import supertest from 'supertest';

const expect = chai.expect
const requester = supertest('mongodb://localhost:27017/test')

describe('Testing ecommerce', ()=>{
    describe('Test de Sessions', () => {
        it('Se debe registrar un usuario', async() => {
            const response = await requester.post('/register').send({
                first_name: 'SuperTest',
                last_name: 'SuperTest LastName',
                email: 'supertest@mail.com',
                age: 30,
                password: '7777',
                cart:'',
                role: 'user'
            })
            expect(response._body.payload).to.be.ok
        })
        it('Debe loggear un user y retornar una cookie', async() => {
            const result= await requester.post('/login').send({
                email: 'supertest@mail.com',
                password: '7777'
            })
            const cookieResult = result.headers['set-cookie'][0]
            expect(cookieResult).to.be.ok
            expect(cookieResult.split('=')[0]).to.be.ok.and.eql('coderCookie')
            expect(cookieResult.split('=')[1]).to.be.ok
        })
        it('Enviar cookie para ver el contenido del user', async() =>{
            const result= await requester.post('/login').send({
                email: 'supertest@mail.com',
                password: '7777'
            })
            const response = await requester.get('current').set('Cookie',[`${result.headers['set-cookie'][0]}`])
            expect(response._body.payload.email).to.be.eql('supertest@mail.com')
        })
    })
})