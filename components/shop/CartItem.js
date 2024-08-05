import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    Button,
    Platform,
    TouchableOpacity
} from 'react-native';

import Colors from '../../constants/Colors';
import { Ionicons } from '@expo/vector-icons';

const CartItem = props => {
    return (
        <View style={styles.cartItem} >
            <View style={styles.itemData}>
                <Text style={styles.quantity} >{props.quantity} </Text>
                <Text style={styles.mainText}>{props.title}</Text>
            </View>
            <View style={styles.itemData}>
                <Text style={styles.mainText}>{'\u20B9'} {props.amount.toFixed(2)}</Text>

                {/* MAKING TRASH ICON TO APPEAR ONLY IF 'delatable' is true.. which is only in CART SCREEN */}
                {props.deletable && (
                    <TouchableOpacity onPress={props.onRemove} style={styles.deleteButton}>
                        <Ionicons
                            name={Platform.OS === 'android' ? 'md-trash' : 'ios-trash'}
                            size={23}
                            color="red"
                        />
                    </TouchableOpacity>
                )}

            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    cartItem: {
        paddingVertical: 2,
        paddingHorizontal: 6,
        backgroundColor: 'white',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginHorizontal: 2,
        borderRadius: 10,
        margin: 2,

    },
    itemData: {
        flexDirection: 'row',
        alignItems: 'center',
        maxWidth: '60%'
    },
    quantity: {
        fontFamily: '',
        color: '#888',
        fontSize: 16,
        justifyContent: 'flex-start'
    },
    mainText: {
        fontFamily: 'nunito-regular',
        // fontFamily: 'opensans-regular',
        fontSize: 14
    },
    deleteButton: {
        marginLeft: 14
    },

});

export default CartItem;