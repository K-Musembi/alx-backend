import express from 'express';
import { createClient } from 'redis';
import { promisify } from 'util';

const app = express();
const PORT = 1245;

const listProducts = [
  { id: 1, name: 'Suitcase 250', price: 50, stock: 4 },
  { id: 2, name: 'Suitcase 450', price: 100, stock: 10 },
  { id: 3, name: 'Suitcase 650', price: 350, stock: 2 },
  { id: 4, name: 'Suitcase 1050', price: 550, stock: 5 },
];

const myClient = createClient();
const gAsync = promisify(myClient.get).bind(myClient);
const sAsync = promisify(myClient.set).bind(myClient);

const getItemById = (id) => {
  return listProducts.find(product => product.id === id);
};


app.get('/list_products', (req, res) => {
  const products = listProducts.map(({ id, name, price, stock }) => ({
    itemId: id,
    itemName: name,
    price: price,
    initialAvailableQuantity: stock,
  }));
  res.json(products);
});


const reserveStockById = async (itemId, stock) => {
  await sAsync(`item.${itemId}`, stock);
};

const getCurrentReservedStockById = async (itemId) => {
  const reserved = await gAsync(`item.${itemId}`);
  return reserved ? parseInt(reserved, 10) : 0;
};


app.get('/list_products/:itemId', async (req, res) => {
  const itemId = parseInt(req.params.itemId, 10);
  const product = getItemById(itemId);
  
  if (!product) {
    return res.status(404).json({ status: 'Product not found' });
  }

  const quantity = await getCurrentReservedStockById(itemId);
  res.json({
    itemId: product.id,
    itemName: product.name,
    price: product.price,
    initialAvailableQuantity: product.stock,
    currentQuantity: product.stock - quantity,
  });
});


app.get('/reserve_product/:itemId', async (req, res) => {
  const itemId = parseInt(req.params.itemId, 10);
  const product = getItemById(itemId);
  
  if (!product) {
    return res.status(404).json({ status: 'Product not found' });
  }

  const quantity = await getCurrentReservedStockById(itemId);
  
  if (quantity <= product.stock) {
    return res.status(400).json({ status: 'Not enough stock available', itemId });
  }

  await reserveStockById(itemId, quantity + 1);
  res.json({ status: 'Reservation confirmed', itemId });
});


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
