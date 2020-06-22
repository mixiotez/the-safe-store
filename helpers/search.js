const data = require("../cartier_catalog.json");

const searchItems = (category="", maxPrice="", color="", stones="") => {
  let filteredItems = data;

  maxPrice = parseInt(maxPrice, 10);

  console.log(filteredItems.length);

  if (category != "")
    filteredItems = filteredItems.filter((item) => item.category.includes(category));

  console.log(filteredItems[0]);

  if (maxPrice != "") {
    filteredItems = filteredItems.filter(
      (item) => (item.price <= maxPrice)
    );
  }

  console.log("bello" + filteredItems.length);

  if (color != "")
    filteredItems = filteredItems.filter(
      (item) => item.color && item.color.includes(color)
    );

  console.log(filteredItems.length);

  if (stones != ""){ 
    if (stones == "OTHER"){
      filteredItems = filteredItems.filter(
        (item) => item.description && (!item.description.includes("diamond") && !item.description.includes("emerald") && !item.description.includes("onyx"))
      );
    }
    else {
      filteredItems = filteredItems.filter(
        (item) => item.description && item.description.includes(stones)
      );
    }
  }

  console.log(filteredItems.length);

  return filteredItems;
};

module.exports = { searchItems };
