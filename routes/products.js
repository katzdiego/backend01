const express = require('express');
const passport = require('passport');
const ProductRepository = require('../repositories/ProductRepository');
const { authorizeRole } = require('../middleware/authorization');

const router = express.Router();
const productRepo = new ProductRepository();

router.get('/', async (req, res) => {
  try {
    const products = await productRepo.getAll();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener productos' });
  }
});


router.get('/:id', async (req, res) => {
  try {
    const product = await productRepo.getById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Producto no encontrado' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener producto' });
  }
});

router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  authorizeRole('admin'),                           
  async (req, res) => {
    try {
      const newProduct = await productRepo.create(req.body);
      res.status(201).json(newProduct);
    } catch (err) {
      res.status(500).json({ message: 'Error al crear producto' });
    }
  }
);


router.put(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  authorizeRole('admin'),
  async (req, res) => {
    try {
      const updatedProduct = await productRepo.update(req.params.id, req.body);
      if (!updatedProduct) return res.status(404).json({ message: 'Producto no encontrado' });
      res.json(updatedProduct);
    } catch (err) {
      res.status(500).json({ message: 'Error al actualizar producto' });
    }
  }
);

router.delete(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  authorizeRole('admin'),
  async (req, res) => {
    try {
      const deletedProduct = await productRepo.delete(req.params.id);
      if (!deletedProduct) return res.status(404).json({ message: 'Producto no encontrado' });
      res.json({ message: 'Producto eliminado' });
    } catch (err) {
      res.status(500).json({ message: 'Error al eliminar producto' });
    }
  }
);

module.exports = router;