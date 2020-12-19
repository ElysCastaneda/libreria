const librosCtrl = {};
const   MongoClient   = require('mongodb').MongoClient;

//direccion de la base de datos
//ElisJohana11#
const uri = "mongodb+srv://ely:ely1234@cluster0.tnvei.mongodb.net/prestalibros?retryWrites=true&w=majority"

//cliente de la base de datos
const cliente = new MongoClient(uri, { 
    useNewUrlParser: true, 
    useUnifiedTopology: true
    },(err) => {
    
        if (err) return console.error(err);
        console.log('Connected to database') 
});


//CONTROLLADOR
/* ########################################################################################### */


//muestra la vista para registrar un nuevo libro
librosCtrl.renderFormularioNuevoLibro = async(req, res) => {
    //conecto la base de datos
    await conexionPrincipal().catch(console.error);
    res.render('libros/nuevolibro');
}

//para enviar las notas
librosCtrl.crearNuevoLibro = async(req, res) => {
    //console.log(req.body);
    const { nombre, autor } = req.body;
    const datos_a_guardar = {
        nombre,
        autor,
        lector: '',
        prestamo: 'false',
        fecha_prestamo: ''
    };

    const mislibros = await ingresarUnNuevoLibro(datos_a_guardar).catch(console.error);
    //codigo para guardar un nuevo libro
    //res.send('nuevo libro');
    res.redirect('/libros');
}

//muestra la vista de los libros que hay en la base de datos
librosCtrl.renderMostrarTodosLosLibros = async(req, res) => {
    //muestro todos los libros de la bd
    const mislibros = await mostrarTodosLosLibros().catch(console.error);
    res.render('libros/todosloslibros', { mislibros }); 
}

//muestra los libros prestados
librosCtrl.renderLibrosPrestados = async(req, res) => {
    const mislibros = await mostrarLibrosPrestados().catch(console.error);
    res.render('libros/librosprestados', { mislibros });
}

//muestra la vista para editar un libro de la base de datos
librosCtrl.renderEditarUnLibro = async(req, res) => {

    const  nombre  = req.params.id;
    console.log('el nombre del libro es xxxxxxxx: ', nombre);
    const mislibros = await buscarLibroPorNombre(nombre).catch(console.error);
    res.render('libros/editarunlibro', { mislibros });
}

//muestra los libros a prestar
librosCtrl.renderPrestarLibros = async(req, res) => {
    const  libronombre  = req.params.id;
    console.log('El nombre del libro para prestar es: ', libronombre);
    const mislibros = await buscarLibroPorNombre(libronombre).catch(console.error);
    res.render('libros/prestarlibro', { mislibros });
}

librosCtrl.prestarLibro = async(req, res) => {
    const {  nombre, autor, lector } = req.body;
    console.log('el nombre del libro es: ', nombre);
    console.log('el autor del libro es: ',autor);
    console.log('el lector del libro es: ', lector)
    const _prestamo = 'true';
    const fecha = obtenerfecha();
    const mislibros = await actualizarLibroPorNombre(req.params.nombre, { nombre: nombre, autor: autor, lector: lector, prestamo: _prestamo, fecha_prestamo: fecha } ).catch(console.error);
    //res.send('se actualizo un libro');
    res.redirect('/libros');
}



//actualiza el libro de la base de datos
librosCtrl.actualizarLibro = async(req, res) => {
    const {  nombre, autor } = req.body;
    console.log('el nombre del libro es: ', nombre);
    console.log('el autor del libro es: ',autor);
    const mislibros = await actualizarLibroPorNombre(req.params.nombre, { nombre: nombre, autor: autor } ).catch(console.error);
    //res.send('se actualizo un libro');
    res.redirect('/libros');
}

//eliminar una nota de la bas de datos
librosCtrl.eliminarUnLibro = async(req, res) => {
    console.log('el id del libro es; ', req.params.id);
    const mislibros = await borrarLibroporNombre(req.params.id).catch(console.error);
    //res.redirect('/libros');
    //res.send('se ha borrado un libro');
    res.redirect('/libros');
}


/* ############################################################################# */
//        OPERACIONES CON MONGODB - conectar, agregar, actualizar, eliminar      
/* ############################################################################# */

//Funcion para conectar a la base de datos
async function conexionPrincipal(){

    console.log("REALIZARE CONEXION A MONGO!!!");

    //conectarme a la base de datos
    try{
        
        await cliente.connect();
        console.log('se conecto la base de datos');

    } catch(e){
        console.error("Se produjo un ERROR: ", e);
    } finally{
        //cierro la conexion a la base de datos
        //await cliente.close();
    }
    
}

