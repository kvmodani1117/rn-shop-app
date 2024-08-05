import React, { useEffect, useCallback, useReducer, useState } from 'react';
import {
    Alert,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
    KeyboardAvoidingView,
    ActivityIndicator
} from 'react-native';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import HeaderButton from '../../components/UI/HeaderButton';
import { useSelector, useDispatch } from 'react-redux';
import * as productsActions from '../../store/actions/products';
import Input from '../../components/UI/Input';
import Colors from '../../constants/Colors';

const FORM_INPUT_UPDATE = 'FORM_INPUT_UPDATE';

const formReducer = (state, action) => {
    if (action.type === FORM_INPUT_UPDATE) {
        const updatedValues = {
            ...state.inputValues,
            [action.input]: action.value
        };
        const updatedValidities = {
            ...state.inputValidities,
            [action.input]: action.isValid
        };
        let updatedFormIsValid = true;
        for (const key in updatedValidities) {
            updatedFormIsValid = updatedFormIsValid && updatedValidities[key];
        }
        return {
            formIsValid: updatedFormIsValid,
            inputValues: updatedValues,
            inputValidities: updatedValidities
        };
    }
    return state;
};

const EditProductScreen = props => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState();

    const productId = props.route.params?.productId; //In case, if trying to get productId, 
    //but it is not present in params, it will return you undefined. 
    const editedProduct = useSelector(state =>  // If 'editedProduct' is set, We're in 'Edit mode', else we're in 'Add mode'

        state.products.userProducts.find(prod => prod.id === productId)

    );

    const [formState, dispatchFormState] = useReducer(formReducer, {
        inputValues: {
            title: editedProduct ? editedProduct.title : '',
            imageUrl: editedProduct ? editedProduct.imageUrl : '',
            description: editedProduct ? editedProduct.description : '',
            price: ''
        },
        inputValidities: {
            title: editedProduct ? true : false,
            imageUrl: editedProduct ? true : false,
            description: editedProduct ? true : false,
            price: editedProduct ? true : false,
        },
        formIsValid: editedProduct ? true : false
    });

    useEffect(() => {
        if (error) {
            Alert.alert('An error occured!', error, [{ text: 'Okay' }]);
        }
    }, [error]);

    const dispatch = useDispatch();

    const submitHandler = useCallback(async () => {
        // console.log("props----> ", props.navigation);
        if (!formState.formIsValid) {
            Alert.alert('Wrong Input!', 'Please check the errors in the form.', [
                { text: 'Okay' }
            ]);
            return;
        }
        setError(null);
        setIsLoading(true);
        try {
            if (editedProduct) {
                await dispatch(
                    productsActions.updateProduct(
                        productId,
                        formState.inputValues.title,
                        formState.inputValues.imageUrl,
                        formState.inputValues.description
                    )
                );
            }
            else {
                await dispatch(
                    productsActions.createProduct(
                        formState.inputValues.title,
                        formState.inputValues.imageUrl,
                        formState.inputValues.description,
                        +formState.inputValues.price
                    )
                );
            }
            props.navigation.goBack();
        } catch (err) {
            setError(err.message);
        }

        setIsLoading(false);

    }, [dispatch, productId, formState]);

    useEffect(() => {
        const submit = props.route.params?.submit;
        // console.log("submit-->", submit);
        props.navigation.setOptions({
            headerTitle: productId ? 'Edit Product' : 'Add Product',
            headerRight: () => (
                <HeaderButtons HeaderButtonComponent={HeaderButton}>
                    <Item
                        title="Save"
                        iconName={Platform.OS === 'android' ? 'md-checkmark' : 'ios-checkmark'}
                        onPress={submitHandler}
                    />
                </HeaderButtons>
            ),
        });
    }, [submitHandler]);

    const inputChangeHandler = useCallback(
        (inputIdentifier, inputValue, inputValidity) => {
            dispatchFormState({
                type: FORM_INPUT_UPDATE,
                value: inputValue,
                isValid: inputValidity,
                input: inputIdentifier
            });
        },
        [dispatchFormState]
    );


    if (isLoading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size='large' color={Colors.primary} />
            </View>
        );
    }

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
        // keyboardVerticalOffset={0}
        >
            <ScrollView>
                <View style={styles.form} >
                    <Input
                        id='title'
                        label="Title"
                        errorText="Please enter a valid title!"
                        keyboardType='default'
                        autoCapitalize='sentences'
                        autoCorrect
                        returnType="next"
                        onInputChange={inputChangeHandler}
                        initialValue={editedProduct ? editedProduct.title : ''}
                        initiallyValid={!!editedProduct}
                        required
                    />
                    <Input
                        id='imageUrl'
                        label="Image Url"
                        errorText="Please enter a valid image url!"
                        keyboardType='default'
                        returnType="next"
                        onInputChange={inputChangeHandler}
                        initialValue={editedProduct ? editedProduct.imageUrl : ''}
                        initiallyValid={!!editedProduct}
                        required
                    />
                    {editedProduct ? null : (
                        <Input
                            id='price'
                            label="Price"
                            errorText="Please enter a valid price!"
                            keyboardType='decimal-pad'
                            returnType="next"
                            onInputChange={inputChangeHandler}
                            required
                            min={0.1}
                        />
                    )}
                    <Input
                        id='description'
                        label="Description"
                        errorText="Please enter a valid description!"
                        keyboardType='default'
                        autoCapitalize='sentences'
                        autoCorrect
                        multiline
                        numberOfLines={3}
                        onInputChange={inputChangeHandler}
                        initialValue={editedProduct ? editedProduct.description : ''}
                        initiallyValid={!!editedProduct}
                        required
                        minLength={5}
                    />
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    form: {
        margin: 20,
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
});

export default EditProductScreen;