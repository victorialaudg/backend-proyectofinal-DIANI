import { ProductService } from '../repositories/index.js'
import { PORT } from '../app.js'

export const getAllProductsController = async (req, res) => {
    //const result = await ProductService.getAll()
    const result = await ProductService.getAllPaginate(req, PORT)
    res.status(result.statusCode).json(result.response)
}

export const getProductByIdController = async (req, res) => {
    try {
        const id = req.params.pid
        //const result = await productModel.findById(id).lean().exec()
        const result = await ProductService.getById(id)
        if (result === null) {
            return res.status(404).json({ status: 'error', error: 'Not found' })
        }
        res.status(200).json({ status: 'success', payload: result })
    } catch(err) {
        res.status(500).json({ status: 'error', error: err.message })
    }
}

export const createProductController = async (req, res) => {
    try {
        const product = req.body
        product.owner = req.session.user.email
        const result = await ProductService.create(product)
        const products = await ProductService.getAll()
        req.io.emit('updatedProducts', products)
        res.status(201).json({ status: 'success', payload: result })
    } catch(err) {
        res.status(500).json({ status: 'error', error: err.message })
    }
}

export const udpateProductController = async (req, res) => {
    try {
        const id = req.params.pid
        const data = req.body
        if (req.session.user.role === 'premium') {
            const product = await ProductService.getById(id)
            if (product.owner !== req.session.user.email) {
                return res.status(403).json({ status: 'error', error: 'Not Authorized' })
            }
        }
        const result = await ProductService.update(id, data)
        if (result === null) {
            return res.status(404).json({ status: 'error', error: 'Not found' })
        }
        const products = await ProductService.getAll()
        req.io.emit('updatedProducts', products)
        res.status(200).json({ status: 'success', payload: result })
    } catch(err) {
        res.status(500).json({ status: 'error', error: err.message })
    }
}

export const deleteProductController = async (req, res) => {
    try {
        const id = req.params.pid
        if (req.session.user.role === 'premium') {
            const product = await ProductService.getById(id)
            if (product.owner !== req.session.user.email) {
                return res.status(403).json({ status: 'error', error: 'Not Authorized' })
            }
        }
        const result = await ProductService.delete(id)
        if (result === null) {
            return res.status(404).json({ status: 'error', error: 'Not found' })
        }
        const products = await ProductService.getAll()
        req.io.emit('updatedProducts', products)
        res.status(200).json({ status: 'success', payload: products })
    } catch(err) {
        res.status(500).json({ status: 'error', error: err.message })
    }
}