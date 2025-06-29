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
    items // array of { product_id, quantity, unit_price, total_price }
  } = req.body;

  // Basic validation
  if (!supplier_id || !created_by || !po_number || !status || !order_date || !expected_date || !total_amount || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'Missing required fields or items.' });
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    // Insert PO
    const userId = created_by;

    const poRes = await client.query(
      `INSERT INTO purchaseorders 
        (supplier_id, created_by, po_number, status, order_date, expected_date, total_amount)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING po_id`,
      [supplier_id, userId, po_number, status, order_date, expected_date, total_amount]
    );
    const purchaseOrderId = poRes.rows[0].po_id;

    // Insert products/items
    for (const item of items) {
      const { product_id, quantity, unit_price, total_price } = item;
      if (!product_id || !quantity || !unit_price || !total_price) {
        await client.query('ROLLBACK');
        return res.status(400).json({ error: 'Invalid product/item fields.' });
      }
      await client.query(
        `INSERT INTO purchaseorderitems 
          (po_id, product_id, quantity, unit_price, total_price, received_qty)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [
          purchaseOrderId,
          item.product_id,
          item.quantity,
          item.unit_price,
          item.unit_price * item.quantity, // total_price
          0 // received_qty, default to 0
        ]
      );
    }
    await client.query('COMMIT');
    res.status(201).json({ po_id: purchaseOrderId });
  } catch (err) {
    await client.query('ROLLBACK');
    res.status(500).json({ error: err.message });
  } finally {
    client.release();
  }
});

// List POs endpoint
app.get('/api/purchase-orders', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM PurchaseOrders ORDER BY po_id DESC');
    const pos = result.rows;
    // For each PO, fetch its items
    for (const po of pos) {
      const itemsRes = await pool.query('SELECT * FROM purchaseorderitems WHERE po_id = $1', [po.po_id]);
      po.items = itemsRes.rows;
    }
    res.json(pos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Fetch all products
app.get('/api/products', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM products');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Fetch all suppliers
app.get('/api/suppliers', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM suppliers');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Fetch all users
app.get('/api/users', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM users');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));