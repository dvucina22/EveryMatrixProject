const itemModel = require('../models/itemModel');

exports.createItem = async (req, res) => {
  try {
    const { title, description, price, category, country, city } = req.body;
    const image = req.file?.filename || null;
    const user_id = req.user.id;
    const expiration_date = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    const item = await itemModel.createItem({
      title,
      description,
      price,
      image,
      user_id,
      category,
      country,
      city,
      expiration_date
    });

    res.status(201).json(item);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error creating item' });
  }
};


exports.getAllItems = async (req, res) => {
  try {
    const items = await itemModel.getAllItems();
    const formattedItems = items.rows.map(item => ({
      id: item.id,
      title: item.title,
      description: item.description,
      price: parseFloat(item.price),
      category: item.category,
      user_id: item.user_id,
      image: item.image ? `http://localhost:5000/uploads/${item.image}` : null,
      country: item.country,
      city: item.city,
      expiration_date: item.expiration_date
    }));
    res.json(formattedItems);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching items' });
  }
};


exports.getItemById = async (req, res) => {
  try {
    const item = await itemModel.getItemById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });
    res.json(item);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching item' });
  }
};

exports.getItemsByUser = async (req, res) => {
  const userId = req.params.id;
  try {
    const items = await itemModel.getItemsByUser(userId);
    res.json(items);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching user items' });
  }
};

exports.deleteItem = async (req, res) => {
  const itemId = req.params.id;
  const userId = req.user.id;

  try {
    const item = await itemModel.getItemById(itemId);
    if (!item) return res.status(404).json({ message: 'Oglas nije pronađen' });

    if (item.user_id !== userId) {
      return res.status(403).json({ message: 'Nemate dozvolu za brisanje ovog oglasa' });
    }

    await itemModel.deleteItem(itemId);
    res.json({ message: 'Oglas uspješno obrisan' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Greška pri brisanju oglasa' });
  }
};

exports.updateItem = async (req, res) => {
  const itemId = req.params.id;
  const userId = req.user.id;
  const { title, description, price, category, country, city } = req.body;
  const image = req.file?.filename || null;

  try {
    const item = await itemModel.getItemById(itemId);
    if (!item) return res.status(404).json({ message: 'Oglas nije pronađen' });

    if (item.user_id !== userId) {
      return res.status(403).json({ message: 'Nemate dozvolu za uređivanje ovog oglasa' });
    }

    const updatedItem = await itemModel.updateItem({
      id: itemId,
      title,
      description,
      price,
      category,
      country,
      city,
      image: image || item.image,
    });

    res.json(updatedItem);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Greška pri ažuriranju oglasa' });
  }
};


