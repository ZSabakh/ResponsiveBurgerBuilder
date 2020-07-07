import * as actionTypes from "./actionTypes";
import axios from "../../axios-orders";

export const addIngredient = (ingName) => {
  return {
    type: actionTypes.ADD_INGREDIENT,
    ingredient: ingName,
  };
};

export const removeIngredient = (ingName) => {
  return {
    type: actionTypes.REMOVE_INGREDIENT,
    ingredient: ingName,
  };
};

export const setIngredients = (ingredients) => {
  return {
    type: actionTypes.SET_INGREDIENTS,
    ingredients: ingredients,
  };
};

export const setIngredientsFailed = () => {
  return {
    type: actionTypes.SET_INGREDIENTS_FAILED,
  };
};

export const fetchIngredients = () => {
  return (dispatch) => {
    axios
      .get("https://bbuilderreact.firebaseio.com/ingredients.json")
      .then((response) => {
        dispatch(setIngredients(response.data));
      })
      .catch((error) => {
        dispatch(setIngredientsFailed());
      });
  };
};
