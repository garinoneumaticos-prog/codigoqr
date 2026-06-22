const express = require('express');
const { Pool } = require('pg');
const app = express();

// Render inyecta la variable de entorno DATABASE_URL automáticamente
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false // Necesario para la mayoría de servicios en la nube
  }
});

app.get('/:slug', async (req, res) => {
  const { slug } = req.params;
  try {
    const result = await pool.query('SELECT destination FROM redirects WHERE slug = $1', [slug]);
    
    if (result.rows.length > 0) {
      // Redirección exitosa
      res.redirect(result.rows[0].destination);
    } else {
      res.status(404).send('Enlace no encontrado');
    }
  } catch (err) {
    console.error('Error en DB:', err);
    res.status(500).send('Error de servidor');
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Servidor activo en puerto ${port}`));

