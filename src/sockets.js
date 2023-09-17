import messageModel from './models/message.model.js'

export default (io) => {
    io.on("connection", async socket => {
        console.log(`New client connected`)
        socket.on('productList', data => {
            io.emit('updatedProducts', data)
        })
        socket.broadcast.emit('alerta')
        let messages = await messageModel.find().lean().exec()
        socket.emit("logs", messages)
        socket.on("message", async data => {
            await messageModel.create(data)
            let messages = await messageModel.find().lean().exec()
            io.emit("logs", messages)
        })
    })
}