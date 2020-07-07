import React, { Component } from "react";
import Button from "../../../components/UI/Button/Button";
import Spinner from "../../../components/UI/Spinner/Spinner";
import classes from "./ContactData.css";
import axios from "../../../axios-orders";
import { connect } from "react-redux";
import Input from "../../../components/UI/Input/Input";
import withErrorHandler from "../../../hoc/withErrorHandler/withErrorHandler";
import * as actions from "../../../store/actions/index";

class ContactData extends Component {
  state = {
    orderForm: {
      name: {
        elementType: "input",
        elementConfig: {
          type: "text",
          placeholder: "Your Name",
        },
        value: "",
        validation: {
          required: true,
        },
        valid: false,
        touched: false,
      },
      street: {
        elementType: "input",
        elementConfig: {
          type: "text",
          placeholder: "Street",
        },
        value: "",
        validation: {
          required: true,
        },
        valid: false,
        touched: false,
      },
      zipCode: {
        elementType: "input",
        elementConfig: {
          type: "text",
          placeholder: "ZIP",
        },
        value: "",
        validation: {
          required: true,
          minLength: 5,
          maxLength: 5,
        },
        valid: false,
        touched: false,
      },
      country: {
        elementType: "input",
        elementConfig: {
          type: "text",
          placeholder: "Country",
        },
        value: "",
        validation: {
          required: true,
        },
        valid: false,
        touched: false,
      },
      email: {
        elementType: "input",
        elementConfig: {
          type: "email",
          placeholder: "Your email",
        },
        value: "",
        validation: {
          required: true,
        },
        valid: false,
        touched: false,
      },
      deliveryMethod: {
        elementType: "select",
        elementConfig: {
          options: [
            { value: "fastest", displayValue: "Fastest" },
            { value: "cheapest", displayValue: "Cheapest" },
          ],
        },
        valid: true,
        validation: {},
        value: "fastest",
      },
    },
    formIsValid: false,
  };

  checkValid(value, rules) {
    let isValid = true;
    if (!rules) {
      return true;
    }

    if (rules.required) {
      isValid = value.trim() !== "" && isValid;
    }

    if (rules.minLength) {
      isValid = value.length >= rules.minLength && isValid;
    }

    if (rules.maxLength) {
      isValid = value.length <= rules.maxLength && isValid;
    }

    return isValid;
  }

  orderHandler = (event) => {
    event.preventDefault();

    const formData = {};
    for (let formElementIdentify in this.state.orderForm) {
      formData[formElementIdentify] = this.state.orderForm[
        formElementIdentify
      ].value;
    }

    const order = {
      ingredients: this.props.ingrds,
      price: this.props.price,
      orderData: formData,
    };

    this.props.orderBurger(order);
  };

  inputChangedHandler = (event, inputIdentify) => {
    const newOrderForm = {
      ...this.state.orderForm,
    };
    const newFormElement = {
      ...newOrderForm[inputIdentify],
    };
    newFormElement.value = event.target.value;
    newFormElement.valid = this.checkValid(
      newFormElement.value,
      newFormElement.validation
    );
    newOrderForm[inputIdentify] = newFormElement;
    newFormElement.touched = true;
    console.log(newFormElement);

    let formIsValid = true;
    for (let inputIdentify in newOrderForm) {
      formIsValid = newOrderForm[inputIdentify].valid && formIsValid;
    }
    this.setState({ orderForm: newOrderForm, formIsValid: formIsValid });
  };

  render() {
    const formArray = [];
    for (let key in this.state.orderForm) {
      formArray.push({
        id: key,
        config: this.state.orderForm[key],
      });
    }

    let form = (
      <form onSubmit={this.orderHandler}>
        {formArray.map((formElement) => (
          <Input
            shouldValidate={formElement.config.validation}
            invalid={!formElement.config.valid}
            key={formElement.id}
            elementType={formElement.config.elementType}
            elementConfig={formElement.config.elementConfig}
            value={formElement.config.value}
            change={(event) => this.inputChangedHandler(event, formElement.id)}
            touched={formElement.config.touched}
          />
        ))}
        <Button btnType="Success" disabled={!this.state.formIsValid}>
          ORDER
        </Button>
      </form>
    );
    if (this.props.loading) {
      form = <Spinner />;
    }
    return (
      <div className={classes.ContactData}>
        <h4>Enter your Contact Data</h4>
        {form}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    ingrds: state.burger.ingredients,
    price: state.burger.totalPrice,
    loading: state.order.loading,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    orderBurger: (orderData) => dispatch(actions.purchase(orderData)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withErrorHandler(ContactData, axios));
