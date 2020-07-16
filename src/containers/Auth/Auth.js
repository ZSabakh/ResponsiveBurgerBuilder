import React, { useState, useEffect } from "react";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import Input from "../../components/UI/Input/Input";
import Button from "../../components/UI/Button/Button";
import classes from "./Auth.css";
import * as actions from "../../store/actions/index";
import Spinner from "../../components/UI/Spinner/Spinner";

function Auth(props) {
  const [controls, setControls] = useState({
    email: {
      elementType: "input",
      elementConfig: {
        type: "email",
        placeholder: "Your Email",
      },
      value: "",
      validation: {
        required: true,
        isEmail: true,
      },
      valid: false,
      touched: false,
    },
    password: {
      elementType: "input",
      elementConfig: {
        type: "password",
        placeholder: "Password",
      },
      value: "",
      validation: {
        required: true,
        minLength: 6,
      },
      valid: false,
      touched: false,
    },
  });

  useEffect(() => {
    if (!props.building && props.redirectPath !== "/") {
      props.setRedirectPath();
    }
  }, []);

  const [signUp, setSignUp] = useState(true);

  function checkValid(value, rules) {
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

  const inputChangedHandler = (event, controlName) => {
    const newControls = {
      ...controls,
      [controlName]: {
        ...controls[controlName],
        value: event.target.value,
        valid: checkValid(event.target.value, controls[controlName].validation),
        touched: true,
      },
    };
    setControls(newControls);
  };

  const submitHandler = (event) => {
    event.preventDefault();
    props.Authorize(controls.email.value, controls.password.value, signUp);
  };

  const authModeHandler = () => {
    setSignUp(!signUp);
  };

  const formArray = [];
  for (let key in controls) {
    formArray.push({
      id: key,
      config: controls[key],
    });
  }

  let form = formArray.map((formElement) => (
    <Input
      key={formElement.id}
      shouldValidate={formElement.config.validation}
      invalid={!formElement.config.valid}
      elementType={formElement.config.elementType}
      elementConfig={formElement.config.elementConfig}
      value={formElement.config.value}
      change={(event) => inputChangedHandler(event, formElement.id)}
      touched={formElement.config.touched}
    />
  ));

  if (props.loading) {
    form = <Spinner />;
  }

  let errorMessage = null;

  if (props.error) {
    errorMessage = <p>{props.error.message}</p>;
  }

  return (
    <div className={classes.Auth}>
      {errorMessage}
      <form onSubmit={submitHandler}>
        {props.authenticated ? (
          <Redirect to={props.redirectPath}></Redirect>
        ) : null}
        {form}
        <Button btnType="Success">SUBMIT</Button>
      </form>
      <Button clicked={() => authModeHandler()} btnType="Danger">
        {signUp ? "SIGN IN" : "SIGN UP"}
      </Button>
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    loading: state.auth.loading,
    error: state.auth.error,
    authenticated: state.auth.token !== null,
    building: state.burger.building,
    redirectPath: state.auth.redirectPath,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    Authorize: (email, password, isSignup) =>
      dispatch(actions.auth(email, password, isSignup)),
    setRedirectPath: () => dispatch(actions.setRedirectPath("/")),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Auth);
