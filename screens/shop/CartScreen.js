import { Ionicons } from '@expo/vector-icons';
import React, { useCallback, useEffect, useState } from 'react';
import {
    View,
    Image,
    Text,
    StyleSheet,
    Button,
    FlatList,
    ActivityIndicator,
    Dimensions,
    Modal,
    ScrollView,
    Platform
} from 'react-native';
import Ripple from 'react-native-material-ripple';
import { useSelector, useDispatch } from 'react-redux';
import CartItem from '../../components/shop/CartItem';
import Card from '../../components/UI/Card';
import CustomModal from '../../components/UI/CustomModal';
import Colors from '../../constants/Colors';
import * as cartActions from '../../store/actions/cart';
import * as orderActions from '../../store/actions/orders';
import { LinearGradient } from 'expo-linear-gradient';

const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;

const CartScreen = props => {
    const [isLoading, setIsLoading] = useState(false);
    const [orderAmountMsgModal, setOrderAmountMsgModal] = useState(false);
    const [orderSuccessModal, setOrderSuccessModal] = useState(false);

    const cartTotalAmount = useSelector(state => state.cart.totalAmount);


    const cartItems = useSelector(state => {
        const transformedCartItems = [];
        // console.log("state.cart.items==> ", state.cart.items); // [ {}, null, {} ]
        let cartItemsCollectionObj = { ...state.cart.items };
        // console.log("*********** cartItemsCollectionObj==> ", cartItemsCollectionObj);
        for (const key in state.cart.items) {

            if (cartItemsCollectionObj && cartItemsCollectionObj[key]) {
                transformedCartItems.push({
                    productId: cartItemsCollectionObj[key].productId,
                    productTitle: cartItemsCollectionObj[key].productTitle,
                    productPrice: cartItemsCollectionObj[key].productPrice,
                    quantity: cartItemsCollectionObj[key].quantity,
                    sum: cartItemsCollectionObj[key].sum,
                    productPushToken: cartItemsCollectionObj[key].pushToken,
                });
                // console.log(`###### pushToken hai?? ${key} ###### : `, cartItemsCollectionObj[key].pushToken);
            }
        }


        return transformedCartItems.sort((a, b) =>
            a.productId > b.productId ? 1 : -1
        );
    });

    const cartLength = cartItems.length;

    const dispatch = useDispatch();

    const sendOrderHandler = async () => {
        setIsLoading(true);
        setOrderSuccessModal(true);
        dispatch(orderActions.addOrder(cartItems, cartTotalAmount));
        dispatch(cartActions.emptyDbCartItems()); // whenever order gets placed, cartitems must be made empty in DB!
        setIsLoading(false);
    }

    const setOrderAmountMsgModalFunc = () => {
        setOrderAmountMsgModal(true);
    }

    return (
        <LinearGradient colors={['#ffedff', '#ffe3ff']} style={styles.gradient}>
            <View style={styles.screen}>
                <Card style={styles.summary}>
                    <Text style={styles.summaryText}>
                        Total: <Text style={styles.amount} >
                            {'\u20B9'} {(Math.round(cartTotalAmount.toFixed(2) * 100) / 100)}
                            {/* {'\u20B9'} {cartTotalAmount ? (Math.round(cartTotalAmount.toFixed(2) * 100) / 100) : null} */}
                        </Text>
                    </Text>
                    {isLoading ? (
                        <ActivityIndicator size='small' color={Colors.primary} />
                    ) : (
                        <Button
                            color={Colors.accent}
                            title="Order Now"
                            disabled={cartItems.length === 0}
                            onPress={cartTotalAmount >= 500 ? sendOrderHandler : setOrderAmountMsgModalFunc}
                        />
                    )}

                </Card>


                <CustomModal
                    // visible={true}
                    visible={orderSuccessModal}
                    onRequestClose={() => { setOrderSuccessModal(false) }}
                    transparent
                    animationType='none'
                    statusBarTranslucent={true}
                    overlayClick={() => { setOrderSuccessModal(false) }}
                    style={{ height: 450, justifyContent: 'space-between', overflow: 'hidden', borderRadius: 15 }}
                >

                    <View style={{ ...styles.modalHeader, height: '18%' }}>
                        <View style={{ borderWidth: 1, borderColor: '#8BC34A', borderRadius: 500, padding: 10, backgroundColor: '#8BC34A' }}>
                            <Ionicons
                                name={Platform.OS === 'android' ? 'checkmark' : 'ios-checkmark'}
                                size={35}
                                color='white'
                            />
                        </View>
                    </View>
                    <View style={{ ...styles.modalBody, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20 }}>
                        <Text style={{ ...styles.modalBodyText, fontSize: 22, marginTop: 0 }} >Order Noted ! </Text>
                        <View style={{ flex: 1 }}>
                            <ScrollView>
                                <Text style={styles.modalBodyText} >
                                    Shop owner may get in touch with you shortly,
                                    regarding the payment options available.
                                    Only then, order will be considered and delivered.
                                </Text>

                                <Text style={styles.modalBodyText}>
                                    Incase, if you didn't find some items in the app,
                                    you can let the shopkeeper know, when you get an order confirmation call.
                                </Text>
                            </ScrollView>
                        </View>
                        <Text style={{ ...styles.modalBodyText, marginTop: 15 }}>
                            Shop Owner's mobile no.
                        </Text>
                        <Text style={{ ...styles.modalBodyText, marginTop: 0 }}>
                            9662285960 | 8788500464
                        </Text>

                    </View>
                    <View style={{ ...styles.modalFooter, borderTopColor: '#8BC34A' }}>
                        <Ripple
                            rippleDuration={300}
                            rippleContainerBorderRadius={25}
                            style={{ ...styles.btn, backgroundColor: '#8BC34A' }}
                            onPress={() => {
                                setOrderSuccessModal(false)
                            }}
                        >
                            <Text style={{ ...styles.btnText, color: 'white' }} >Got it !</Text>
                        </Ripple>
                    </View>

                </CustomModal>


                <CustomModal
                    visible={orderAmountMsgModal}
                    onRequestClose={() => { setOrderAmountMsgModal(false) }}
                    transparent
                    animationType='none'
                    statusBarTranslucent={true}
                    overlayClick={() => { setOrderAmountMsgModal(false) }}
                    style={{ height: 200, justifyContent: 'space-between', overflow: 'hidden' }}
                >

                    <View style={styles.modalHeader}>
                        <View style={{ borderWidth: 1, borderColor: Colors.secondAccent, borderRadius: 100, padding: 6, backgroundColor: Colors.secondAccent }}>
                            <Ionicons
                                name={Platform.OS === 'android' ? 'information' : 'ios-information'}
                                size={28}
                                color='black'
                            />
                        </View>
                    </View>
                    <View style={{...styles.modalBody, height: 90}}>
                        <Text style={{...styles.modalBodyText, marginVertical:2}} >Hey,</Text>
                        <Text style={styles.modalBodyText} >Minimum order should be of  {'\u20B9'}500 </Text>
                    </View>
                    <View style={{...styles.modalFooter, height: 50}}>
                        <Ripple
                            rippleDuration={300}
                            rippleContainerBorderRadius={25}
                            style={styles.btn}
                            onPress={() => {
                                setOrderAmountMsgModal(false)
                            }}
                        >
                            <Text style={styles.btnText} >Okay</Text>
                        </Ripple>
                    </View>

                </CustomModal>

                <View>
                    {cartLength !== 0 ?
                        (<View style={{ height: '90%' }}>
                            <FlatList
                                data={cartItems}
                                keyExtractor={item => item.productId}
                                // contentContainerStyle={{height : '90%'}}
                                ListFooterComponent={<View style={{ marginBottom: 10 }} />}
                                showsVerticalScrollIndicator={false}
                                renderItem={itemData => (
                                    <CartItem
                                        quantity={itemData.item.quantity}
                                        title={itemData.item.productTitle}
                                        amount={itemData.item.productPrice}
                                        deletable
                                        onRemove={() => {
                                            dispatch(cartActions.removeFromCart(itemData.item.productId));
                                        }}
                                    />
                                )}
                            />
                        </View>) :
                        (<View style={styles.emptyCartImgContainer}>
                            <Image
                                style={{ width: 200, height: 200, borderRadius: 100, margin: 20 }}
                                source={require('../../assets/cart2.png')}
                            />
                            <Text style={styles.emptyCartText} >Hey, Your cart is empty!</Text>
                            <Text style={styles.emptyCartText} >Start shopping now...</Text>
                        </View>)}
                </View>
            </View>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    screen: {
        margin: 20,
    },
    summary: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 20,
        padding: 10,
    },
    summaryText: {
        fontFamily: 'nunito-regular',
        // fontFamily: 'opensans-regular',
        fontSize: 18
    },
    amount: {
        color: Colors.primary,
        fontFamily: 'nunito-regular',
        // fontFamily: 'opensans-regular',
    },
    emptyCartImgContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: HEIGHT / 3,
        margin: 10,
        shadowColor: 'black',
        shadowOpacity: 0.26,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 8,
        elevation: 50,
    },
    emptyCartText: {
        fontFamily: 'nunito-semi-bold',
        color: Colors.primary,
        margin: 5,
        // fontFamily: 'opensans-regular',
        fontSize: 16,
        textAlign: 'center'
    },
    modalHeader: {
        height: 60,
        // backgroundColor: Colors.secondPrimary,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalBody: {
        justifyContent: 'center',
        alignItems: 'center',
        height: '72%'
    },
    modalBodyText: {
        fontFamily: 'nunito-semi-bold',
        fontSize: 15,
        textAlign: 'justify',
        marginVertical: 8
    },
    modalFooter: {
        height: '10%',
        // backgroundColor: 'orange', 
        justifyContent: 'center',
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: Colors.secondAccent,
    },
    btn: {
        height: 50,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.secondAccent,
        padding: 8,
    },
    btnText: {
        color: 'black',
        fontFamily: 'nunito-semi-bold',
        fontSize: 16
    },
    gradient: {
        // flex: 1,
        // justifyContent: 'center',
        // alignItems: 'center',
        height: '100%'
    },

});

export default CartScreen;