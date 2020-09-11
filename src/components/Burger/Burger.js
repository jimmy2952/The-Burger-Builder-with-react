import React from 'react'
import BurgerIngredient from './BurgerIngredient/BurgerIngredient'

import classes from './Burger.module.css'
import BurgerBuilder from '../../containers/BurgerBuilder/BurgerBuilder'

const Burger = props => {
    const transformedIngredients = Object.keys(props.ingredients)
        .map(igKey => {
            return [...Array(props.ingredients[igKey])]
            .map((_, index) => {
                return <BurgerIngredient key={igKey + index} type={igKey} />
            })
        })

    return (
        <div className={classes.Burger}>
            <BurgerIngredient type='bread-top'/>
                {transformedIngredients}
            <BurgerIngredient type='bread-bottom'/>
            {console.log(transformedIngredients)}
        </div>
    )
} 

export default Burger