import $ from 'jquery';
import _ from 'lodash';
import solve from 'jsLPSolver';
import './helpers';
import Store from './store';
import Model from './model';
import View from './view';
import Controller from './controller';
import Template from './template';

$(() => {
  /**
   * Sets up a brand new Recipe ingredients list.
   *
   * @param {string} name The name of your new list.
   */
  class Recipe {
    constructor(name) {
      this.storage = new Store(name);
      this.model = new Model(this.storage);
      this.template = new Template();
      this.view = new View(this.template);
      this.controller = new Controller(this.model, this.view);
    }
    
    setView () {
      this.controller.setView(document.location.hash);
    }
  }
  
  var recipe = new Recipe('recipe');

  recipe.setView();

  $(window).on('hashchange', recipe.setView);
});


var ingredients = {
       masa_harina: {
           "_id": "53682187440bbc02004f3a24", "amount": 280, "biotin": 0, "calcium": 0.141, "calories": 365, "carbs": 76.29, "chloride": 0, "cholesterol": 0, "choline": 8.6, "chromium": 0, "container_size": 2720, "copper": 0.18, "fat": 3.86, "fiber": 6.7, "folate": 29, "form": "Powder", "insoluble-fiber": 0, "iodine": 0, "iron": 7.2, "item_cost": 19.75, "maganese": 0.5, "magnesium": 110, "molybdenum": 0, "monounsaturated-fat": 0, "name": "Masa harina", "niacin": 0, "omega_3": 0.052, "omega_6": 1.672, "panthothenic": 0.7, "persistedAsin": "B001HTIT9C", "phosphorus": 0.223, "polyunsaturated-fat": 0, "potassium": 0.298, "protein": 9.3, "riboflavin": 0.097, "saturated-fat": 0.5, "selinium": 14, "serving": 100, "sodium": 0.03, "soluble-fiber": 0, "source": "Amazon", "sulfur": 0.364, "thiamin": 1.4, "unit": "g", "url": "https://www.amazon.com/dp/B001HTIT9C?tag=19-82341-20", "vitamin_a": 1000, "vitamin_b12": 0, "vitamin_b6": 0.475, "vitamin_c": 0, "vitamin_d": 0, "vitamin_e": 0, "vitamin_k": 0.3, "zinc": 1.8, "currency": "$", "asin": "B001HTIT9C", "volumeStr": "", "id": "53682187440bbc02004f3a24"
    },
       soy_protein_isolate: {
      "_id": "53681c72440bbc02004f3957", "amount": 65, "biotin": 0, "calcium": 0.1779, "calories": 340, "carbs": 9.5, "chloride": 0, "cholesterol": 0, "choline": 0, "chromium": 0, "container_size": 3172, "copper": 1.4286, "fat": 4.9, "fiber": 0, "folate": 176.1, "form": "Powder", "insoluble-fiber": 0, "iodine": 0, "iron": 14.6, "item_cost": 49.85, "maganese": 0, "magnesium": 38.9, "molybdenum": 0, "monounsaturated-fat": 0, "name": "Soy protein isolate", "niacin": 0, "omega_3": 0, "omega_6": 0, "panthothenic": 0, "persistedAsin": "B000EDG4EO", "phosphorus": 0.775, "polyunsaturated-fat": 0, "potassium": 1.6, "protein": 82, "riboflavin": 0, "saturated-fat": 0, "selinium": 0, "serving": 100, "sodium": 1.1, "soluble-fiber": 0, "source": "Amazon", "sulfur": 0, "thiamin": 0, "unit": "g", "url": "https://www.amazon.com/dp/B000EDG4EO?tag=19-82341-20", "vitamin_a": 0, "vitamin_b12": 0, "vitamin_b6": 0, "vitamin_c": 0, "vitamin_d": 0, "vitamin_e": 0, "vitamin_k": 0, "zinc": 0, "currency": "$", "asin": "B000EDG4EO", "volumeStr": "", "id": "53681c72440bbc02004f3957"
    },
       extra_virgin_olive_oil: {
      "_id": "536840e9440bbc02004f3dda", "amount": 60, "biotin": 0, "calcium": 0.001, "calories": 884, "carbs": 0, "chloride": 0, "cholesterol": 0, "choline": 0.3, "chromium": 0, "container_size": 907, "copper": 0, "fat": 100, "fiber": 0, "folate": 0, "form": "Liquid", "insoluble-fiber": 0, "iodine": 0, "iron": 0.56, "item_cost": 17.54, "maganese": 0, "magnesium": 0, "molybdenum": 0, "monounsaturated-fat": 72.961, "name": "Extra Virgin Olive Oil", "niacin": 0, "omega_3": 0.761, "omega_6": 9.762, "panthothenic": 0, "persistedAsin": "B0006Z7NPO", "phosphorus": 0, "polyunsaturated-fat": 10.523, "potassium": 0.001, "protein": 0, "riboflavin": 0, "saturated-fat": 13.808, "selinium": 0, "serving": 108.93, "sodium": 0.002, "soluble-fiber": 0, "source": "Amazon", "sulfur": 0, "thiamin": 0, "unit": "ml", "url": "https://www.amazon.com/dp/B0006Z7NPO?tag=19-82341-20", "vitamin_a": 0, "vitamin_b12": 0, "vitamin_b6": 0, "vitamin_c": 0, "vitamin_d": 0, "vitamin_e": 14.35, "vitamin_k": 60.2, "zinc": 0, "currency": "$", "asin": "B0006Z7NPO", "volumeStr": "", "id": "536840e9440bbc02004f3dda"
    },
       chia_seeds: {
      "_id": "53692e63ae8f5a020082df1d", "amount": 40, "biotin": 0, "calcium": 0.179, "calories": 137, "carbs": 12.3, "chloride": 0, "cholesterol": 0, "choline": 0, "chromium": 0, "container_size": 1812, "copper": 0.262, "fat": 8.71, "fiber": 9.8, "folate": 14, "form": "Powder", "insoluble-fiber": 7.95, "iodine": 0, "iron": 0.00219, "item_cost": 29.99, "maganese": 0.772, "magnesium": 0.095, "molybdenum": 0, "monounsaturated-fat": 0.655, "name": "Chia Seeds", "niacin": 0.2503, "omega_3": 4.915, "omega_6": 1.62, "panthothenic": 0, "persistedAsin": "B003LPKEPC", "phosphorus": 0.244, "polyunsaturated-fat": 6.7, "potassium": 0.115, "protein": 4.69, "riboflavin": 0.048, "saturated-fat": 0.944, "selinium": 15.6, "serving": 28, "sodium": 0.005, "soluble-fiber": 2.65, "source": "Amazon", "sulfur": 0, "thiamin": 0.176, "unit": "g", "url": "https://www.amazon.com/dp/B003LPKEPC?tag=19-82341-20", "vitamin_a": 15, "vitamin_b12": 0, "vitamin_b6": 0, "vitamin_c": 0.5, "vitamin_d": 0, "vitamin_e": 15.5, "vitamin_k": 0, "volume": null, "volume_unit": "cup", "zinc": 1.3, "currency": "$", "asin": "B003LPKEPC", "volumeStr": "", "id": "53692e63ae8f5a020082df1d"
    },
       oat_flour: {
      "_id": "53688fca440bbc02004f444c", "amount": 20, "biotin": 0, "calcium": 0.055, "calories": 404, "carbs": 66, "chloride": 0, "cholesterol": 0, "choline": 29.9, "chromium": 0, "container_size": 2492, "copper": 0.4, "fat": 9.1, "fiber": 6.5, "folate": 32, "form": "Powder", "insoluble-fiber": 3.5, "iodine": 0, "iron": 4, "item_cost": 19.77, "maganese": 4, "magnesium": 144, "molybdenum": 200, "monounsaturated-fat": 2.9, "name": "Oat Flour/Powder", "niacin": 1.5, "omega_3": 0.145, "omega_6": 3.185, "panthothenic": 0.2, "persistedAsin": "B004VLVBUM", "phosphorus": 0.453, "polyunsaturated-fat": 3.3, "potassium": 0.371, "protein": 15, "riboflavin": 0.1, "saturated-fat": 1.6, "selinium": 34, "serving": 100, "sodium": 0.019, "soluble-fiber": 3, "source": "Amazon", "sulfur": 0.23, "thiamin": 0.7, "unit": "g", "url": "https://www.amazon.com/dp/B004VLVBUM?tag=19-82341-20", "vitamin_a": 0, "vitamin_b12": 0, "vitamin_b6": 0.1, "vitamin_c": 0, "vitamin_d": 0, "vitamin_e": 1, "vitamin_k": 3.2, "zinc": 3.2, "currency": "$", "asin": "B004VLVBUM", "volumeStr": "", "id": "53688fca440bbc02004f444c"
    },
       aor_ortho_core: {
      "_id": "536926d76a57040200e29f34", "amount": 5, "biotin": 50, "calcium": 0.05, "calories": 0, "carbs": 0, "chloride": 0, "cholesterol": 0, "choline": 16.7, "chromium": 16.7, "container_size": 180, "copper": 0.25, "fat": 0, "fiber": 0, "folate": 133, "form": "Pill", "insoluble-fiber": 0, "iodine": 25, "iron": 0, "item_cost": 54, "maganese": 0.383, "magnesium": 35, "molybdenum": 7.5, "monounsaturated-fat": 0, "name": "AOR Ortho Core", "niacin": 19, "omega_3": 0, "omega_6": 0, "panthothenic": 16.7, "persistedAsin": "B0018KKOQG", "phosphorus": 0, "polyunsaturated-fat": 0, "potassium": 0.0083, "protein": 0, "riboflavin": 0.416, "saturated-fat": 0, "selinium": 9.16, "serving": 1, "sodium": 0, "soluble-fiber": 0, "source": "Amazon", "sulfur": 0, "thiamin": 1.5, "unit": "pill", "url": "https://www.amazon.com/dp/B0018KKOQG?tag=19-82341-20", "vitamin_a": 118.5, "vitamin_b12": 108, "vitamin_b6": 16.7, "vitamin_c": 20, "vitamin_d": 166, "vitamin_e": 1.8, "vitamin_k": 20, "volume": null, "volume_unit": "capsule", "zinc": 1.8, "currency": "$", "asin": "B0018KKOQG", "volumeStr": "", "id": "536926d76a57040200e29f34"
    },
       salt: {
      "_id": "53688a2d440bbc02004f441f", "amount": 3, "biotin": 0, "calcium": 0, "calories": 0, "carbs": 0, "chloride": 1.2, "cholesterol": 0, "choline": 0, "chromium": 0, "container_size": 907, "copper": 0, "fat": 0, "fiber": 0, "folate": 0, "form": "Powder", "insoluble-fiber": 0, "iodine": 94, "iron": 0, "item_cost": 8.75, "maganese": 0, "magnesium": 0, "molybdenum": 0, "monounsaturated-fat": 0, "name": "Iodised Salt", "niacin": 0, "omega_3": 0, "omega_6": 0, "panthothenic": 0, "persistedAsin": "B005MER0RA", "phosphorus": 0, "polyunsaturated-fat": 0, "potassium": 0, "protein": 0, "riboflavin": 0, "saturated-fat": 0, "selinium": 0, "serving": 2, "sodium": 0.8, "soluble-fiber": 0, "source": "Amazon", "sulfur": 0, "thiamin": 0, "unit": "g", "url": "https://www.amazon.com/dp/B005MER0RA?tag=19-82341-20", "vitamin_a": 0, "vitamin_b12": 0, "vitamin_b6": 0, "vitamin_c": 0, "vitamin_d": 0, "vitamin_e": 0, "vitamin_k": 0, "zinc": 0, "currency": "$", "asin": "B005MER0RA", "volumeStr": "", "id": "53688a2d440bbc02004f441f"
    },
       potassium_cloride: {
      "_id": "536884c0440bbc02004f43f5", "amount": 3, "biotin": 0, "calcium": 0, "calories": 0, "carbs": 0, "chloride": 0.476, "cholesterol": 0, "choline": 0, "chromium": 0, "container_size": 227, "copper": 0, "fat": 0, "fiber": 0, "folate": 0, "form": "Powder", "insoluble-fiber": 0, "iodine": 0, "iron": 0, "item_cost": 6.81, "maganese": 0, "magnesium": 0, "molybdenum": 0, "monounsaturated-fat": 0, "name": "Potassium chloride", "niacin": 0, "omega_3": 0, "omega_6": 0, "panthothenic": 0, "persistedAsin": "B001F0QW42", "phosphorus": 0, "polyunsaturated-fat": 0, "potassium": 0.52, "protein": 0, "riboflavin": 0, "saturated-fat": 0, "selinium": 0, "serving": 1, "sodium": 0, "soluble-fiber": 0, "source": "Amazon", "sulfur": 0, "thiamin": 0, "unit": "g", "url": "https://www.amazon.com/dp/B001F0QW42?tag=19-82341-20", "vitamin_a": 0, "vitamin_b12": 0, "vitamin_b6": 0, "vitamin_c": 0, "vitamin_d": 0, "vitamin_e": 0, "vitamin_k": 0, "zinc": 0, "currency": "$", "asin": "B001F0QW42", "volumeStr": "", "id": "536884c0440bbc02004f43f5"
    },
    choline_bitartrate: {
      "_id": "5367c47f2bb70202007eb978", "amount": 2, "biotin": 0, "calcium": 0, "calories": 0, "carbs": 0, "chloride": 0, "cholesterol": 0, "choline": 410, "chromium": 0, "container_size": 500, "copper": 0, "fat": 0, "fiber": 0, "folate": 0, "form": "Powder", "insoluble-fiber": 0, "iodine": 0, "iron": 0, "item_cost": 4.99, "maganese": 0, "magnesium": 0, "molybdenum": 0, "monounsaturated-fat": 0, "name": "Choline bitartrate", "niacin": 0, "omega_3": 0, "omega_6": 0, "panthothenic": 0, "persistedAsin": "B003VZT21Y", "phosphorus": 0, "polyunsaturated-fat": 0, "potassium": 0, "protein": 0, "riboflavin": 0, "saturated-fat": 0, "selinium": 0, "serving": 1, "sodium": 0, "soluble-fiber": 0, "source": "Amazon", "sulfur": 0, "thiamin": 0, "unit": "g", "url": "https://www.amazon.com/dp/B003VZT21Y?tag=19-82341-20", "vitamin_a": 0, "vitamin_b12": 0, "vitamin_b6": 0, "vitamin_c": 0, "vitamin_d": 0, "vitamin_e": 0, "vitamin_k": 0, "zinc": 0, "currency": "$", "asin": "B003VZT21Y", "volumeStr": "", "id": "5367c47f2bb70202007eb978"
    },
    sulfur_powder: {
      "_id": "5367f0f02bb70202007ebeae", "amount": 2, "biotin": 0, "calcium": 0, "calories": 0, "carbs": 0, "chloride": 0, "cholesterol": 0, "choline": 0, "chromium": 0, "container_size": 454, "copper": 0, "fat": 0, "fiber": 0, "folate": 0, "form": "Powder", "insoluble-fiber": 0, "iodine": 0, "iron": 0, "item_cost": 16.2, "maganese": 0, "magnesium": 0, "molybdenum": 0, "monounsaturated-fat": 0, "name": "Jarrow Formulas, MSM Sulfur Powder", "niacin": 0, "omega_3": 0, "omega_6": 0, "panthothenic": 0, "persistedAsin": "B0013OULBU", "phosphorus": 0, "polyunsaturated-fat": 0, "potassium": 0, "protein": 0, "riboflavin": 0, "saturated-fat": 0, "selinium": 0, "serving": 1, "sodium": 0, "soluble-fiber": 0, "source": "Amazon", "sulfur": 1, "thiamin": 0, "unit": "g", "url": "https://www.amazon.com/dp/B0013OULBU?tag=19-82341-20", "vitamin_a": 0, "vitamin_b12": 0, "vitamin_b6": 0, "vitamin_c": 0, "vitamin_d": 0, "vitamin_e": 0, "vitamin_k": 0, "zinc": 0, "currency": "$", "asin": "B0013OULBU", "volumeStr": "", "id": "5367f0f02bb70202007ebeae"
    }
};

