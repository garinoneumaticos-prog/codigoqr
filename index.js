const express = require('express');
const { Pool } = require('pg');
const app = express();

// Configura tu conexión a PostgreSQL (usa tus credenciales)
const pool = new Pool({
  connectionString: 'postgresql://postgres:admingarino08@localhost:5432/garino_db'
});

app.get('/:slug', async (req, res) => {
  const { slug } = req.params;
  try {
    const result = await pool.query('SELECT destination FROM redirects WHERE slug = $1', [slug]);
    if (result.rows.length > 0) {
      res.redirect(result.rows[0].destination);
    } else {
      res.status(404).send('Enlace no encontrado');
    }
  } catch (err) {
    res.status(500).send('Error en el servidor');
  }
});

app.listen(3000, () => console.log('Servidor activo en puerto 3000'));