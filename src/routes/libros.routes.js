const { Router } = require('express');
const router = Router();

/*
const { 
    renderLibroForm,
    crearNuevoLibro,
    renderLibros,
    renderEditarForm,
    updateLibro,
    deleteLibro
} = require('../controllers/libros.controller');


// Libro Nuevo
router.get("/libros/agregar", renderLibroForm);

router.post("/libros/nuevo-libro", crearNuevoLibro);

// Obtener Todos los Libros
router.get("/libros", renderLibros);

// Editar Libros
router.get("/libros/editar/:id", renderEditarForm);

router.put("/libros/editar-libro/:id", updateLibro);

// Borrar Libros
router.delete("/libros/borrar/:id", deleteLibro);*/







const { 
    renderFormularioNuevoLibro, 
    crearNuevoLibro,
    renderMostrarTodosLosLibros,
    renderEditarUnLibro, 
    actualizarLibro,
    eliminarUnLibro,
    renderPrestarLibros,
    renderLibrosPrestados,
    prestarLibro
} = require('../controllers/libros.controller');

/* GUARDAR */
//ruta para la vista de crear nuevo libro
router.get('/libros/agregarnuevo', renderFormularioNuevoLibro);

//ruta para el envio del libro a la bd
router.post('/libros/libronuevo', crearNuevoLibro );



/* MOSTRAR */
router.get('/libros', renderMostrarTodosLosLibros); //muestra todo los libros
router.get('/libros/librosprestados', renderLibrosPrestados); //

/* PRESTAR LIBRO */
router.get('/libros/prestarlibro/:id', renderPrestarLibros); //muestra los libros a prestar
router.put('/libros/prestarlibro/:id', prestarLibro); //metodo put para prestar libro

/* EDITAR UN LIBRO */
router.get('/libros/editarlibro/:id', renderEditarUnLibro); 

//ruta para enviar la informacion a actualizar del libro
router.put('/libros/editarlibro/:id', actualizarLibro);

/* ELIMINAR */
router.delete('/libros/borrar/:id', eliminarUnLibro);

module.exports = router;