import * as actionTypes from "./actionTypes";
import axios from "../../axios-orders";

export const purchaseSuccess = (id, data) => {
  return {
    type: actionTypes.PURCHASE_SUCCESS,
    orderId: id,
    orderData: data,
  };
};

export const purchaseFail = (error) => {
  return {
    type: actionTypes.PURCHASE_FAIL,
    error: error,
  };
};

export const purchaseStart = () => {
  return {
    type: actionTypes.PURCHASE_START,
  };
};

export const purchase = (data) => {
  return (dispatch) => {
    dispatch(purchaseStart());
    axios
      .post("/orders.json", data)
      .then((response) => {
        dispatch(purchaseSuccess(response.data.name, data));
      })
      .catch((error) => {
        dispatch(purchaseFail(error));
      });
  };
};

export const purchaseInit = () => {
  return {
    type: actionTypes.PURCHASE_INIT,
  };
};
