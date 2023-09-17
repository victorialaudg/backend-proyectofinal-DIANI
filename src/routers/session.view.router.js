import { Router } from 'express'
import { privateRoutes, publicRoutes } from '../middlewares/auth.middleware.js'
import UserDTO from '../dto/user.dto.js'
import logger from './../logger.js'

const router = Router()

router.get('/register', privateRoutes, async(req, res) => {
    res.render('sessions/register')
})

router.get('/', privateRoutes, (req, res) => {
    res.render('sessions/login')
})

router.get('/forget-password', (req, res) => {
    res.render('sessions/forget-password')
})

router.get('/reset-password/:token', (req, res) => {
    res.redirect(`/api/sessions/verify-token/${req.params.token}`)
})

router.get('/profile', publicRoutes, (req, res) => {
    const userDTO = new UserDTO(req.session.user)
    res.render('sessions/profile', userDTO)
})

router.get('/mockingproducts', (req, res) => {
    const mockingproducts = []
    for (let index = 0; index < 100; index++) {
        mockingproducts.push({
            _id: faker.database.mongodbObjectId(),
            title: faker.commerce.productName(),
            description: faker.commerce.productDescription(),
            price: faker.commerce.price(),
            code: faker.string.alphanumeric(5),
            status: faker.datatype.boolean(),
            stock: faker.number.int(100),
            category: faker.commerce.department(),
            thumbnails: [],
        })
    }
    res.status(200).json({status: 'success', payload: mockingproducts})
})

router.get('/loggerTest', (req, res) => {
    logger.debug('Mensaje de debug');
    logger.http('Mensaje de petición HTTP');
    logger.info('Mnsaje de información');
    logger.warning('Mensaje de advertencia');
    logger.error('Mensaje de error');
    logger.fatal('Mensaje de error fatal');
    res.json({ status: 'success', message: 'Pruebas ejecutadas exitosamente' })
})

export default router