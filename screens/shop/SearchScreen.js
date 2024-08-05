import React, { useEffect, useLayoutEffect, useState } from 'react';
import ProductItem from '../../components/shop/ProductItem';
import {
    View,
    Text,
    Image,
    StyleSheet,
    Button,
    ScrollView,
    ToastAndroid,
    FlatList,
    Modal,
    TextInput,
    Dimensions
} from 'react-native';
import { useDispatch, useSelector } from "react-redux";
import * as cartActions from '../../store/actions/cart';

import Colors from '../../constants/Colors';
import Ripple from 'react-native-material-ripple';
import { Ionicons, Entypo, MaterialIcons } from '@expo/vector-icons';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import HeaderButton from '../../components/UI/HeaderButton';
import CategoriesModal from '../../components/UI/CategoriesModal';




const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;

const SearchScreen = props => {

    const dispatch = useDispatch();
    const allProducts = useSelector(state => state.products.availableProducts);

    const [search, setSearch] = useState('');
    const [displayProducts, setDisplayProducts] = useState();
    const [modalVisibility, setModalVisibility] = useState(false);

    const updateSearchHandler = (text) => {
        if (modalVisibility) {
            setModalVisibility(false);
        }
        // console.log("Inside updateSearchHandler --> ", text);
        setSearch(text);
    };

    let filterSearch = async () => {
        var regex = new RegExp(search, "i");
        let displayItems = await allProducts.filter(prod => regex.test(prod.title) || regex.test(prod.description));
        setDisplayProducts(displayItems);
    }


    useEffect(() => {

        let unsubscribe;
        if (search !== '') {
            unsubscribe = filterSearch();
        }
        else {
            unsubscribe = setDisplayProducts(); //NOT SHOWING ALL PRODUCTS INITIALLY !!
        }
        return () => {
            unsubscribe; // changed recently
        };
    }, [search, allProducts, setDisplayProducts]);



    useEffect(() => {
        props.navigation.setOptions({
            title: "",
            headerRight: () => (
                <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>

                    <TextInput
                        style={{ width: WIDTH - WIDTH / 3, marginRight: 12, height: 40, borderRadius: 20, backgroundColor: 'white', padding: 10 }}
                        placeholder="Search"
                        // onChangeText={text => setSearch(text)} 
                        onChangeText={updateSearchHandler}
                        // defaultValue={search}
                        value={search}
                    />

                    <HeaderButtons HeaderButtonComponent={HeaderButton}>
                        {/* <Item
                            title="Menu"
                            iconName={Platform.OS === 'android' ? 'md-funnel' : 'ios-funnel'}
                            onPress={() => {
                                setModalVisibility(true);
                            }}
                        /> */}
                        <Ripple
                            rippleDuration={400}
                            rippleContainerBorderRadius={20}
                            onPress={() => {
                                setModalVisibility(true);
                            }}
                            style={{ margin: 5 }}
                            rippleCentered={true}
                            rippleColor='white'
                        >
                            <MaterialIcons name="category" size={30} color="white" />
                        </Ripple>
                    </HeaderButtons>

                </View>
            )
        });
    });



    const selectItemHandler = (id, title) => {
        props.navigation.navigate('ProductDetail', {
            productId: id,
            productTitle: title
        });
    }

    return (
        <View>
            {!displayProducts || displayProducts && displayProducts.length === 0 ?
                (
                    <View style={styles.startSearchingImgContainer}>
                        <Image
                            style={{ width: 200, height: 200, borderRadius: 100, margin: 20 }}
                            source={require('../../assets/StartSearching.png')}
                        />
                        <Text style={styles.startSearchingText} >Start Searching !</Text>
                    </View>
                ) :
                (<FlatList
                    showsVerticalScrollIndicator={false}
                    ListFooterComponent={<View style={{ marginBottom: 20 }} />}
                    data={displayProducts}
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
                                onPress={() => {
                                    selectItemHandler(itemData.item.id, itemData.item.title)
                                }}
                            >
                                <Entypo name="info-with-circle" size={26} color={Colors.primary} />
                            </Ripple>

                            <Ripple
                                rippleDuration={300}
                                rippleContainerBorderRadius={20}
                                onPress={() => {
                                    dispatch(cartActions.addToCart(itemData.item));
                                    ToastAndroid.show('Product added to cart!', ToastAndroid.SHORT);
                                }}
                            >
                                <Ionicons name={Platform.OS === 'android' ? 'md-cart' : 'ios-cart'} size={26} color={Colors.primary} />
                            </Ripple>

                        </ProductItem>
                    )}
                />)
            }
            <CategoriesModal
                modalVisibility={modalVisibility}
                setModalVisibility={setModalVisibility}
                updateSearchHandler={updateSearchHandler}
            />
        </View>
    );

};

const styles = StyleSheet.create({
    startSearchingImgContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: HEIGHT / 3 + 20,
        margin: 10,
        shadowColor: 'black',
        shadowOpacity: 0.26,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 8,
        elevation: 50,
    },
    startSearchingText: {
        fontFamily: 'nunito-semi-bold',
        color: Colors.primary,
        margin: 5,
        // fontFamily: 'opensans-regular',
        fontSize: 16,
        textAlign: 'center'
    },
});

export default SearchScreen;