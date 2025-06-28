const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// Create PO endpoint
app.post('/api/purchase-orders', async (req, res) => {
  const {
    supplier_id,
    created_by,
    po_number,
    status,
    order_date,
    expected_date,
    total_amount,
    notes
  } = req.body;

  // Basic validation
  if (!supplier_id || !created_by || !po_number || !status || !order_date || !expected_date || !total_amount) {
    return res.status(400).json({ error: 'Missing required fields.' });
  }

  try {
    const result = await pool.query(
      `INSERT INTO PurchaseOrders (supplier_id, created_by, po_number, status, order_date, expected_date, total_amount, notes)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [supplier_id, created_by, po_number, status, order_date, expected_date, total_amount, notes || null]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// List POs endpoint
app.get('/api/purchase-orders', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM PurchaseOrders ORDER BY po_id DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));