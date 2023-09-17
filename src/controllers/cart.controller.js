import cartModel from "../models/cart.model.js"
//import productModel from '../models/product.model.js'
import ticketModel from "../models/ticket.model.js"
import { ProductService, CartService } from '../repositories/index.js'
import shortid from "shortid"

export const getProductsFromCart = async (req, res) => {
    try {
        const id = req.params.cid
       const result = await cartModel.findById(id).populate('products.product').lean()
       //const result = await CartService.getById(id).populate('products.product').lean()
        if (result === null) {
            return {
                statusCode: 404,
                response: { status: 'error', error: 'Not found' }
            }
        }
        return {
            statusCode: 200,
            response: { status: 'success', payload: result }
        }
    } catch(err) {
        return {
            statusCode: 500,
            response: { status: 'error', error: err.message }
        }
    }
}

export const createCartController = async (req, res) => {
    try {
        // const result = await cartModel.create({})
        const result = await CartService.create({})
        res.status(201).json({ status: 'success', payload: result })
    } catch(err) {
        res.status(500).json({ status: 'error', error: err.message })
    }
}

export const getProductsFromCartController = async (req, res) => {
    const result = await getProductsFromCart(req, res)
    res.status(result.statusCode).json(result.response)
}

export const addProductToCartController = async (req, res) => {
    try {
        const cid = req.params.cid
        const pid = req.params.pid
       //const cartToUpdate = await cartModel.findById(cid)
       const cartToUpdate = await CartService.getById(cid)
        if (cartToUpdate === null) {
            return res.status(404).json({ status: 'error', error: `Cart with id=${cid} Not found` })
        }
       //const productToAdd = await productModel.findById(pid)
       const productToAdd = await ProductService.getById(pid)
        if (productToAdd === null) {
            return res.status(404).json({ status: 'error', error: `Product with id=${pid} Not found` })
        }
        if (productToAdd.owner === req.session.user.email) {
            return res.status(400).json({ status: 'error', error: 'You cannot buy your own products' })
        }
        const productIndex = cartToUpdate.products.findIndex(item => item.product == pid)
        if ( productIndex > -1) {
            cartToUpdate.products[productIndex].quantity += 1
        } else {
            cartToUpdate.products.push({ product: pid, quantity: 1 })
        }
       // const result = await cartModel.findByIdAndUpdate(cid, cartToUpdate, { returnDocument: 'after' })
        const result = await CartService.update(cid, cartToUpdate, { returnDocument: 'after' })
        res.status(201).json({ status: 'success', payload: result })
    } catch(err) {
        res.status(500).json({ status: 'error', error: err.message })
    }
}

export const deleteProductFromCartController = async (req, res) => {
    try {
        const cid = req.params.cid
        const pid = req.params.pid
        //const cartToUpdate = await cartModel.findById(cid)
        const cartToUpdate = await CartService.getById(cid)
        if (cartToUpdate === null) {
            return res.status(404).json({ status: 'error', error: `Cart with id=${cid} Not found` })
        }
        //const productToDelete = await productModel.findById(pid)
        const productToDelete = await ProductService.getById(pid)
        if (productToDelete === null) {
            return res.status(404).json({ status: 'error', error: `Product with id=${pid} Not found` })
        }
        const productIndex = cartToUpdate.products.findIndex(item => item.product == pid)
        if ( productIndex === -1) {
            return res.status(400).json({ status: 'error', error: `Product with id=${pid} Not found in Cart with id=${cid}` })
        } else {
            cartToUpdate.products = cartToUpdate.products.filter(item => item.product.toString() !== pid)
        }
        //const result = await cartModel.findByIdAndUpdate(cid, cartToUpdate, { returnDocument: 'after' })
        const result = await CartService.update(cid, cartToUpdate, { returnDocument: 'after' })
        res.status(200).json({ status: 'success', payload: result })
    } catch(err) {
        res.status(500).json({ status: 'error', error: err.message })
    }
}

export const updateCartController = async (req, res) => {
    try {
        const cid = req.params.cid
        //const cartToUpdate = await cartModel.findById(cid)
        const cartToUpdate = await CartService.getById(cid)
        if (cartToUpdate === null) {
            return res.status(404).json({ status: 'error', error: `Cart with id=${cid} Not found` })
        }
        const products = req.body.products
        if (!products) {
            return res.status(400).json({ status: 'error', error: 'Field "products" is not optional' })
        }
        for (let index = 0; index < products.length; index++) {
            if (!products[index].hasOwnProperty('product') || !products[index].hasOwnProperty('quantity')) {
                return res.status(400).json({ status: 'error', error: 'product must have a valid id and a valid quantity' })
            }
            if (typeof products[index].quantity !== 'number') {
                return res.status(400).json({ status: 'error', error: 'product\'s quantity must be a number' })
            }
            if (products[index].quantity === 0) {
                return res.status(400).json({ status: 'error', error: 'product\'s quantity cannot be 0' })
            }
           // const productToAdd = await productModel.findById(products[index].product)
           const productToAdd = await ProductService.getById(products[index].product)
            if (productToAdd === null) {
                return res.status(400).json({ status: 'error', error: `Product with id=${products[index].product} doesnot exist. We cannot add this product to the cart with id=${cid}` })
            }
        }

        cartToUpdate.products = products
       // const result = await cartModel.findByIdAndUpdate(cid, cartToUpdate, { returnDocument: 'after' })
       const result = await CartService.update(cid, cartToUpdate, { returnDocument: 'after' })
        res.status(200).json({ status: 'success', payload: result })
    } catch(err) {
        res.status(500).json({ status: 'error', error: err.message })
    }
}

