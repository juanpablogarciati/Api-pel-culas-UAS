const express = require('express');
const sequelize = require('./sequelize');
const Pelicula = require('./models/pelicula');
const Usuario = require('./models/usuario');
const verificarToken = require('./middleware/auth');

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
app.use(express.json());

// 🚀 Inicializar base de datos y datos iniciales
sequelize.sync({ force: true }).then(async () => {
  await Pelicula.bulkCreate([
    { titulo: "Inception", director: "Christopher Nolan", anio: 2010, genero: "Ciencia ficción" },
    { titulo: "The Matrix", director: "Wachowski Sisters", anio: 1999, genero: "Acción" },
    { titulo: "Parasite", director: "Bong Joon-ho", anio: 2019, genero: "Drama" },
    { titulo: "Interstellar", director: "Christopher Nolan", anio: 2014, genero: "Ciencia ficción" },
    { titulo: "Pulp Fiction", director: "Quentin Tarantino", anio: 1994, genero: "Crimen" },
    { titulo: "Spirited Away", director: "Hayao Miyazaki", anio: 2001, genero: "Animación" },
    { titulo: "The Godfather", director: "Francis Ford Coppola", anio: 1972, genero: "Crimen" },
    { titulo: "Fight Club", director: "David Fincher", anio: 1999, genero: "Drama" }
  ]);

  const hashedPassword = await bcrypt.hash("1234", 10);
  await Usuario.create({ username: "juan", password: hashedPassword });

  console.log("Películas y usuario insertados ✅");
});

// 🌐 Ruta raíz
app.get('/', (req, res) => {
  res.send('Bienvenido a la API de Películas 🎬');
});

// 🎬 Rutas de películas
app.get('/peliculas', async (req, res) => {
  const peliculas = await Pelicula.findAll();
  res.json(peliculas);
});

app.post('/peliculas', async (req, res) => {
  const nueva = await Pelicula.create(req.body);
  res.json({ mensaje: "Película agregada", pelicula: nueva });
});

app.put('/peliculas/:id', async (req, res) => {
  const id = req.params.id;
  await Pelicula.update(req.body, { where: { id } });
  res.json({ mensaje: "Película actualizada" });
});

app.delete('/peliculas/:id', async (req, res) => {
  const id = req.params.id;
  await Pelicula.destroy({ where: { id } });
  res.json({ mensaje: "Película eliminada" });
});

// 👤 Rutas de usuarios
app.post('/registro', async (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const usuario = await Usuario.create({ username, password: hashedPassword });
  res.json({ mensaje: "Usuario registrado", usuario });
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const usuario = await Usuario.findOne({ where: { username } });

  if (!usuario) return res.status(404).json({ mensaje: "Usuario no encontrado" });

  const valido = await bcrypt.compare(password, usuario.password);
  if (!valido) return res.status(401).json({ mensaje: "Contraseña incorrecta" });

  const token = jwt.sign(
    { id: usuario.id, username: usuario.username },
    process.env.JWT_SECRET || 'clave_secreta',
    { expiresIn: '1h' }
  );

  res.json({ mensaje: "Login exitoso", token });
});

// 🌐 Configuración de puerto para Render
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
