import React, { useState } from 'react';
import {
    StyleSheet,
    View,
    Dimensions,
    Modal,
    TouchableOpacity,
    TouchableWithoutFeedback,
    Text,
    FlatList,
    Platform
} from 'react-native';
import Ripple from 'react-native-material-ripple';
import Colors from '../../constants/Colors';
import CustomModal from './CustomModal';

const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;

const CategoriesModal = props => {

    const categoriesData = [
        //1
        {
            categoryName: 'Biscuit',
            color: '#d56b7a',
        },
        //2
        {
            categoryName: 'Chocolate',
            color: '#c38452',
        },
        //3
        {
            categoryName: 'Dairy',
            color: '#0abde3',
        },
        //4
        {
            categoryName: 'Namkeen',
            color: '#ff9a8d',
        },
        //5
        {
            categoryName: 'Cooking Oil',
            color: Colors.accent,
        },
        //6
        {
            categoryName: 'Beverage',
            color: '#70a1ff',
        },
        //7
        {
            categoryName: 'Cold Drink',
            color: '#8BC34A',
        },
        //8
        {
            categoryName: 'Juice',
            color: '#ff6b81',
        },
        //9
        {
            categoryName: 'Grooming',
            color: '#D980FA',
            // color: '#d9a5b3',
        },
    ];


    return (
        <CustomModal
            // visible={true}
            visible={props.modalVisibility}
            onRequestClose={() => { props.setModalVisibility(false) }}
            transparent
            animationType='none'
            statusBarTranslucent={true}
            overlayClick={() => { props.setModalVisibility(false) }}
            style={styles.modal}
        >

            <FlatList
                data={categoriesData}
                keyExtractor={item => item.categoryName}
                showsVerticalScrollIndicator={false}
                renderItem={itemData => (
                        <Ripple
                            rippleDuration={400}
                            rippleContainerBorderRadius={20}
                            style={{ ...styles.categoriesWrapper, backgroundColor: itemData.item.color }}
                            onPress={() => props.updateSearchHandler(itemData.item.categoryName)}
                        >
                            <Text style={styles.categoriesText}>{itemData.item.categoryName}</Text>
                        </Ripple>
                )}
            />

        </CustomModal>
    );




}

const styles = StyleSheet.create({
    modalCentered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.6)'
        // backgroundColor: '#00000099'
    },
    modal: { 
        height: HEIGHT / 1.5 + 40, 
        width: WIDTH / 1.5 + 10, 
        flexDirection: 'row', 
        justifyContent: 'center', 
        alignItems: 'center', 
        overflow: 'hidden', 
        borderRadius: 20 
    },
    itemContainer: {
        borderRadius: 20
    },
    categoriesWrapper: {
        height: 40,
        width: '80%',
        padding: 25,
        margin: 10,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
        alignSelf: 'center'
    },
    categoriesText: {
        color: 'white',
        fontSize: 18,
        fontFamily: 'nunito-semi-bold',
        fontWeight: 'bold',
        justifyContent: 'center',
        alignItems: 'center'
    }
});

export default CategoriesModal;