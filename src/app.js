import express from 'express'
import handlebars from 'express-handlebars'
import { Server } from 'socket.io'
import Sockets from './sockets.js'
import mongoose from 'mongoose'
import session from 'express-session'
import MongoStore from 'connect-mongo'
import passport from "passport";
import initializePassport from "./config/passport.config.js";
import nodemailer from 'nodemailer';
import logger from './logger.js'
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUiExpress from 'swagger-ui-express';
import config from './config/config.js'

import productsRouter from './routers/product.router.js'
import cartsRouter from './routers/cart.router.js'
import userRouter from './routers/user.router.js'
import viewsRouter from './routers/view.router.js'
import chatRouter from './routers/chat.router.js'
import sessionRouter from './routers/session.router.js'
import sessionViewsRouter from './routers/session.view.router.js'


export const PORT = config.apiserver.port

const swaggerOptions = {
    definition: {
        openapi: '3.0.1',
        info: {
            title: 'Documentación de la API de e-commerce',
            description: 'Descripción de la documentación'
        }
    },
    apis: [`./docs/**/*.yaml`]
}

const specs = swaggerJSDoc(swaggerOptions)

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use('/docs', swaggerUiExpress.serve, swaggerUiExpress.setup(specs))

app.use(session({
    store: MongoStore.create({
        mongoUrl: config.mongo.uri,
        dbName: config.mongo.dbname
    }),
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}))

initializePassport()
app.use(passport.initialize())
app.use(passport.session())

app.use(express.static('./src/public'))
app.engine('handlebars', handlebars.engine())
app.set('views', './src/views')
app.set('view engine', 'handlebars')

/*app.all('*', (req,res,next) => {
    const err = new Error(`No se pudo encontrar ${req.originalUrl} en el servidor`)
    err.status = 'fail'
    err.statusCode= 404
    next(err)
    logger.http(`No se pudo encontrar ${req.originalUrl} en el servidor`)
})
*/
const transport = nodemailer.createTransport({
    service:'gmail',
    port:587,
    auth:{
        user:'victorialau.dg@gmail.com',
        pass:'tdxiluhgbtlnjtps'
    }
})

app.get('/mail', async(req,res)=>{
    let result = await transport.sendMail({
        from: 'Coder Tests victorialau.dg@gmail.com',
        to: 'lauravictoria3229@gmail.com',
        subject:'Correo de prueba',
        html:`
        <div>
            <h1>Esto es un test</h1>
            <p>Un test muy lindo</p>
        </div>`,
        attachments:[]
    })
    res.send({status:"success",result:"Email Sent"})
})

try {
    await mongoose.connect(config.mongo.uri, {
        dbName: config.mongo.dbname,
        useUnifiedTopology: true
    })
    //console.log('DB connected!')
    logger.info('DB conectada!')
    const server = app.listen(PORT, () => {
        /*logger.error(`Ejemplo de mensaje de Logger: error`)
        logger.warn(`Ejemplo de mensaje de Logger: warning`)
        logger.info(`Ejemplo de mensaje de Logger: info`)
        logger.http(`Ejemplo de mensaje de Logger: http`)
        logger.verbose(`Ejemplo de mensaje de Logger: verbose`)
        logger.debug(`Ejemplo de mensaje de Logger: debug`)
        logger.silly(`Ejemplo de mensaje de Logger: silly`)*/
        logger.info('Server Up')
        //logger.log('info',`Un mensaje`)
    })
    const io = new Server(server)
    app.use((req, res, next) => {
        req.io = io
        next()
    })
    
    app.use('/', sessionViewsRouter)
    app.use('/api/products', productsRouter)
    app.use('/api/carts', cartsRouter)
    app.use('/api/users', userRouter)
    app.use('/api/sessions', sessionRouter)
    app.use('/products', viewsRouter)
    app.use('/carts', viewsRouter)
    app.use("/chat", chatRouter)
    app.use('/users', userRouter)
    //app.use(errorMiddleware)
    
    Sockets(io)
} catch (err) {
    logger.http('No se pudo conectar con la BD  ==> ', err.message)
    process.exit(-1)
}

