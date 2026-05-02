import { Router } from 'express'
import { optionalAuth } from '../../middlewares/auth.middleware.js'

const router = Router()

router.get('/', optionalAuth, (req, res) => {
  res.render('home', {
    titulo: 'Inicio',
    usuario: req.usuario || null,
  })
})

export default router