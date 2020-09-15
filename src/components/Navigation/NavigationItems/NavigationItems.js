import React from 'react'
import classes from './NavigationItems.module.css'
import NavigationItem from './NavigationItem/NavigationItem'

const navigationItems = props => (
    <ul className={classes.NavigationItems}>
        <NavigationItem link="./" exact active>Burger Builder</NavigationItem>
        <NavigationItem link="./orders">Order</NavigationItem>
    </ul>
)

export default navigationItems