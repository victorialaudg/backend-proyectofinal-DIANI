import { Router } from 'express'
import {
    getAllUsersController,
    getUserByIdController,
    udpateUserController,
    deleteUserController
} from '../controllers/user.controller.js'
import { handlePolicies } from '../middlewares/auth.middleware.js'

const router = Router()

//router.get('/users', handlePolicies(['ADMIN']), getAllUsersController)
router.get('/users', getAllUsersController)
router.get('/:uid', handlePolicies(['ADMIN']), getUserByIdController)
router.put('/:uid', handlePolicies(['ADMIN']), udpateUserController)
router.delete('/:uid', handlePolicies(['ADMIN']), deleteUserController)

export default router