var solver = new Solver,
    results,
    model = {
      optimize: "item_cost",
      opType: "min",
      constraints: {
        "zinc": {max:40, min:11},
        "vitamin_k": {min: 120},
        "vitamin_e": {max:1000, min:20},
        "vitamin_d": {max:4000, min:600},
        "vitamin_c": {max:2000, min:90},
        "vitamin_b6": {max:100, min:1.3},
        "vitamin_b12": {min:2.4},
        "vitamin_a": {max:10000, min:3000},
        "thiamin": {min:1.2},
        "sulfur": {min:2},
        // "soluble-fiber": {max:0, min:0},
        "sodium": {max:2.3, min:1.5},
        "selinium": {max:400, min:55},
        // "saturated-fat": {max:0, min:0},
        "riboflavin": {min:1.3},
        "protein": {min:85, max: 95},
        "potassium": {min:3.5},
        // "polyunsaturated-fat": {max:0, min:0},
        "phosphorus": {max:4, min:0.7},
        "panthothenic": {min:5},
        // //"omega_6": {max:0, min:2},
        // //"omega_3": {max:0, min:1},
        // //"niacin": {max:35, min:16},
        // "monounsaturated-fat": {max:0, min:0},
        "molybdenum": {max:2000, min:45},
        "magnesium": {min:420},
        "maganese": {max:11, min:2.3},
        "iron": {max:25, min:8},
        "iodine": {max:1100, min:150},
        // "insoluble-fiber": {max:0, min:0},
        "folate": {max:1000, min:400},
        "fiber": {min:28},
        "fat": {min:75, max: 85},
        "copper": {max:10, min:0.9},
        "chromium": {min:35},
        "choline": {max:3500, min:550},
        // "cholesterol": {max:0, min:0},
        "chloride": {max:3.6, min:2.3},
        "carbs": {min:225, max:275},
        "calories": {min: 1980, max:2020},
        "calcium": {max:2.5, min:1},
        "biotin": {min:30}
      },
      variables: ingredients,
      ints: {
        aor_ortho_core: 1,
        choline_bitartrate: 1
      }
    };

var isNumeric = function (n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
};

results = solver.Solve(model);

var quantities = Object.keys(results).reduce((memo, result) => {
  if (result in ingredients) {
    memo[result] = {
      amount: ingredients[result].serving * results[result],
      //calories: ingredients[result].calories * results[result]
    };
  }
  return memo;
}, {});

console.log(quantities);
