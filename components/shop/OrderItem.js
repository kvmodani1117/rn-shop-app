import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Button,
    Platform,
    TouchableOpacity,
    // TouchableNativeFeedback,
    // TouchableWithoutFeedback
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { shopAdmins } from '../../Admins';
import Colors from '../../constants/Colors';
import Card from '../UI/Card';
import CartItem from './CartItem';
import moment from 'moment';
import Ripple from 'react-native-material-ripple';
import { TouchableNativeFeedback, TouchableWithoutFeedback } from 'react-native-gesture-handler';
import CustomModal from '../UI/CustomModal';
import * as orderActions from '../../store/actions/orders';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';

const OrderItem = props => {   //props--> 'email' available to use as 'props.email'
    const [showDetails, setShowDetails] = useState(false);
    const [statusUpdateModal, setStatusUpdateModal] = useState(false);
    const dispatch = useDispatch();
    const isUserAdmin = useSelector(state => state.auth.userId);
    const orderStatus = useSelector(state => state.orders.orderStatus);
    // console.log("orderStatus--> ", orderStatus);
    let TouchableComp = TouchableOpacity;
    if (Platform.OS === 'android' && Platform.Version >= 21) {
        TouchableComp = TouchableNativeFeedback;
    }

    let orderReadableDate = props.date;
    if (shopAdmins.includes(isUserAdmin)) {

        const readableDate = () => {
            // return moment(this.date).format('MMMM Do YYYY, hh:mm');
            // return moment(this.date).format('MMMM Do YYYY, h:mm:ss a');
            orderReadableDate = moment(props.date).format('llll');
        }
        readableDate();
    }

    let updateOrderStatusHandler = async (currentStatus) => {
        await dispatch(orderActions.updateOrderStatus(props.orderId, currentStatus));
        await dispatch(orderActions.fetchOrders());
    }

    return (
        <>
            <Card style={styles.card} >

                <TouchableNativeFeedback onPress={() => {
                    if (shopAdmins.includes(isUserAdmin)) { 
                        setStatusUpdateModal(true);
                    }
                }} >

                    {shopAdmins.includes(isUserAdmin) ? (
                        <View style={styles.userDetailsView}>
                            <View style={styles.summary}>
                                <View style={{ width: '70%', paddingRight: 5 }}>
                                    <Text style={styles.username} >{props.username}</Text>
                                </View>
                                <View style={{ width: '30%' }}>
                                    <Text style={styles.mobile} >{props.mobile}</Text>
                                </View>
                            </View>
                            <View style={{ paddingHorizontal: 10, paddingBottom: 10, alignSelf: 'flex-start' }}>
                                <Text style={styles.address} >{props.address}</Text>
                            </View>
                        </View>) : null
                    }
                </TouchableNativeFeedback>
                <View style={shopAdmins.includes(isUserAdmin) ? { width: '100%' } : styles.userDetailsView}>
                    <View style={styles.summary}>
                        <Text style={styles.totalAmount} >{'\u20B9'} {props.amount.toFixed(2)}</Text>
                        <Text style={styles.date} >{orderReadableDate}</Text>
                    </View>

                    <View style={{ paddingHorizontal: 10, paddingBottom: 10, alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' }}>
                        
                        <View style={{ width: '55%', alignItems: 'flex-end' }}>
                            <Ripple
                                rippleColor="white"
                                rippleDuration={400}
                                rippleContainerBorderRadius={500}
                                style={styles.detailsBtn}
                                onPress={() => { setShowDetails(prevState => !prevState) }}
                            >
                                <View  >
                                    {showDetails ?
                                        <Ionicons name="chevron-up" size={24} color={Colors.primary} /> :
                                        <Ionicons name="chevron-down" size={24} color={Colors.primary} />
                                    }
                                </View>
                            </Ripple>
                        </View>
                        <View style={[
                            styles.orderStatusStyle,
                            props.orderStatus && props.orderStatus === "pending" ? { backgroundColor: Colors.secondAccent } : {},
                            props.orderStatus && props.orderStatus === "dispatched" ? { backgroundColor: Colors.coolBlue } : {},
                            props.orderStatus && props.orderStatus === "delivered" ? { backgroundColor: Colors.success } : {},
                            props.orderStatus && props.orderStatus === "cancelled" ? { backgroundColor: Colors.danger } : {},
                        ]}>
                            {props.orderStatus && props.orderStatus === "pending" ?
                                <MaterialCommunityIcons name="progress-clock" size={18} color="white" /> : null
                            }
                            {props.orderStatus && props.orderStatus === "dispatched" ?
                                <MaterialCommunityIcons name="truck-delivery-outline" size={18} color="white" /> : null
                            }
                            {props.orderStatus && props.orderStatus === "delivered" ?
                                <Ionicons name="checkmark-circle-outline" size={18} color="white" /> : null
                            }
                            {props.orderStatus && props.orderStatus === "cancelled" ?
                                <MaterialCommunityIcons name="cancel" size={18} color="white" /> : null
                            }
                            <Text style={{ marginLeft: 5, color: 'white', fontSize: 12 }}>{props.orderStatus}</Text>
                        </View>
                    </View>

                </View>
                {showDetails && (
                    <View style={styles.detailItems} >
                        {props.items.map(cartItem => (
                            <CartItem
                                key={cartItem.productId}
                                quantity={cartItem.quantity}
                                amount={cartItem.sum}
                                title={cartItem.productTitle}
                            />
                        ))}
                    </View>
                )}



            </Card>


            <CustomModal
                // visible={true}
                visible={statusUpdateModal}
                onRequestClose={() => { setStatusUpdateModal(false) }}
                transparent
                animationType='none'
                statusBarTranslucent={true}
                overlayClick={() => { setStatusUpdateModal(false) }}
                style={{ height: 280, width: 240, justifyContent: 'space-between', overflow: 'hidden', borderRadius: 15 }}
            >

                <View style={{ ...styles.modalBody, padding: 20, marginVertical: 35, marginHorizontal: 10, alignItems: 'center', justifyContent: 'center' }}>
                    <View style={{ ...styles.orderStatusBtnView }}>
                        <Ripple
                            rippleDuration={300}
                            rippleContainerBorderRadius={20}
                            style={{ ...styles.orderStatusBtnStyle, backgroundColor: Colors.secondAccent }}
                            onPress={() => {
                                updateOrderStatusHandler("pending");
                                setStatusUpdateModal(false);
                            }}
                        >
                            <MaterialCommunityIcons name="progress-clock" size={24} color="white" />
                            <Text style={styles.statusTextStyle}>Pending</Text>
                        </Ripple>
                    </View>
                    <View style={styles.orderStatusBtnView}>
                        <Ripple
                            rippleDuration={300}
                            rippleContainerBorderRadius={20}
                            style={{ ...styles.orderStatusBtnStyle, backgroundColor: Colors.coolBlue }}
                            onPress={() => {
                                updateOrderStatusHandler("dispatched");
                                setStatusUpdateModal(false);
                            }}
                        >
                            <MaterialCommunityIcons name="truck-delivery-outline" size={24} color="white" />
                            <Text style={styles.statusTextStyle}>Dispatched</Text>
                        </Ripple>
                    </View>
                    <View style={styles.orderStatusBtnView}>
                        <Ripple
                            rippleDuration={300}
                            rippleContainerBorderRadius={20}
                            style={{ ...styles.orderStatusBtnStyle, backgroundColor: Colors.success }}
                            onPress={() => {
                                updateOrderStatusHandler("delivered");
                                setStatusUpdateModal(false);
                            }}
                        >
                            <Ionicons name="checkmark-circle-outline" size={24} color="white" />
                            <Text style={styles.statusTextStyle}>Delivered</Text>
                        </Ripple>

                    </View>
                    <View style={styles.orderStatusBtnView}>

                        <Ripple
                            rippleDuration={300}
                            rippleContainerBorderRadius={20}
                            style={{ ...styles.orderStatusBtnStyle, backgroundColor: Colors.danger }}
                            onPress={() => {
                                updateOrderStatusHandler("cancelled");
                                setStatusUpdateModal(false);
                            }}
                        >
                            <MaterialCommunityIcons name="cancel" size={24} color="white" />
                            <Text style={styles.statusTextStyle}>Cancelled</Text>
                        </Ripple>

                    </View>

                </View>

            </CustomModal>


        </>

    );
}

const styles = StyleSheet.create({
    orderItem: {
        marginHorizontal: 20,
        marginVertical: 10,
        // padding: 10,
        alignItems: 'center',
        overflow: 'hidden'
    },
    card: {
        marginHorizontal: 20,
        marginVertical: 10,
        overflow: 'hidden'
    },
    summary: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        marginVertical: 0,
        padding: 10

    },
    totalAmount: {
        fontFamily: 'nunito-semi-bold',  //open-sans-bold
        fontSize: 16,
        // color: Colors.primary,
        color: 'black'
        // fontWeight: 'bold'
    },
    date: {
        fontFamily: 'nunito-regular',
        fontSize: 16,
        color: 'black',
        // color: Colors.primary
        // fontFamily: '',  //open-sans
        // color: '#888'
    },
    detailItems: {
        width: '100%',
        marginBottom: 10
    },
    userDetailsView: {
        width: '100%',
        backgroundColor: Colors.secondPrimary
    },
    username: {
        fontFamily: 'nunito-regular',
        fontWeight: 'bold',
        fontSize: 18,
        color: 'black',
    },
    mobile: {
        fontFamily: 'nunito-regular',
        fontSize: 16,
        fontStyle: 'italic',
        color: 'black',

    },
    address: {
        fontSize: 14,
        color: 'black',
    },
    detailsBtn: {
        height: 35,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 500,
        // backgroundColor: Colors.primary,
        padding: 8,
        overflow: 'hidden'
    },
    btn: {
        height: 100,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.secondAccent,
        padding: 8,
    },
    // btnText: {
    //     color: 'black',
    //     fontFamily: 'nunito-semi-bold',
    //     fontSize: 16,
    // },
    btnText: {
        color: 'white',
        fontFamily: 'nunito-semi-bold'
    },
    modalBody: {
        justifyContent: 'center',
        alignItems: 'center',
        height: '72%'
    },
    orderStatusStyle: {
        // marginLeft: '5%',
        // borderWidth: 1,
        // borderColor: 'black',
        paddingVertical: 2,
        paddingHorizontal: 8,
        borderRadius: 20,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    orderStatusBtnStyle: {
        // borderWidth: 2,
        // borderColor: 'black',
        paddingVertical: 10,
        paddingHorizontal: 20,
        margin: 5,
        width: '100%',
        borderRadius: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    orderStatusBtnView: {
        marginTop: 5,
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    statusTextStyle: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16
    }
});

export default OrderItem;