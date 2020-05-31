import React from 'react';
import classes from './NavigationItems.css';
import NavigationItem from './NavigationItem/NavigationItem'

const navigationItems = () => (
    <ul className={classes.NavigationItems}>
        <NavigationItem link="/" active>Builder</NavigationItem>
        <NavigationItem>Checkout</NavigationItem>
    </ul>
);


export default navigationItems;