import React from 'react';
import Auxilary from '../../../hoc/Auxilary';
import Button from '../../UI/Button/Button';

const orderSummary = (props) => {
    const ingredientSummary = Object.keys(props.ingredients)
        .map(igKey => {
            return (<li key={igKey}><span style={{textTransform: 'capitalize'}}>{igKey}</span>: {props.ingredients[igKey]}</li>)
        })


    return(
        <Auxilary>
            <h3>Order</h3>
            <p>Burger with ingredients: </p>
            <ul>
                {ingredientSummary}
            </ul>
    <p>Price: <strong>{props.price.toFixed(2)}$</strong></p>
            <p>Checkout</p>
            <Button clicked={props.purchaseCancelled} btnType="Danger">CANCEL</Button>
            <Button clicked={props.purchaseContinued} btnType="Success">CONTINUE</Button>
        </Auxilary>
    );
};

export default orderSummary;