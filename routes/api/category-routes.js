const router = require('express').Router();
const { Category, Product } = require('../../models');

// The `/api/categories` endpoint

router.get('/', async (req, res) => {
  // find all categories
  // be sure to include its associated Products
  try {
    categoryData = await Category.findAll({ include: [{ model: Product }] });
    res.status(200).json(categoryData);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

router.get('/:id', async (req, res) => {
  // find one category by its `id` value
  // be sure to include its associated Products
  try {
    const categoryData = await Category.findByPk(req.params.id, {
      include: [{ model: Product }]
    });

    if (!categoryData) {
      res.status(404).json({ message: `There is no category matching ID #${req.params.id}!` });
      return;
    }

    res.status(200).json(categoryData);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

router.post('/', async (req, res) => {
  // create a new category
  try {
    if (!req.body.category_name) {
      res.status(400).json({ message: 'Request body must have a category_name property.' });
      return;
    }

    const categoryData = await Category.create(req.body);
    res.status(201).json(categoryData);

  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

router.put('/:id', async (req, res) => {
  // update a category by its `id` value
  try {
    const chosenCategory = await Category.findByPk(req.params.id);
    if (!chosenCategory) {
      res.status(404).json({ message: `There is no category matching ID #${req.params.id}!` });
      return;
    }
    
    if (!req.body.category_name) {
      res.status(400).json({ message: 'PUT requests must contain a valid body.' });
      return;
    }
    
    const categoryData = await Category.update(req.body, {
      where: {
        id: req.params.id
      }
    });
    res.status(200).json({ message: `Category with ID #${req.params.id} has been updated.`, update: req.body });

  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

router.delete('/:id', async (req, res) => {
  // delete a category by its `id` value
  try {
    const doesExist = await Category.findByPk(req.params.id);
    if (!doesExist) {
      res.status(404).json({ message: `There is no category matching ID #${req.params.id}!` });
    }

    await Category.destroy({
      where: {
        id: req.params.id
      }
    });

    res.status(200).json({ message: `Category with ID #${req.params.id} has been deleted.` });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

module.exports = router;
