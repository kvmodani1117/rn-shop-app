import React, { useState, useEffect, useCallback } from 'react';
import { View, Button, FlatList, Platform, ActivityIndicator, StyleSheet, Text, Modal, ToastAndroid } from 'react-native';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import HeaderButton from '../../components/UI/HeaderButton';

import { useSelector, useDispatch } from 'react-redux';
import ProductItem from '../../components/shop/ProductItem';
import * as cartActions from '../../store/actions/cart';
import * as productsActions from '../../store/actions/products';
import Colors from '../../constants/Colors';
import { Badge } from 'react-native-elements';

import { Ionicons } from '@expo/vector-icons';
import Ripple from 'react-native-material-ripple';
import { LinearGradient } from 'expo-linear-gradient';
import { Entypo } from '@expo/vector-icons';

const ProductsOverviewScreen = props => {

    const [isLoading, setIsLoading] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const [error, setError] = useState();

    const products = useSelector(state => state.products.availableProducts);
    const dispatch = useDispatch();

    const loadProducts = useCallback(async () => {
        setError(null);
        // setIsLoading(true);
        setIsRefreshing(true);
        try {
            await dispatch(productsActions.fetchProducts());
            await dispatch(cartActions.fetchCartItems());
        }
        catch (err) {
            setError(err.message);
        }
        setIsRefreshing(false);
        // setIsLoading(false);
    }, [dispatch, setIsLoading, setError]);



    useEffect(() => {
        const unsubscribe = props.navigation.addListener('focus', loadProducts);

        return () => {
            unsubscribe;
        };
    }, [loadProducts]);



    useEffect(() => {
        setIsLoading(true);
        const unsubscribe = loadProducts().then(() => {
            setIsLoading(false);
        });

        return () => {
            unsubscribe; // changed recently
        };
    }, [dispatch, loadProducts]);



    const selectItemHandler = (id, title) => {
        props.navigation.navigate('ProductDetail', {
            productId: id,
            productTitle: title
        });
    }

    if (error) {
        return (
            <View style={styles.centered}>
                <Text> An error occured!</Text>
                <Button
                    title="Try again"
                    onPress={loadProducts}
                    color={Colors.primary}
                />
            </View>
        );
    }
    if (isLoading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size='large' color={Colors.primary} />
            </View>
        );
    }
    if (!isLoading && products.length === 0) {
        return (
            <View style={styles.centered}>
                <Text>
                    No products found.
                </Text>
            </View>
        );
    }




    return (
        <View>
            <LinearGradient colors={['#ffedff', '#ffe3ff']} style={styles.gradient} >

                <FlatList
                    onRefresh={loadProducts}
                    refreshing={isRefreshing}
                    showsVerticalScrollIndicator={false}
                    ListFooterComponent={<View style={{ marginBottom: 20 }} />} // for last item to be completely visible
                    data={products}
                    keyExtractor={item => item.id}
                    renderItem={itemData => (
                        <ProductItem
                            image={itemData.item.imageUrl}
                            title={itemData.item.title}
                            price={itemData.item.price}
                            onSelect={() => {
                                selectItemHandler(itemData.item.id, itemData.item.title);
                            }}
                        >

                            <Ripple
                                rippleDuration={300}
                                rippleContainerBorderRadius={20}
                                // style={styles.btn}
                                onPress={() => {
                                    selectItemHandler(itemData.item.id, itemData.item.title)
                                }}
                            >
                                <Entypo name="info-with-circle" size={26} color={Colors.primary} />
                            </Ripple>
                           
                            <Ripple
                                rippleDuration={300}
                                rippleContainerBorderRadius={20}
                                // style={styles.btn}
                                onPress={() => {
                                    dispatch(cartActions.addToCart(itemData.item));
                                    ToastAndroid.show('Product added to cart!', ToastAndroid.SHORT);
                                }}
                            >
                                <Ionicons name={Platform.OS === 'android' ? 'md-cart' : 'ios-cart'} size={26} color={Colors.primary} />
                            </Ripple>

                        </ProductItem>
                    )}
                />
                
            </LinearGradient>
        </View>
    );
};


export const screenOptions = props => {
    const itemsArr = useSelector(state => state.cart.items);
    let itemsCollectionObj = { ...itemsArr };
    let totalItemsInCart = 0;
    for (let i in itemsCollectionObj) {
        if (itemsCollectionObj[i]) {
            totalItemsInCart = totalItemsInCart + itemsCollectionObj[i].quantity;
        }
    }

    return {
        headerTitle: 'Grab it!', //All Products
        headerLeft: () => (
            <HeaderButtons HeaderButtonComponent={HeaderButton}>
                <Item
                    title="Menu"
                    iconName={Platform.OS === 'android' ? 'md-menu' : 'ios-menu'}
                    onPress={() => {
                        props.navigation.toggleDrawer();
                    }}
                />
            </HeaderButtons>
        ),
        headerRight: () => (

            <HeaderButtons HeaderButtonComponent={HeaderButton}>
                <Item
                    title="Search"
                    iconName={Platform.OS === 'android' ? 'md-search' : 'ios-search'}
                    onPress={() => {
                        props.navigation.navigate('Search');
                    }}
                />
                <Item
                    title="Cart"
                    iconName={Platform.OS === 'android' ? 'md-cart' : 'ios-cart'}
                    onPress={() => {
                        props.navigation.navigate('Cart');
                    }}
                />
                {totalItemsInCart !== 0 ? (
                    <Badge
                        value={totalItemsInCart}
                        badgeStyle={{ borderWidth: 0 }}
                        status="primary"
                        containerStyle={{ position: 'absolute', top: -6, right: 2 }}
                    />
                ) : null}

            </HeaderButtons>

        )
    };
};



const styles = StyleSheet.create({
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    container: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'stretch',
        alignContent: 'center',
        paddingLeft: 5,
        paddingRight: 5,
    },
    filterIcon: {
        justifyContent: 'center',
        alignContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        height: 45,
        width: 45,
        borderRadius: 50,
        // padding: 12,
        // paddingLeft: 10,
        marginTop: 11,
    },
    btn: {
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 500,
        backgroundColor: Colors.primary,
        padding: 8
    },
    btnText: {
        color: 'white',
        fontFamily: 'nunito-semi-bold'
    },
    gradient: {
        // flex: 1,
        // justifyContent: 'center',
        // alignItems: 'center',
        height: '100%',
        paddingVertical: 5
    },
});

export default ProductsOverviewScreen;
