import * as actionTypes from "../actions/actionTypes";
import { updateObject } from "../utility";

const initialState = {
  ingredients: null,
  totalPrice: 4,
  error: false,
};

const INGREDIENT_PRICES = {
  salad: 0.5,
  cheese: 0.4,
  meat: 1.3,
  bacon: 0.7,
};

const addIngredient = (state, action) => {
  const newIngredient = {
    [action.ingredient]: state.ingredients[action.ingredient] + 1,
  };
  const newIngredients = updateObject(state.ingredients, newIngredient);
  const newState = {
    ingredients: newIngredients,
    totalPrice: state.totalPrice + INGREDIENT_PRICES[action.ingredient],
  };
  return updateObject(state, newState);
};

const removeIngredient = (state, action) => {
  const newIngredient1 = {
    [action.ingredient]: state.ingredients[action.ingredient] - 1,
  };
  const newIngredients1 = updateObject(state.ingredients, newIngredient1);
  const newState1 = {
    ingredients: newIngredients1,
    totalPrice: state.totalPrice + INGREDIENT_PRICES[action.ingredient],
  };
  return updateObject(state, newState1);
};

const setIngredients = (state, action) => {
  return updateObject(state, {
    ingredients: action.ingredients,
    totalPrice: 4,
    error: false,
  });
};

const setIngredientsFailed = (state, action) => {
  return updateObject(state, { error: true });
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.ADD_INGREDIENT:
      return addIngredient(state, action);

    case actionTypes.REMOVE_INGREDIENT:
      return removeIngredient(state, action);

    case actionTypes.SET_INGREDIENTS:
      return setIngredients(state, action);

    case actionTypes.SET_INGREDIENTS_FAILED:
      return setIngredientsFailed(state, action);
    default:
      return state;
  }
};

export default reducer;
