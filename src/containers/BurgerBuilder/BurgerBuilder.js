import React, { Component } from "react";
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

class BurgerBuilder extends Component {
  // constructor(props) {
  //     super(props);
  //     this.state = {...}
  // }
  state = {
    purchasing: false,
  };

  componentDidMount() {
    this.props.fetchIngredients();
  }

  updatePurchaseState(ingredients) {
    const sum = Object.keys(ingredients)
      .map((igKey) => {
        return ingredients[igKey];
      })
      .reduce((sum, el) => {
        return sum + el;
      }, 0);
    return sum > 0;
  }

  purchaseHandler = () => {
    this.setState({ purchasing: true });
  };

  purchaseCancelHandler = () => {
    this.setState({ purchasing: false });
  };

  purchaseContinueHandler = () => {
    this.props.initPurchase();
    this.props.history.push("/checkout");
  };

  render() {
    const disabledInfo = {
      ...this.props.ingrds,
    };
    for (let key in disabledInfo) {
      disabledInfo[key] = disabledInfo[key] <= 0;
    }
    let orderSummary = null;
    let burger = this.props.error ? (
      <p>Ingredients can't be loaded!</p>
    ) : (
      <Spinner />
    );

    if (this.props.ingrds) {
      burger = (
        <Auxilary>
          <Burger ingredients={this.props.ingrds} />
          <BuildControls
            ingredientAdded={this.props.ingredientAdd}
            ingredientRemoved={this.props.ingredientRemove}
            disabled={disabledInfo}
            purchasable={this.updatePurchaseState(this.props.ingrds)}
            ordered={this.purchaseHandler}
            price={this.props.price}
          />
        </Auxilary>
      );
      orderSummary = (
        <OrderSummary
          ingredients={this.props.ingrds}
          price={this.props.price}
          purchaseCancelled={this.purchaseCancelHandler}
          purchaseContinued={this.purchaseContinueHandler}
        />
      );
    }
    // {salad: true, meat: false, ...}
    return (
      <Auxilary>
        <Modal
          show={this.state.purchasing}
          modalClosed={this.purchaseCancelHandler}
        >
          {orderSummary}
        </Modal>
        {burger}
      </Auxilary>
    );
  }
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
