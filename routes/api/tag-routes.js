const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

// The `/api/tags` endpoint

router.get('/', async (req, res) => {
  // find all tags
  // be sure to include its associated Product data
  try {
    const tags = await Tag.findAll({
      include: [{ model: Product, as: 'tagged_products' }]
    });
    res.status(200).json(tags);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

router.get('/:id', async (req, res) => {
  // find a single tag by its `id`
  // be sure to include its associated Product data
  try {
    const tag = await Tag.findByPk(req.params.id, {
      include: [{ model: Product, as: 'tagged_products' }]
    });

    if (!tag) {
      res.status(404).json({ message: `There is no tag matching ID #${req.params.id}!` });
      return;
    }
    res.status(200).json(tag);

  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

router.post('/', async (req, res) => {
  // create a new tag
  try {
    const responseMessage = { message: `Product with ID #${req.params.id} has been updated.`, update: req.body }
    if (!req.body.tag_name) {
      res.status(400).json({ message: 'PUT requests must contain a valid body.' });
      return;
    }

    const newTag = await Tag.create(req.body);

    if (req.body.productIds) {
      const productTagIdArr = req.body.productIds.map((product_id) => {
        return {
          tag_id: newTag.id,
          product_id
        };
      });
      const productTagIds = await ProductTag.bulkCreate(productTagIdArr);
      res.status(201).json(productTagIds);
      return;
    }

    res.status(201).json(newTag);

  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

router.put('/:id', async (req, res) => {
  // update a tag's name by its `id` value
  try {
    const selectedTag = await Tag.findByPk(req.params.id);
    if (!selectedTag) {
      res.status(404).json({ message: `There is no tag matching ID #${req.params.id}!` });
      return;
    }
    if (!req.body.tag_name) {
      res.status(400).json({ message: 'Request body must have a tag_name property.' });
      return;
    }

    if (req.body.productIds) {
      const productTagIdArr = req.body.productIds.map((product_id) => {
        return {
          tag_id: selectedTag.id,
          product_id
        };
      });

      const productTagIds = await ProductTag.bulkCreate(productTagIdArr);
      res.status(200).json({ message: `Tag with ID #${req.params.id} has been updated.`, update: productTagIds });
      return;
    }

    await Tag.update(req.body, {
      where: {
        id: req.params.id
      }
    });
    res.status(200).json({ message: `Tag with ID #${req.params.id} has been updated.`, update: req.body });

  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

router.delete('/:id', async (req, res) => {
  // delete on tag by its `id` value
  try {
    const doesExist = await Tag.findByPk(req.params.id);
    if (!doesExist) {
      res.status(404).json({ message: `There is no tag matching ID #${req.params.id}!` });
      return;
    }

    await Tag.destroy({
      where: {
        id: req.params.id
      }
    });
    res.status(200).json({ message: `Tag with ID #${req.params.id} has been deleted.` });

  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

module.exports = router;
