const data = require("../cartier_catalog.json");

const searchItems = (category = "", maxPrice = "", color = "", stones = "") => {
  let filteredItems = data;

  maxPrice = parseInt(maxPrice, 10);

  if (category != "")
    filteredItems = filteredItems.filter((item) => item.category === category);

  if (maxPrice != "") {
    filteredItems = filteredItems.filter((item) => item.price <= maxPrice);
  }

  if (color != "")
    filteredItems = filteredItems.filter(
      (item) => item.color && item.color.includes(color)
    );

  if (stones != "") {
    if (stones == "OTHER") {
      filteredItems = filteredItems.filter(
        (item) =>
          item.description &&
          !item.description.includes("diamond") &&
          !item.description.includes("emerald") &&
          !item.description.includes("onyx")
      );
    } else {
      filteredItems = filteredItems.filter(
        (item) => item.description && item.description.includes(stones)
      );
    }
  }

  return filteredItems;
};

module.exports = { searchItems };
