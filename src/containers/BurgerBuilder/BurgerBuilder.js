import React, { Component } from 'react'
import Aux from '../../hoc/Auxiliary/Auxiliary'
import Burger from '../../components/Burger/Burger'
import BuildControls from '../../components/Burger/BuildControls/BuildControls'
import Modal from '../../components/UI/Modal/Modal' 
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary'
import Spinner from '../../components/UI/Spinner/Spinner'
import axios from '../../axios-orders'
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler'


const INGREDIENT_PRICES = {
    salad: 0.5,
    bacon: 0.4,
    cheese: 1.3,
    meat: 0.7
};

class BurgerBuilder extends Component {

    state = {
        ingredients: null,
        totalPrice: 4,
        purchasable: false,
        purchasing: false,
        loading: false,
        error: false
    }

    componentDidMount() {
        axios.get('https://react-burger-builder-afc67.firebaseio.com/ingredients')
            .then(response => {
                this.setState({ingredients: response.data})
            })
            .catch(error => {
                this.setState({error: true})
            })
    }

    addIngredientHandler = (type) => {
        const oldCount = this.state.ingredients[type]
        const updatedCount = oldCount + 1
        const updatedIngredients = {
            ...this.state.ingredients
        }
        updatedIngredients[type] = updatedCount

        const oldPrice = this.state.totalPrice
        const priceAddition = INGREDIENT_PRICES[type]
        const newPrice = oldPrice + priceAddition

        this.setState({ingredients: updatedIngredients, totalPrice: newPrice})
        this.updatePurchasableState (updatedIngredients)
    }

    removeIngredientHandler = (type) => {
        const oldCount = this.state.ingredients[type]
        if (oldCount <= 0) return
        const updatedCount = oldCount - 1
        const updatedIngredients = {
            ...this.state.ingredients
        }
        updatedIngredients[type] = updatedCount

        const oldPrice = this.state.totalPrice
        const priceDeduction = INGREDIENT_PRICES[type]
        const newPrice = oldPrice - priceDeduction

        this.setState({ingredients: updatedIngredients, totalPrice: newPrice})
        this.updatePurchasableState (updatedIngredients)
    }

    updatePurchasableState (ingredients) {
        const sum = Object.values(ingredients)
                        .reduce((sum, el) => {
                            return sum + el
                        }, 0)
        this.setState({purchasable: sum > 0});
    }

    purchaseHandler = () => {
        this.setState({purchasing: true});
    }

    purchaseCancelHandler = () => {
        this.setState({purchasing: false});
    }

    purchaseContinueHandler = () => {
        //alert('You continue!');
        this.setState({loading: true})
        const order = {
            ingredients: this.state.ingredients,
            price: this.state.totalPrice,
            customer: {
                name: 'Jimmy Chen',
                address: {
                    street: 'testStreet 1',
                    zipCode: '12345',
                    country: 'Taiwan ROC'
                },
                email: 'test@test.com'
            },
            deliveryMethod: 'ASAP'
        }
        axios.post('/orders', order)
            .then(response => {
                //console.log(response)
                this.setState({loading: false, purchasing: false})
            })
            .catch(error => {
                //console.log(error)
                this.setState({loading: false, purchasing: false})
            })
    }

    render() {
        const disabledInfo = {
            ...this.state.ingredients
        }
        for (let key in disabledInfo) {
            disabledInfo[key] = disabledInfo[key] <= 0
        }
        let orderSummary = null
        let burger = this.state.error ? <p>Ingredients can't be loaded!</p> : <Spinner />
        if(this.state.ingredients) {
            burger = (
                <Aux>
                    <Burger ingredients={this.state.ingredients}/>
                    <BuildControls 
                        ingredientAdded={this.addIngredientHandler}
                        ingredientRemoved={this.removeIngredientHandler}
                        disabled={disabledInfo}
                        purchasable={this.state.purchasable}
                        price={this.state.totalPrice}
                        ordered={this.purchaseHandler}
                    />
                </Aux>
            )
            orderSummary = (
                <OrderSummary 
                    ingredients={this.state.ingredients}
                    purchaseCancelled={this.purchaseCancelHandler}
                    purchaseContinued={this.purchaseContinueHandler}
                    price={this.state.totalPrice}
                />
            )
        }
        if(this.state.loading) {
            orderSummary = <Spinner />
        }
        
        return (
            <Aux>
                <Modal show={this.state.purchasing} modalClosed={this.purchaseCancelHandler}>
                    {orderSummary}
                </Modal>
                {burger}
            </Aux>
        )
    }
}

export default withErrorHandler(BurgerBuilder, axios)