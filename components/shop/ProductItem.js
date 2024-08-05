import React from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
    Button,
    TouchableOpacity,
    TouchableNativeFeedback,
    Platform
} from 'react-native';

import Colors from '../../constants/Colors';
import Card from '../UI/Card';

const ProductItem = props => {

    let TouchableComp = TouchableOpacity;
    if (Platform.OS === 'android' && Platform.Version >= 21) {
        TouchableComp = TouchableNativeFeedback;
    }

    return (
        <Card style={styles.product}>
            <TouchableComp onPress={props.onSelect} useForeground >
                <View>
                    <View style={styles.imageContainer}>
                        <Image style={styles.image} source={{ uri: props.image }} />
                    </View>
                    {/* <View style={{justifyContent: 'space-between', height: '40%'}}> */}
                    <View style={styles.details}>
                        <Text style={styles.title}>{props.title}</Text>
                        <Text style={styles.price}>{'\u20B9'} {props.price.toFixed(2)}</Text>
                    </View>
                    <View style={styles.actions}>
                        {props.children}
                    </View>
                    {/* </View> */}
                </View>
            </TouchableComp>
        </Card>
    );
};

const styles = StyleSheet.create({
    product: {
        // height: 300,
        // height: 200,  //used in 1.0.0
        height: 200,
        margin: 12,
        marginVertical: 8,
        overflow: 'hidden'
    },
    imageContainer: {
        width: '100%',
        height: '60%',
        // height: '70%',
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        overflow: 'hidden'
    },
    image: {
        width: '100%',
        height: '100%'
    },
    details: {
        alignItems: 'center',
        height: '17%',
        // height: '12%',
        paddingHorizontal: 10,
        paddingVertical: 2
    },
    title: {
        fontFamily: 'nunito-regular',
        // fontFamily: 'opensans-regular',
        fontSize: 15,
        marginVertical: 4
    },
    price: {
        // fontFamily: 'nunito-regular',
        fontFamily: 'opensans-bold',
        fontSize: 13,
        color: '#888'
    },
    actions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: '23%',
        // height: '15%',
        paddingHorizontal: 15
    },
    btn: {
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8,
        backgroundColor: Colors.primary,
        padding: 8
    },
    btnText: {
        color: 'white',
        fontFamily: 'nunito-semi-bold'
    }
});

export default ProductItem;