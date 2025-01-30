const express = require('express');
const bodyParser = require('body-parser');
const { spawn } = require('child_process');
const { Jimp } = require('jimp');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;

// Crear carpeta 'public/images' si no existe
const imagesDir = path.join(__dirname, 'public', 'images');
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
}

// Middleware para procesar formularios
app.use(bodyParser.urlencoded({ extended: false }));

// Servir archivos estáticos desde la carpeta 'public'
app.use(express.static('public'));

// Ruta para capturar una foto y guardarla
app.get('/capture', (req, res) => {
  console.log("Capturando imagen...");

  // Generar nombre único para la imagen
  const timestamp = Date.now();
  const imagePath = path.join(imagesDir, `photo_${timestamp}.jpg`);

  // Capturar imagen con ffmpeg desde /dev/video0
  const ffmpegProcess = spawn('ffmpeg', ['-f', 'video4linux2', '-i', '/dev/video0', '-vframes', '1', '-q:v', '2', imagePath]);

  ffmpegProcess.on('exit', async (code) => {
    console.log(`[ ~ ffmpegProcess.on ~ code]`, code)

    if (code === 0) {
      try {

        // Enviar la imagen al cliente
        res.json({ success: true, imageUrl: `/images/photo_${timestamp}.jpg` });
      } catch (err) {
        console.error("Error procesando la imagen:", err);
        res.status(500).json({ success: false, error: 'Error procesando la imagen' });
      }
    } else {
      console.error("Error capturando la imagen");
      res.status(500).json({ success: false, error: 'Error capturando la imagen' });
    }
  });
});

// Ruta para ver las imágenes guardadas
app.get('/images', (req, res) => {
  fs.readdir(imagesDir, (err, files) => {
    if (err) {
      return res.status(500).send('Error al leer la carpeta de imágenes');
    }

    const imageLinks = files.map(file => `<li><a href="/images/${file}">${file}</a></li>`).join('');
    res.send(`<h1>Imágenes capturadas</h1><ul>${imageLinks}</ul>`);
  });
});

// Obtener las últimas 9 imágenes
app.get('/latest-images', (req, res) => {
  fs.readdir(imagesDir, (err, files) => {
    if (err) return res.status(500).json({ error: 'Error al leer las imágenes' });

    // Ordenar por fecha y obtener las últimas 9 imágenes
    const latestFiles = files
      .filter(file => file.endsWith('.jpg'))
      .sort((a, b) => b.split('_')[1].split('.')[0] - a.split('_')[1].split('.')[0])
      .slice(0, 9)
      .map(file => ({ filename: file, url: `/images/${file}` }));

    res.json(latestFiles);
  });
});


app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
