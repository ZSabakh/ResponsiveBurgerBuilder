import React, { useState, useEffect } from 'react';
import Auxilary from '../../hoc/Auxilary/Auxilary';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls'
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary'
import axios from '../../axios-orders';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';

const INGREDIENT_PRICES = {
    salad: 0.5,
    cheese: 0.4,
    meat: 1.3,
    bacon: 0.7
}

function BurgerBuilder(props) {


    const [ingredients, setIngredients] = useState({})
    const [totalPrice, setTotalPrice] = useState(0)
    const [purchasable, setPurchasable] = useState(false)
    const [purchasing, setPurchasing] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(false)

    useEffect(() => {        axios.get('https://bbuilderreact.firebaseio.com/ingredients.json')
    .then(response => response)
    .then(({data: ingredients}) => {
        setIngredients(ingredients)
        console.log(ingredients)
        
    })
    .catch(error => {
        setError(false)
    })}, []);

    function updatePurchaseState (ingredients) {
        const sum = Object.keys(ingredients)
            .map(igKey => {
                return ingredients[igKey];
            })
            .reduce((sum, el) => {
               return sum + el; 
            }, 0);
        setPurchasable(sum > 0)
    }

    const addIngredientHandler = (type) => {
        const oldCount = ingredients[type];
        const updatedCount = oldCount + 1;
        const updatedIngredients = {
            ...ingredients
        };
        updatedIngredients[type] = updatedCount;
        const priceAddition = INGREDIENT_PRICES[type];
        const oldPrice = totalPrice;
        const newPrice = oldPrice + priceAddition;
        setTotalPrice(newPrice)
        setIngredients(updatedIngredients)
        updatePurchaseState(updatedIngredients);
    }

    const removeIngredientHandler = (type) => {
        const oldCount = ingredients[type];
        if (oldCount <= 0) {
            return;
        }
        const updatedCount = oldCount - 1;
        const updatedIngredients = {
            ...ingredients
        };
        updatedIngredients[type] = updatedCount;
        const priceDeduction = INGREDIENT_PRICES[type];
        const oldPrice = this.state.totalPrice;
        const newPrice = oldPrice - priceDeduction;
        setTotalPrice(newPrice)
        setIngredients({updatedIngredients})
        this.updatePurchaseState(updatedIngredients);
    }

    const purchaseHandler = () => {
        setPurchasing(true)
    }

    const purchaseCancelHandler = () => {
        setPurchasing(false)
    }

    const purchaseContinueHandler = () => {
        
        const queryParams = [];
        for (let i in ingredients) {
            queryParams.push(encodeURIComponent(i) + '=' + encodeURIComponent(ingredients[i]));
        }
        queryParams.push('price=' + totalPrice)
        const queryString = queryParams.join('&');
        props.history.push({
            pathname: '/checkout',
            search: '?' + queryString
        });
    }

        const disabledInfo = {
            ...ingredients
        };
        for(let key in disabledInfo) {
            disabledInfo[key] = disabledInfo[key] <= 0;
        }
        let orderSummary = null;
        if (ingredients){
        orderSummary =<OrderSummary 
        price={totalPrice}
        purchaseCancelled={purchaseCancelHandler}
        purchaseContinued={purchaseContinueHandler}
        ingredients={ingredients}/>
        }


        let burger = error ? <p>Can't be laoded</p> : <Spinner />

        if (ingredients){
        burger = (
        <Auxilary>
        <Burger ingredients={ingredients}/>
        <BuildControls
        ingredientAdded={addIngredientHandler}
        ingredientRemoved={removeIngredientHandler}
        disabled={disabledInfo}
        purchasable={purchasable}
        price={totalPrice}
        ordered={purchaseHandler}
        />
        </Auxilary>)
        }

        if (loading) {
            orderSummary = <Spinner />;
        }

        return (
            <Auxilary>
                <Modal show={purchasing} modalClosed={purchaseCancelHandler}>
                {orderSummary}
                </Modal>
                {burger}
            </Auxilary>
        );
    
}

export default withErrorHandler(BurgerBuilder, axios);