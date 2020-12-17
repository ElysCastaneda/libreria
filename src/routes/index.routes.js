const { Router } = require('express');
const router = Router();

const { renderIndex, renderAgregar } = require('../controllers/index.controller');
//defino mis rutas

/* --- ruta inicial --- */
router.get('/', renderIndex);
//ruta para agregar libro
router.get('/agregar', renderAgregar);

module.exports = router;