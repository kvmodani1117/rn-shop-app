import React, { useEffect } from 'react'; 
import { Button, FlatList, Platform, Alert, View, Text } from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import HeaderButton from '../../components/UI/HeaderButton';


import ProductItem from '../../components/shop/ProductItem';
import Colors from '../../constants/Colors';
import * as productsActions from '../../store/actions/products';

const UserProductsScreen = props => {

    useEffect(() => {
        props.navigation.setOptions({
            title: 'Your Products',
            headerLeft: () => (
                <HeaderButtons HeaderButtonComponent={HeaderButton}>
                    <Item 
                        title="Menu"
                        iconName={ Platform.OS === 'android' ? 'md-menu' : 'ios-menu' }
                        onPress={()=>{
                            props.navigation.toggleDrawer();
                        }}
                    />
                </HeaderButtons>
            ),
            headerRight: () => (
                <HeaderButtons HeaderButtonComponent={HeaderButton}>
                    <Item 
                        title="Add"
                        iconName={ Platform.OS === 'android' ? 'md-create' : 'ios-create' }
                        onPress={()=>{
                            props.navigation.navigate('EditProduct');
                        }}
                    />
                </HeaderButtons>
            ),
        });
    }, []);

    const dispatch = useDispatch();

    const editProductHandler = (id) => {
        props.navigation.navigate('EditProduct', {productId: id});
    };

    const deleteHandler = ( id ) => {
        // console.log("delete item Id: ", id);
        Alert.alert('Are you sure?', 'Do you really want to delete this item?', [
            {text: 'No', style: 'default'},
            {text: 'Yes', style: 'destructive', onPress: () => {
                dispatch(productsActions.deleteProduct( id ));
            }}
        ]);
    };


    const userProducts = useSelector(state => state.products.userProducts);
    
    if(userProducts.length === 0){
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text> No products found, maybe start creating some? </Text>
            </View>
        );
    }

    return (
        <FlatList 
            data={userProducts} 
            keyExtractor={item => item.id}
            renderItem={itemData => (
                <ProductItem 
                    image={itemData.item.imageUrl}
                    title={itemData.item.title}
                    price={itemData.item.price}
                    onSelect={()=>{ editProductHandler(itemData.item.id) }}
                >
                    <Button 
                        color={Colors.primary} 
                        title="Edit" 
                        onPress={() => {
                            editProductHandler(itemData.item.id);
                        }} 
                    />
                    <Button 
                        color={Colors.primary} 
                        title="Delete" 
                        onPress={() => deleteHandler(itemData.item.id)} 
                        // onPress={deleteHandler.bind(this, itemData.item.id)}  //both works!
                    />
                </ProductItem>
            )}
        />
    );
};

export default UserProductsScreen;
