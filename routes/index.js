const express = require("express");
const fs = require("fs");
const router = express.Router();

// Nos muestra el path absoluto
const PATH_ROUTES = __dirname;

const removeExtension = (fileName) => {
    // [a: index, count-opinions, ]
    return fileName.split('.').shift();
}

 // Esto devolvera un array dentro de la carpeta de RUTAS dependiendo de lo que se consulte
fs.readdirSync(PATH_ROUTES).filter((file) => {
    const name = removeExtension(file);
    if(name !== 'index'){
        console.log(`Cargando ruta: ${name} . . .`);
        router.use(`/${name}`, require(`./${file}`)); // http://localhost:8001/api/{something}
    }
});

module.exports = router