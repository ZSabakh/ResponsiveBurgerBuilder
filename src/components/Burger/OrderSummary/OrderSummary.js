import React, {Component} from 'react';
import Auxilary from '../../../hoc/Auxilary/Auxilary';
import Button from '../../UI/Button/Button';

class OrderSummary extends Component {
    componentWillUpdate() {
        console.log('[OrderSummary] WillUpdate');
    }

    render() {
        const ingredientSummary = Object.keys(this.props.ingredients)
        .map(igKey => {
            return (<li key={igKey}><span style={{textTransform: 'capitalize'}}>{igKey}</span>: {this.props.ingredients[igKey]}</li>)
        })

        return(
            <Auxilary>
            <h3>Order</h3>
            <p>Burger with ingredients: </p>
            <ul>
                {ingredientSummary}
            </ul>
            <p>Price: <strong>{this.props.price.toFixed(2)}$</strong></p>
            <p>Checkout</p>
            <Button clicked={this.props.purchaseCancelled} btnType="Danger">CANCEL</Button>
            <Button clicked={this.props.purchaseContinued} btnType="Success">CONTINUE</Button>
        </Auxilary>
        )
    }

} 
export default OrderSummary;