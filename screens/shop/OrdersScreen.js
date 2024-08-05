import React, { useCallback, useEffect, useState } from 'react';
import { FlatList, Text, Platform, StyleSheet, View, Button, ActivityIndicator, Dimensions, Image } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import HeaderButton from '../../components/UI/HeaderButton';
import OrderItem from '../../components/shop/OrderItem';
import * as ordersActions from '../../store/actions/orders';
import Colors from '../../constants/Colors';
import { shopAdmins } from '../../Admins';
import { LinearGradient } from 'expo-linear-gradient';
import Ripple from 'react-native-material-ripple';

const HEIGHT = Dimensions.get('window').height;

const OrderScreen = props => {
    const [isLoading, setIsLoading] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [error, setError] = useState();
    const dispatch = useDispatch();
    const isUserAdmin = useSelector(state => state.auth.userId);
    const orderStatus = useSelector(state => state.orders.orderStatus);

    useEffect(() => {
        const unsubscribe = props.navigation.setOptions({
            title: 'Your Orders',
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
            )
        });

        return () => {
            unsubscribe; // changed recently
        };

    }, [props.navigation]);

    const unSortedOrders = useSelector(state => state.orders.orders);
    const orders = unSortedOrders.sort((a, b) =>
        a.date > b.date ? -1 : 1
    );


    const loadOrders = useCallback(async () => {
        setError(null);
        setIsLoading(true);
        setIsRefreshing(true);
        try {
            await dispatch(ordersActions.fetchOrders());
        }
        catch (err) {
            setError(err.message);
        }
        setIsRefreshing(false);
        setIsLoading(false);
    }, [dispatch, setIsLoading, setError]);


    useEffect(() => {
        loadOrders();

        return () => {
            loadOrders; // changed recently
        };

    }, [dispatch]);



    if (error) {
        return (
            <View style={styles.centered}>
                <Text> An error occured!</Text>
                <Button
                    title="Try again"
                    onPress={loadOrders}
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
    if (!isLoading && orders.length === 0) {
        return (
            <View style={styles.centered}>
                {/* <View style={styles.noOrdersImgContainer}> */}
                <Image
                    style={{ width: 200, height: 200, borderRadius: 100, margin: 20 }}
                    source={require('../../assets/deliveryBox.png')}
                />
                <Text style={styles.noOrdersText}>
                    No orders yet.{'\n'} Start shopping now...
                </Text>
                {/* </View> */}

            </View>
        );
    }

    if (shopAdmins.includes(isUserAdmin)) {

        return (
            // <LinearGradient colors={['#fff', '#fff']} style={styles.gradient} >

            <FlatList
                onRefresh={loadOrders}
                refreshing={isRefreshing}
                data={orders}
                keyExtractor={(item, index) => item.orderkey + index.toString()}
                renderItem={itemData => (
                    
                        <OrderItem
                            amount={itemData.item.totalAmount}
                            date={itemData.item.date}
                            items={itemData.item.items}
                            username={itemData.item.username}
                            mobile={itemData.item.mobile}
                            address={itemData.item.address}
                            email={itemData.item.email}
                            orderId={itemData.item.orderkey}
                            // orderStatus={orderStatus}
                            orderStatus={itemData.item.orderStatus}
                        />
                   
                )}
            />

            // </LinearGradient>
        );
    }
    else {
        return (
            // <LinearGradient colors={['#fff', '#fff']} style={styles.gradient} >
            <FlatList
                onRefresh={loadOrders}
                refreshing={isRefreshing}
                data={orders}
                keyExtractor={item => item.id}
                renderItem={itemData => (
                    <OrderItem
                        amount={itemData.item.totalAmount}
                        date={itemData.item.readableDate}
                        items={itemData.item.items}
                        orderId={itemData.item.id}
                        // orderStatus={orderStatus}
                        orderStatus={itemData.item.orderStatus}
                    />
                )}
            />
            // </LinearGradient>
        );
    }
}

const styles = StyleSheet.create({
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    gradient: {
        // flex: 1,
        // justifyContent: 'center',
        // alignItems: 'center',
        height: '100%'
    },
    noOrdersText: {
        fontFamily: 'nunito-semi-bold',
        color: Colors.primary,
        margin: 5,
        // fontFamily: 'opensans-regular',
        fontSize: 16,
        textAlign: 'center'
    },
});

export default OrderScreen;