import express from "express";
import fs from "fs";
//import bodyParser from "body-parser";
const app = express();
app.use(express.json());
// Middleware para parsear el cuerpo de las peticiones como JSON
app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});

app.get("/", (req, res) => {
  res.send("Welcome to my first API with Node.js!!");
});

//Funcion para leer por consola los datos del db.json
const readData = () => {
  try {
    const data = fs.readFileSync("./db.json"); //,"utf-8") is optional, but it ensures the data is read as a string
    //console.log("Data read from db.json:", data); //=>buffer pero con utf-8 los datos se convierten a string
    //console.log("Data read from db.json:", data.toString()); // Convert buffer to string
    // console.log(JSON.parse(data));
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading db.json:", error);
    return null;
  }
};

//readData();
//Ahora llamaré a la función readData pero desde una ruta de la API
app.get("/books", (req, res) => {
  const data = readData();
  if (data) {
    res.json(data.books); //llamo todo el objeto{[{libro1},{libro2},...]} o sólo a la propiedad(data.books)=>[{libro1}, {libro2},...]
  } else {
    res.status(500).send("Error reading data");
  }
});

const writeData = (data) => {
  try {
    fs.writeFileSync("./db.json", JSON.stringify(data));
    console.log("Data written to db.json successfully.");
  } catch (error) {
    console.error("Error writing to db.json:", error);
  }
};

//Ahora busco un libro por su id
app.get("/books/:id", (req, res) => {
  const data = readData();

  const bookId = parseInt(req.params.id);
  const book = data.books.find((book) => book.id === bookId);

  res.json(book);
});

//Crear un nuevo libro
app.post("/books", (req, res) => {
  const data = readData();
  const body = req.body; // El libro debe venir en el cuerpo de la petición
  const newBook = {
    id: data.books.length + 1, // Asignar un nuevo ID basado en la longitud del array
    ...body, // Spread operator para incluir las propiedades del libro
  };
  data.books.push(newBook);
  //console.log("New book added:", newBook);
  writeData(data);

  res.json(newBook); // Devolver el libro creado
});
