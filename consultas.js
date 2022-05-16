const { Pool } = require("pg");
const pool = new Pool({
    user: "jona",
    host: "localhost",
    password: "1234",
    port: 5432,

    // Paso 1
    database: "gym",
    rowMode: "array",
});
// Paso 2
const insertar = async (datos) => {

    // Paso 3

    const consulta = {
        text: "INSERT INTO entrenamientos values($1, $2, $3, $4) RETURNING *",
        values: datos,
        rowMode: "array",

    };

    try {

        const result = await pool.query(consulta);
        console.info(result.rows[0]);
        return result;
    } catch (error) {

        // Paso 4

        console.error(err);

        return error;
    }
};

const consultar = async () => {
    try {
        const result = await pool.query("SELECT * FROM entrenamientos;");

        return result;
    } catch (error) {
        console.log(error);
        return error;
    }
};
const editar = async (datos) => {
    console.log(datos)
    try {
        const result = await pool.query(`UPDATE entrenamientos SET
    nombre = '${datos[0]}',
    series = '${datos[1]}',
    repeticiones = '${datos[2]}',
    descanso = '${datos[3]}'
    WHERE nombre = '${datos[0]}' RETURNING *`);
        return result;
    } catch (error) {
        console.log(error);
        return error;
    }
}
const eliminar = async (nombre) => {
    try {
        const result = await pool.query(
            `DELETE FROM entrenamientos WHERE nombre = '${nombre}' RETURNING *`
        );
        console.log(`entrenamiento -> ${nombre} <- eliminado`)
        return result.rowCount;
    } catch (error) {
        console.log(error.code);
        return error;
    }
};
// Paso 5
module.exports = { insertar, consultar, editar, eliminar};