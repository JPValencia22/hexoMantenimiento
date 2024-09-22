const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(cors());

// Middleware to parse JSON
app.use(express.json());

// Root path to confirm that the server is working
app.get('/', (req, res) => {
  res.send('Servidor Hexo en funcionamiento');
});


// Endpoint for delete post by name
app.delete('/delete/:postName', (req, res) => {
  const postName = req.params.postName;

  const postPath = path.resolve(__dirname, `../blog/source/_posts/${postName}.md`);


  fs.access(postPath, fs.constants.F_OK, err => {
    if (err) {
      return res.status(404).json({ success: false, message: 'El post no existe.' });
    }

    fs.unlink(postPath, err => {
      if (err) {
        console.error(`Error al eliminar el post: ${err.message}`);
        return res.status(500).json({ success: false, message: 'Error al eliminar el post.' });
      }


      console.log(`Post ${postName} eliminado con éxito.`);
      res.json({ success: true, message: 'Post eliminado con éxito.' });
    });
  });
});

// Endpoint for edit post by name
app.put('/edit-post', (req, res) => {
  const postName = req.body.postName;
  const newContent = req.body.content;

  if (!postName || !newContent) {
    return res.status(400).send('El nombre del post y el contenido son necesarios.');
  }

  const postPath = path.resolve(__dirname, '../blog/source/_posts', `${postName}.md`);

  // read original content of the post
  fs.readFile(postPath, 'utf8', (err, data) => {
    if (err) {
      return res.status(404).send('Post no encontrado.');
    }

    // Separate YAML header from main content
    const parts = data.split('---');
    const headerYAML = `---${parts[1]}---\n`;

    // Write the new content keeping the header
    const updatedContent = headerYAML + newContent;

    fs.writeFile(postPath, updatedContent, err => {
      if (err) {
        return res.status(500).send('Error al editar el post.');
      }
      res.send('Post editado exitosamente.');
    });
  });
});


// run server
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
