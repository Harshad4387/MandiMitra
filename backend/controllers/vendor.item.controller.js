const Item = require('../models/item.model');

const getItemsByCategory = (category) => async (req, res) => {
  try {
    const items = await Item.find({ category });
    return res.status(200).json({ items})
   
  } catch (error) {
    console.error(`Error fetching ${category} items:`, error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};
const getAllItemsGroupedByCategory = async (req, res) => {
  try {
    const categories = [
      'Fresh Produce',
      'Grains and Flours',
      'Spices and Condiments',
      'Oils and Fats',
      'Packaging and Disposables'
    ];

    const groupedItems = {};

    for (const category of categories) {
      const items = await Item.find({ category });
      groupedItems[category] = items;
    }
    
    return res.status(200).json(groupedItems);
  } catch (error) {
    console.error("Error in getAllItemsGroupedByCategory:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  getFreshProduceItems: getItemsByCategory('Fresh Produce'),
  getGrainsAndFloursItems: getItemsByCategory('Grains and Flours'),
  getSpicesAndCondimentsItems: getItemsByCategory('Spices and Condiments'),
  getOilsAndFatsItems: getItemsByCategory('Oils and Fats'),
  getPackagingItems: getItemsByCategory('Packaging and Disposables'),
  getAllItemsGroupedByCategory
};
