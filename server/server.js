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
