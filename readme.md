# 📸 Express Camera Server

Este proyecto es un **servidor en Node.js con Express** que permite capturar imágenes desde una cámara web y almacenarlas en una carpeta pública. También ofrece una forma sencilla de visualizar las imágenes a través de una interfaz web.

## 🚀 Características

✅ Captura imágenes usando `ffmpeg`.  
✅ Guarda las imágenes en la carpeta `public/images/`.  
✅ Permite visualizar todas las imágenes capturadas.  
✅ Utiliza `Jimp` para optimizar las imágenes.  
✅ Testeado con `Jest` y `Super

## 📦 Instalación

### 🔧 1. Clonar el repositorio

```bash
git clone https://github.com/tu-usuario/express-camera-server.git
cd express-camera-server
```

### 📌 2. Instalar dependencias

```bash
npm install
```

### 🎥 3. Asegurar que ffmpeg esté instalado

Si no lo tienes, instálalo con:

```bash
sudo apt update
sudo apt install ffmpeg
```

## ▶️ Uso

🔹 1. Iniciar el servidor

```bash
npm start
```

Esto ejecutará el servidor en <http://localhost:3000>.

🔹 2. Capturar una imagen

Accede a:

<http://localhost:3000/capture>

📷 Esto capturará una imagen desde la cámara y la guardará en public/images/.

Ejemplo de respuesta JSON:

{
  "success": true,
  "imageUrl": "/images/photo_1700000000000.jpg"
}

🔹 3. Ver imágenes guardadas

Accede a:

<http://localhost:3000/images>

Aquí verás una lista con todas las fotos capturadas.

## 🛠️ API Endpoints

Método Endpoint Descripción
GET /capture Captura una foto y la guarda en public/images/.
GET /images Lista todas las imágenes capturadas.
GET /images/{nombre.jpg} Muestra una imagen específica.
