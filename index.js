const express = require('express');
const { Pool } = require('pg');
const app = express();

// Usamos la variable que pusiste en Render
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // Neon requiere ssl: true para conexiones seguras
  ssl: {
    rejectUnauthorized: false
  }
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
    console.error('Error de conexión:', err);
    res.status(500).send('Error en el servidor: ' + err.message);
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Servidor activo en puerto ${port}`));
