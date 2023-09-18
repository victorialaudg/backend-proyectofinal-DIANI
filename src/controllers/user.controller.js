import userModel from "../models/user.model.js"
import { UserService } from '../repositories/index.js'
import { PORT } from '../app.js'
import shortid from "shortid"

export const getAllUsersController = async (req, res) => {
    //const result = await userModel.getAll()
    const result = await UserService.getAllPaginate(req, PORT)
    res.status(result.statusCode).json(result.response)
}

export const getUserByIdController = async (req, res) => {
    try {
        const id = req.params.uid
        //const result = await UserModel.findById(id).lean().exec()
        const result = await UserService.getById(id)
        if (result === null) {
            return res.status(404).json({ status: 'error', error: 'Not found' })
        }
        res.status(200).json({ status: 'success', payload: result })
    } catch(err) {
        res.status(500).json({ status: 'error', error: err.message })
    }
}

export const udpateUserController = async (req, res) => {
    try {
        const id = req.params.uid
        const data = req.body
        if (req.session.user.role === 'admin') {
            const user = await UserService.getById(id)
            if (user.owner !== req.session.user.email) {
                return res.status(403).json({ status: 'error', error: 'Not Authorized' })
            }
        }
        const result = await UserService.update(id, data)
        if (result === null) {
            return res.status(404).json({ status: 'error', error: 'Not found' })
        }
        const users = await UserService.getAll()
        req.io.emit('updatedUsers', users)
        res.status(200).json({ status: 'success', payload: result })
    } catch(err) {
        res.status(500).json({ status: 'error', error: err.message })
    }
}

export const deleteUserController = async (req, res) => {
    try {
        const id = req.params.uid
        if (req.session.user.role === 'admin') {
            const user = await UserService.getById(id)
            if (user.owner !== req.session.user.email) {
                return res.status(403).json({ status: 'error', error: 'Not Authorized' })
            }
        }
        const result = await UserService.delete(id)
        if (result === null) {
            return res.status(404).json({ status: 'error', error: 'Not found' })
        }
        const users = await UserService.getAll()
        req.io.emit('updatedUsers', users)
        res.status(200).json({ status: 'success', payload: users })
    } catch(err) {
        res.status(500).json({ status: 'error', error: err.message })
    }
}