//mostrar todos los libros
async function mostrarTodosLosLibros() {

    //conectarme a la base de datos
    try{
            
        await cliente.connect();
        console.log('se conecto la base de datos y se listaran los libros');
        const cursor = cliente.db("prestalibros").collection("registrodelibros").find({ prestamo:  { $gte: "false" } });
        const resultados = await cursor.toArray();

        // muestro los resultados
        if (resultados.length > 0) {
            resultados.forEach((resultados, i) => {
                console.log('los datos son: ', resultados);
                
                //muestro los resultados en mi html
            });
        } else {
            console.log(`No se encontraron libros`);
        }
        return resultados;
    } catch(e){
        console.error("Se produjo un ERROR: ", e);
    } finally{
        //cierro la conexion a la base de datos
        //await cliente.close();
    }  
}

//mostrar los libros prestados
async function mostrarLibrosPrestados(){
    //conectarme a la base de datos
    console.log('SE VAN A MOSTRAR LOS LIBROS PRESTADOS');
    try{
            
        await cliente.connect();
        console.log('se conecto la base de datos y se listaran los libros prestados');
        const cursor = cliente.db("prestalibros").collection("registrodelibros").find({ prestamo:  { $gte: "true" } });
        const resultados = await cursor.toArray();

        // muestro los resultados
        if (resultados.length > 0) {
            resultados.forEach((resultados, i) => {
                console.log('los datos de los libros prestados son: ', resultados);
                
                //muestro los resultados en mi html
            });
        } else {
            console.log(`No se encontraron libros`);
        }
        return resultados;
    } catch(e){
        console.error("Se produjo un ERROR: ", e);
    } finally{
        //cierro la conexion a la base de datos
        //await cliente.close();
    }  
}

//registrar un nuevo libro
async function ingresarUnNuevoLibro(nuevoLibro){
    console.log('SE VA A GUARDAR UN LIBRO NUEVO');
    const resultado = await cliente.db("prestalibros").collection("registrodelibros").insertOne(nuevoLibro);
    console.log("Se registro un Nuevo Libro: ",resultado);
}

//buscar un libro por nombre
async function buscarLibroPorNombre(nombredellibro) {
    console.log('SE VA A BUSCAR UN LIBRO');
    resultado = await cliente.db("prestalibros").collection("registrodelibros").findOne({ nombre: nombredellibro });

    if (resultado) {
        console.log(`se encontro un libro '${nombredellibro}':`);
        console.log(resultado);
    } else {
        console.log(`no se encontro el libro '${nombredellibro}'`);
    }

    return resultado;
}

async function buscarLibroPorId(idlibro) {
    console.log('SE VA A BUSCAR UN LIBRO');
    resultado = await cliente.db("prestalibros").collection("registrodelibros")
                        .findOne({ id: idlibro });

    if (resultado) {
        console.log(`se encontro un libro '${idlibro}':`);
        console.log(resultado);
    } else {
        console.log(`no se encontro el libro '${idlibro}'`);
    }

    return resultado;
}

//libros que no se han prestados
/*async function mostrarLibrosSinPrestar() {
    console.log('SE VAN A MSOTRAR LOS LIBROS');
    //conectarme a la base de datos
    try{
            
        await cliente.connect();
        console.log('se conecto la base de datos y se listaran los libros sin ´prestar');
        //const cursor = cliente.db("prestalibros").collection("registrodelibros").find({});
        

        const cursor = await cliente.db("prestalibros").collection("registrodelibros").find({ prestamo: { $gte: 'false' }});
        const resultados = await cursor.toArray();

        if (resultados.length > 0) {
            resultados.forEach((resultados, i) => {
                console.log(`se encontraron los siguientes libros: '${resultados}':`);
                console.log(resultados);
            });
            
        } else {
            console.log(`No hay libros prestados`);
        }

        return resultados;
    } catch(e){
        console.error("Se produjo un ERROR: ", e);
    } finally{
        //cierro la conexion a la base de datos
        //await cliente.close();
    }  



   
}*/

//actualizar un libro
async function actualizarLibroPorNombre(nombredellibro, libroactualizar) {
    console.log('SE VA A ACTUALIZAR UN LIBRO: ',nombredellibro);
    resultado = await cliente.db("prestalibros").collection("registrodelibros").updateOne(
        { nombre: nombredellibro },
        { $set: libroactualizar },
        { upsert: true }
        );

        console.log(`${resultado.matchedCount} un libro encontrado.`);

        if (resultado.upsertedCount > 0) {
            console.log(`Un libro va a ser actualizado con nombre ${resultado.upsertedId.nombre}`);
        } else {
            console.log(`${resultado.modifiedCount} el libro no fue actualizado`);
        }

}

//borrar un libro
async function borrarLibroporNombre(nombrelibro) {
    console.log('SE VA A BORRAR UN LIBRO');
    resultado = await cliente.db("prestalibros").collection("registrodelibros").deleteOne({ nombre: nombrelibro });

    console.log(`${resultado.deletedCount} libro(s) han sido borrados.`);

}

function obtenerfecha(){
    var fechadehoy = new Date();
    var dd = String(fechadehoy.getDate()).padStart(2, '0');
    var mm = String(fechadehoy.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = fechadehoy.getFullYear();

    fechadehoy = mm + '/' + dd + '/' + yyyy;

    return fechadehoy;
}

/* ############################################################################# */


module.exports = librosCtrl;