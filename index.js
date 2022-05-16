const http = require("http");
const url = require("url");
// Paso 1
const { insertar,consultar,editar, eliminar } = require("./consultas");//traspaso de una funcion llamada insertar del archivo consulta.js

// Paso 2
const fs = require("fs");
http
    .createServer(async (req, res) => {

        if (req.url == "/" && req.method === "GET") {


            res.setHeader("content-type", "text/html");//usando el objeto res del servidor para obtener la cabecera que se devolvera se especifica que es html

            // Paso 4

            const html = fs.readFileSync("index.html", "utf8");//lee el archivo index.html y lo guarda en una variable
            res.end(html);//se devuelve al cliente la cosnstante html
        }
        if (req.url == "/ejercicios" && req.method == "POST") {

            let body = "";
            req.on("data", (chunk) => { //payload del cliente con los parametros a insertar
                body += chunk;
            });
            req.on("end", async () => { //como respuesta al cliente
                const datos = Object.values(JSON.parse(body)); //toma los datos del cliente y lo guarda en datos

                const respuesta = await insertar(datos); // en respuesta se guarda la funcion insertar con el parametro datos
                res.statusCode = 201//  HTTP de 201. 
                res.end(JSON.stringify(respuesta));//se le devuelve al cliente un Json 
            });
        }
        if (req.url == "/ejercicios" && req.method === "GET") {
            const registros = await consultar();
            res.statusCode = 200;
            res.end(JSON.stringify(registros));
        }
        if (req.url == "/ejercicios" && req.method == "PUT") {
            let body = "";
            req.on("data", (chunk) => {
                body += chunk;
            });
            req.on("end", async () => {
                const datos = Object.values(JSON.parse(body));
                await editar(datos);
                res.statusCode = 200;
                res.end("Recurso editado con éxito!");
            });
        }
        if (req.url.startsWith("/ejercicios?") && req.method == "DELETE") {
            const { nombre } = url.parse(req.url, true).query;
            await eliminar(nombre);
            res.statusCode = 200;
            res.end("Registro eliminado con éxito!");
        }
    })

    .listen(3000, () => console.log(" servidor disponible --> http://localhost:3000/")); 