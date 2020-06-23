// A global USER_CHOICES variable that is updated after every message is handled.
var USER_CHOICES = {
  ITEM: "",
  PRICE: "",
  MATERIAL: "",
  METAL: "",
};

/**
 * Adds a choice to the global variable USER_CHOICES.
 *
 * @param {String} category One of the keys in USER_CHOICES.
 * @param {String} value The payload value for this category.
 */
const addChoice = (category, value) => {
  USER_CHOICES[category] = value;
};

const nextChoice = () => {
  for (const [category, value] of Object.entries(USER_CHOICES)) {
    if (value == "") return category;
  }

  return "FINISHED";
};

module.exports = { addChoice, nextChoice, USER_CHOICES };
