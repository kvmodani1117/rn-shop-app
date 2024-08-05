import React, { useEffect, useLayoutEffect } from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
    Button,
    ScrollView,
    ToastAndroid
} from 'react-native';
import { useDispatch, useSelector } from "react-redux";
import * as cartActions from '../../store/actions/cart';

import Colors from '../../constants/Colors';
import Ripple from 'react-native-material-ripple';
import { LinearGradient } from 'expo-linear-gradient';

const ProductDetail = props => {
    const { productId, productTitle } = props.route.params;
    const selectedProduct = useSelector(state =>
        state.products.availableProducts.find(prod => prod.id === productId)
    );

    const dispatch = useDispatch();

    useEffect(() => {
        props.navigation.setOptions({
            title: productTitle,
        });
    }, [props]);


    return (
        <View>

        {/* <LinearGradient colors={['#ffedff', '#ffe3ff']}  style={styles.gradient}> */}
        <LinearGradient colors={['#ffedff', '#ffedff']}  style={styles.gradient}>  
        <ScrollView>
            <Image style={styles.image} source={{ uri: selectedProduct.imageUrl }} />
            
            <View style={styles.actions}>
                <Ripple
                    rippleDuration={300}
                    rippleContainerBorderRadius={20}
                    style={styles.btn}
                    onPress={() => {
                        dispatch(cartActions.addToCart(selectedProduct));
                        ToastAndroid.show('Product added to cart!', ToastAndroid.SHORT);
                    }}
                >
                    <Text style={styles.btnText} >Add to Cart</Text>
                </Ripple>
            </View>
            <Text style={styles.price} >{'\u20B9'} {selectedProduct.price.toFixed(2)}</Text>
            <Text style={styles.descriptionTitle}>Description: </Text>
            <Text style={styles.description} >{selectedProduct.description}</Text>
            
        </ScrollView>
        </LinearGradient>
        
        
        </View>
    );

};

const styles = StyleSheet.create({
    image: {
        width: '100%',
        height: 260,
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10
    },
    actions: {
        marginVertical: 10,
        alignItems: 'center'
    },
    price: {
        fontFamily: 'nunito-semi-bold',
        fontWeight: 'bold',
        fontSize: 18,
        color: '#888',
        textAlign: 'center',
        marginVertical: 12,
    },
    descriptionTitle: {
        marginHorizontal: 20,
        marginVertical: 5,
        fontSize: 16,
        fontFamily: 'nunito-semi-bold',
        fontWeight: 'bold',
        color: '#555'
    },
    description: {
        fontSize: 13,
        textAlign: 'justify',
        marginHorizontal: 20,
        fontFamily: 'opensans-regular'
    },
    btn: {
        height: 35,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8,
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
        height: '100%'
    },
});

export default ProductDetail;