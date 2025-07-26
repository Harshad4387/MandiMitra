const express = require('express');
const router = express.Router();
const {
  getFreshProduceItems,
  getGrainsAndFloursItems,
  getSpicesAndCondimentsItems,
  getOilsAndFatsItems,
  getPackagingItems,
  getAllItemsGroupedByCategory
} = require('../controllers/vendor.item.controller');

router.get('/fresh-produce', getFreshProduceItems);
router.get('/grains-and-flours', getGrainsAndFloursItems);
router.get('/spices-and-condiments', getSpicesAndCondimentsItems);
router.get('/oils-and-fats', getOilsAndFatsItems);
router.get('/packaging-and-disposables', getPackagingItems);
router.get('/all-categorized-items', getAllItemsGroupedByCategory);

module.exports = router;
