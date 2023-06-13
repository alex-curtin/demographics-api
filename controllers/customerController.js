const db = require('../db');

const { demoCategories } = require('./constants');

exports.createCustomer = async (req, res) => {
    const { body } = req;
    const keys = Object.keys(body).join(', ');
    const values = Object.values(body).map(v => (
      typeof v === 'number' ? v : `'${v}'`
    )).join(', ');
    const qString = `INSERT INTO customers(${keys}) VALUES(${values});`
    const result = await db.query(qString);
    res.json({ result });
}

const getDemosByCategory = async (cat) => {
  const query = `
    SELECT DISTINCT(${cat})
    FROM customers;
  `
  const { rows } = await db.query(query);
  return rows.map(row => row[cat]);
};

exports.getAllDemos = async (req, res) => {
    const data = {};
    const requests = demoCategories.map(async cat => {
      return getDemosByCategory(cat)
      .then(res => data[cat] = res);
    })
    
    Promise.all(requests).then(() => {
      res.status(400).json(data);
    })
}

const getDemoStatsByCategory = async (cat, where) => {
  const query = `
    SELECT
      ${cat}, 
      COUNT(${cat}) AS count, 
      (COUNT(*) * 100.0) / SUM(COUNT(*)) OVER () AS percentage
    FROM customers
    WHERE ${where}
    GROUP BY ${cat};
    `;
  const { rows } = await db.query(query);
  const formattedRows = rows.map(row => (
    { [row[cat]]: {count: row.count, percentage: row.percentage} }
  ))
    .reduce((obj, cur) => ({
    ...obj,
    ...cur
  }), {});
  return formattedRows;
};

exports.getDemoDataByProductId = async (req, res) => {
  const { product_id: productId } = req.params;
  const { body } = req;
  try {
    let conditions = `${Object.entries(body).map(([cat, demos]) => (
      `(${demos.map(demo => `${cat} = '${demo}'`).join(' OR ')})`
    )).join(' AND ')}`
    conditions = conditions.length ? ' AND ' + conditions : '';
    const where = `product_id = ${productId}${conditions}`;
    const query = `SELECT * FROM customers WHERE ${where};`
    
    const data = {};
    const requests = demoCategories.map(async cat => {
      return getDemoStatsByCategory(cat, where)
        .then(res => data[cat] = res);
    });
    
    Promise.all(requests).then(() => {
      res.status(400).json(data);
    })
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Something went wrong' });
  }
}