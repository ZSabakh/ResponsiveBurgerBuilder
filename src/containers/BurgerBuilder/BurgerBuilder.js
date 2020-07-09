import React, { useState, useEffect } from "react";
import * as burgerActions from "../../store/actions/index";
import Auxilary from "../../hoc/Auxilary/Auxilary";
import Burger from "../../components/Burger/Burger";
import BuildControls from "../../components/Burger/BuildControls/BuildControls";
import Modal from "../../components/UI/Modal/Modal";
import OrderSummary from "../../components/Burger/OrderSummary/OrderSummary";
import Spinner from "../../components/UI/Spinner/Spinner";
import withErrorHandler from "../../hoc/withErrorHandler/withErrorHandler";
import axios from "../../axios-orders";
import { connect } from "react-redux";

function BurgerBuilder(props) {
  // constructor(props) {
  //     super(props);
  //     state = {...}
  // }

  const [purchasing, setPurchasing] = useState(false);

  useEffect(() => {
    props.fetchIngredients();
  }, []);

  function updatePurchaseState(ingredients) {
    const sum = Object.keys(ingredients)
      .map((igKey) => {
        return ingredients[igKey];
      })
      .reduce((sum, el) => {
        return sum + el;
      }, 0);
    return sum > 0;
  }

  const purchaseHandler = () => {
    setPurchasing(true);
  };

  const purchaseCancelHandler = () => {
    setPurchasing(false);
  };

  const purchaseContinueHandler = () => {
    props.initPurchase();
    props.history.push("/checkout");
  };

  const disabledInfo = {
    ...props.ingrds,
  };
  for (let key in disabledInfo) {
    disabledInfo[key] = disabledInfo[key] <= 0;
  }
  let orderSummary = null;
  let burger = props.error ? <p>Ingredients can't be loaded!</p> : <Spinner />;

  if (props.ingrds) {
    burger = (
      <Auxilary>
        <Burger ingredients={props.ingrds} />
        <BuildControls
          ingredientAdded={props.ingredientAdd}
          ingredientRemoved={props.ingredientRemove}
          disabled={disabledInfo}
          purchasable={updatePurchaseState(props.ingrds)}
          ordered={purchaseHandler}
          price={props.price}
        />
      </Auxilary>
    );
    orderSummary = (
      <OrderSummary
        ingredients={props.ingrds}
        price={props.price}
        purchaseCancelled={purchaseCancelHandler}
        purchaseContinued={purchaseContinueHandler}
      />
    );
  }
  // {salad: true, meat: false, ...}
  return (
    <Auxilary>
      <Modal show={purchasing} modalClosed={purchaseCancelHandler}>
        {orderSummary}
      </Modal>
      {burger}
    </Auxilary>
  );
}

const mapStateToProps = (state) => {
  return {
    ingrds: state.burger.ingredients,
    price: state.burger.totalPrice,
    error: state.burger.error,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    ingredientAdd: (ingred) => dispatch(burgerActions.addIngredient(ingred)),
    ingredientRemove: (ingred) =>
      dispatch(burgerActions.removeIngredient(ingred)),
    fetchIngredients: () => dispatch(burgerActions.fetchIngredients()),
    initPurchase: () => dispatch(burgerActions.purchaseInit()),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withErrorHandler(BurgerBuilder, axios));