export const updateProductQtyFromCartController = async (req, res) => {
    try {
        const cid = req.params.cid
        const pid = req.params.pid
        //const cartToUpdate = await cartModel.findById(cid)
        const cartToUpdate = await CartService.getById(cid)
        if (cartToUpdate === null) {
            return res.status(404).json({ status: 'error', error: `Cart with id=${cid} Not found` })
        }
       // const productToUpdate = await productModel.findById(pid)
        const productToUpdate = await ProductService.getById(pid)
        if (productToUpdate === null) {
            return res.status(404).json({ status: 'error', error: `Product with id=${pid} Not found` })
        }

        const quantity = req.body.quantity
        if (!quantity) {
            return res.status(400).json({ status: 'error', error: 'Field "quantity" is not optional' })
        }
        if (typeof quantity !== 'number') {
            return res.status(400).json({ status: 'error', error: 'product\'s quantity must be a number' })
        }
        if (quantity === 0) {
            return res.status(400).json({ status: 'error', error: 'product\'s quantity cannot be 0' })
        }
        const productIndex = cartToUpdate.products.findIndex(item => item.product == pid)
        if ( productIndex === -1) {
            return res.status(400).json({ status: 'error', error: `Product with id=${pid} Not found in Cart with id=${cid}` })
        } else {
            cartToUpdate.products[productIndex].quantity = quantity
        }

        //const result = await cartModel.findByIdAndUpdate(cid, cartToUpdate, { returnDocument: 'after' })
        const result = await CartService.update(cid, cartToUpdate, { returnDocument: 'after' })
        res.status(200).json({ status: 'success', payload: result })
    } catch(err) {
        res.status(500).json({ status: 'error', error: err.message })
    }
}

export const clearCartController = async (req, res) => {
    try {
        const cid = req.params.cid
       // const cartToUpdate = await cartModel.findById(cid)
        const cartToUpdate = await CartService.getById(cid)
        if (cartToUpdate === null) {
            return res.status(404).json({ status: 'error', error: `Cart with id=${cid} Not found` })
        }
        cartToUpdate.products = []
       // const result = await cartModel.findByIdAndUpdate(cid, cartToUpdate, { returnDocument: 'after' })
       const result = await CartService.update(cid, cartToUpdate, { returnDocument: 'after' })
        res.status(200).json({ status: 'success', payload: result })
    } catch(err) {
        res.status(500).json({ status: 'error', error: err.message })
    }
}

export const purchaseController = async(req, res) => {
    try {
        const cid = req.params.cid
       // const cartToPurchase = await cartModel.findById(cid)
        const cartToPurchase = await CartService.getById(cid)
        if (cartToPurchase === null) {
            return res.status(404).json({ status: 'error', error: `Cart with id=${cid} Not found` })
        }
        let productsToTicket = []
        let productsAfterPurchase = cartToPurchase.products
        let amount = 0
        for (let index = 0; index < cartToPurchase.products.length; index++) {
            const productToPurchase = await ProductService.getById(cartToPurchase.products[index].product)
            if (productToPurchase === null) {
                return res.status(400).json({ status: 'error', error: `Product with id=${cartToPurchase.products[index].product} does not exist. We cannot purchase this product` })
            }
            if (cartToPurchase.products[index].quantity <= productToPurchase.stock) {
                productToPurchase.stock -= cartToPurchase.products[index].quantity
                await ProductService.update(productToPurchase._id, { stock: productToPurchase.stock })

                productsAfterPurchase = productsAfterPurchase.filter(item => item.product.toString() !== cartToPurchase.products[index].product.toString())
                //cálculo del amount (total del ticket)
                amount += (productToPurchase.price * cartToPurchase.products[index].quantity)
                //se coloca el producto en el Ticket (en memoria)
                productsToTicket.push({ product: productToPurchase._id, price: productToPurchase.price, quantity: cartToPurchase.products[index].quantity})
            }
        }
        //Actualización del carrito -se quitan los productos comprados
       // await cartModel.findByIdAndUpdate(cid, { products: productsAfterPurchase }, { returnDocument: 'after' })
       await CartService.update(cid, { products: productsAfterPurchase }, { returnDocument: 'after' })
        //Ticket
        const result = await ticketModel.create({
            code: shortid.generate(),
            products: productsToTicket,
            amount,
            purchaser: req.session.user.email
        })
        return res.status(201).json({ status: 'success', payload: result })
    } catch(err) {
        return res.status(500).json({ status: 'error', error: err.message })
    }
}

