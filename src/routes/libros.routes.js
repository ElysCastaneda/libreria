const { Router } = require('express');
const router = Router();

const { 
    renderFormularioNuevoLibro, 
    crearNuevoLibro,
    renderMostrarTodosLosLibros,
    renderEditarUnLibro, 
    actualizarLibro,
    eliminarUnLibro,
    renderPrestarLibros,
    renderLibrosPrestados
} = require('../controllers/libros.controller');

/* GUARDAR */
//ruta para la vista de crear nuevo libro
router.get('/libros/agregarnuevo', renderFormularioNuevoLibro);

//ruta para el envio del libro a la bd
router.post('/libros/libronuevo', crearNuevoLibro );



/* MOSTRAR */
router.get('/libros/todosloslibros', renderMostrarTodosLosLibros);
router.get('/libros/prestarlibro', renderPrestarLibros);
router.get('/libros/librosprestados', renderLibrosPrestados);

/* EDITAR UN LIBRO */
router.get('/libros/editar/:id', renderEditarUnLibro);

//ruta para enviar la informacion a actualizar del libro
router.put('/libros/editar/:id', actualizarLibro);

/* ELIMINAR */
router.delete('/libros/borrar/:id', eliminarUnLibro);

module.exports = router;