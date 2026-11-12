import { Router } from 'express'
import { register, login } from '../controllers/auth.controller.js'
import {
  validateRegister,
  validateLogin
} from "../middlewares/validate-auth.js";

const router : Router = Router()

router.post('/register', validateRegister, register);
router.post('/login', validateLogin, login);

export default router