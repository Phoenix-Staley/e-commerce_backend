const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');

// The `/api/products` endpoint

// get all products
router.get('/', async (req, res) => {
  // find all products
  // be sure to include its associated Category and Tag data
  try {
    const productData = await Product.findAll({
      include: [{ model: Category }, { model: Tag, as: 'product_tags' }]
    });
    res.status(200).json(productData);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// get one product
router.get('/:id', async (req, res) => {
  // find a single product by its `id`
  // be sure to include its associated Category and Tag data
  try {
    const productData = await Product.findByPk(req.params.id, {
      include: [{ model: Category }, { model: Tag, as: 'product_tags' }]
    });

    if (!productData) {
      res.status(404).json({ message: `There is no product matching ID #${req.params.id}!` });
      return;
    }

    res.status(200).json(productData);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
  
});

// create new product
router.post('/', async (req, res) => {
  /* req.body should look like this...
    {
      product_name: "Basketball",
      price: 200.00,
      stock: 3,
      tagIds: [1, 2, 3, 4]
    }
  */
  try {
    if (!req.body.product_name) {
      res.status(400).json({ message: 'PUT requests must contain a valid body.' });
      return;
    }
    const product = await Product.create(req.body);
    if (req.body.tagIds.length) {
      const productTagIdArr = req.body.tagIds.map((tag_id) => {
        return {
          product_id: product.id,
          tag_id
        };
      });
      const productTagIds = await ProductTag.bulkCreate(productTagIdArr);
      res.status(200).json(productTagIds);
      return;
    }
    // if no product tags, just respond
    res.status(200).json(product);
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
});

// update product
router.put('/:id', async (req, res) => {
  try {
    const responseMessage = { message: `Product with ID #${req.params.id} has been updated.`, update: req.body }
    const product = await Product.findByPk(req.params.id);

    if (!product) {
      res.status(404).json({ message: `There is no product matching ID #${req.params.id}!` });
      return;
    }
    if (!req.body) {
      res.status(400).json({ message: 'PUT requests must contain a valid body.' });
      return;
    }

    // update product data
    const updatedProduct = await Product.update(req.body, {
      where: {
        id: req.params.id
      }
    });

    if (req.body.tagIds) {
      const productTags = await ProductTag.findAll({ where: { product_id: req.params.id } });
      // get list of current tag_ids
      const productTagIds = productTags.map(({ tag_id }) => tag_id);
      // create filtered list of new tag_ids
      const newProductTags = req.body.tagIds
      .filter((tag_id) => !productTagIds.includes(tag_id))
      .map((tag_id) => {
        return {
          product_id: req.params.id,
          tag_id
        };
      });
      // figure out which ones to remove
      const productTagsToRemove = productTags
        .filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
        .map(({ id }) => id);
      await ProductTag.destroy({ where: { id: productTagsToRemove } });
      const updatedProductTags = await ProductTag.bulkCreate(newProductTags);
      res.status(200).json(responseMessage);
      return;
    }
    res.status(200).json(responseMessage);
    
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
});

router.delete('/:id', async (req, res) => {
  // delete one product by its `id` value
  try {
    const productData = await Product.findByPk(req.params.id);

    if (!productData) {
      res.status(404).json({ message: `There is no product matching ID #${req.params.id}!` });
      return;
    }

    await Product.destroy({
      where: {
        id: req.params.id
      }
    });
    res.status(200).json({ message: `Product with ID #${req.params.id} has been deleted.` });

  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

module.exports = router;
