<img src="https://raw.githubusercontent.com/hexojs/logo/master/hexo-logo-avatar.png" alt="Hexo logo" width="100" height="100" align="right" />

# Hexo 500 Internal Server Error

> Un blog rápido, simple y potente basado en [Hexo](https://hexo.io) con funcionalidades extendidas para eliminar y editar publicaciones mediante la interfaz. Implementado con [Node.js](https://nodejs.org) y un servidor en [Express](https://expressjs.com/).

## Features

- Generación de blogs de manera rápida
- Edición de publicaciones directamente desde la interfaz del blog
- Eliminación de publicaciones mediante la interfaz
- API flexible para futuras extensiones
- Funcionalidades básicas de Hexo como soporte para Markdown, plugins y despliegue sencillo
- Uso de servidor Express para gestión de posts

## Instalación

Sigue estos pasos para configurar y ejecutar el proyecto localmente.

### 1. Clonar el repositorio

```bash
$ git clone https://github.com/JPValencia22/hexoMantenimiento.git
$ cd hexoIngSw3
```

### 2. Instalar las dependencias
``` bash
$ npm install
$ npm install express cors

```

### 3. Configurar el blog
``` bash
$ cd blog
$ npm install
$ npx hexo clean
$ npx hexo generate
$ npx hexo server -w

```
### 4. Ejecutar el servidor Express
En una nueva terminal:
``` bash
$ cd server
$ node server.js

```

## Nuevas Funcionalidades

### Eliminar Publicaciones
La funcionalidad de eliminación de posts te permite eliminar cualquier entrada directamente desde la interfaz del blog. Simplemente selecciona el post que deseas eliminar y usa el botón de eliminación.

<img src="https://github.com/JPValencia22/hexoMantenimiento/blob/development/blog/themes/new-theme/source/img/featDelete.png?raw=true" alt="Hexo logo"  align="center" />

### Editar Publicaciones
La funcionalidad de edición te permite modificar los posts existentes a través de la interfaz del blog. Selecciona el post que deseas editar, realiza los cambios y guarda la actualización. Los cambios se verán reflejados inmediatamente.

<img src="https://github.com/JPValencia22/hexoMantenimiento/blob/development/blog/themes/new-theme/source/img/featEdit.png?raw=true" alt="Hexo logo"  align="center" />

### Diseño de Funcionalidades

#### Implementación del Servidor Express
El servidor Express está configurado para gestionar las peticiones de eliminación y edición de los posts. El flujo de trabajo es el siguiente:

- **Eliminar Post:**
  - **Ruta:** `DELETE /posts/:id`
  - Elimina el post basado en su ID, actualizando el estado del blog.

- **Editar Post:**
  - **Ruta:** `PUT /posts/:id`
  - Actualiza el contenido del post seleccionado y regenera los archivos estáticos de Hexo.

#### Integración con Hexo
Limpieza y Generación: Usamos los comandos `hexo clean` y `hexo generate` después de la edición o eliminación para regenerar los archivos estáticos y actualizar el contenido mostrado en el blog.

- **Servidor en modo Watch:** El servidor Hexo está configurado en modo watch para detectar cambios automáticamente.

### Quick Start
- Clona el repositorio y sigue los pasos de instalación anteriores.
- Usa `npx hexo server -w` para iniciar el blog.
- En otra terminal, usa `node server.js` para iniciar el servidor Express.
- Navega por el blog, edita o elimina los posts existentes.