const data = require("../cartier_catalog.json");

const searchItems = (query) => {
  const { category, price, color, metal } = query;
  let filteredItems = data;

  if (category)
    filteredItems = filteredItems.filter((item) => item.category === category);
  if (price) {
    const [minPrice, maxPrice] = price.split("-");
    filteredItems = filteredItems.filter(
      (item) => item.price >= minPrice && item.price <= maxPrice
    );
  }
  if (color)
    filteredItems = filteredItems.filter(
      (item) => item.color && item.color.split(", ").includes(color)
    );
  if (metal)
    filteredItems = filteredItems.filter(
      (item) => item.metals && item.metals.split(", ").includes(metal)
    );

  return filteredItems;
};

module.exports = searchItems;
