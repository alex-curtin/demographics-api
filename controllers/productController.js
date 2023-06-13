const db = require('../db');

exports.getAllProducts = async (req, res) => {
  const result = await db.query('SELECT * FROM products');
  return res.status(400).json({products: result.rows})
}

exports.getProductsByCategory = async (req, res) => {
  const { category } = req.params;
  const result = await db.query('SELECT * FROM products WHERE category = $1', [category]);
  res.status(400).json({ products: result.rows });
}

exports.searchProducts = async (req, res) => {
  const { query } = req;
  const whereClause = Object.entries(query).map(([key, value]) => (
    `${key} = '${value}'`
  )).join(' AND ');
  const result = await db.query(`SELECT * FROM products WHERE ${whereClause};`);
  res.json({ products: result.rows });
}