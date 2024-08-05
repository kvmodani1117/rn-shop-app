import React, { useState, useEffect, useReducer, useCallback } from 'react';
import {
    ScrollView,
    View,
    Button,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    ActivityIndicator,
    Alert
} from 'react-native';
import Card from '../../components/UI/Card';
import Input from '../../components/UI/Input';
import Colors from '../../constants/Colors';
import { LinearGradient } from 'expo-linear-gradient';
import { useDispatch } from 'react-redux';
import * as authActions from '../../store/actions/auth';

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



const AuthScreen = props => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState();
    const [isSignupMode, setIsSignupMode] = useState(false);
    const dispatch = useDispatch();


    const [formState, dispatchFormState] = useReducer(formReducer, {
        inputValues: {    //Modified
            username: '',
            mobile: '',
            address: '',
            email: '',
            password: ''
        },
        inputValidities: {
            username: false,
            mobile: false,
            address: false,
            email: false,
            password: false
        },
        formIsValid: false
    });


    useEffect(() => {
        if (error) {
            Alert.alert('An error occured', error, [{ text: 'Okay' }]);
        }
        
    }, [error]);


    const authHandler = async () => {
        let action;
        if (isSignupMode) {
            action = await authActions.signup(
                formState.inputValues.username,
                formState.inputValues.mobile,
                formState.inputValues.address,
                formState.inputValues.email,
                formState.inputValues.password
            );
        }
        else {
            action = await authActions.login(
                formState.inputValues.email,
                formState.inputValues.password
            );
        }
        setError(null);
        setIsLoading(true);
        try {
            await dispatch(action);
            //props.navigation.navigate('Shop');
        } catch (err) {
            setError(err.message);
            setIsLoading(false);
        }
    };


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


    return (
        <KeyboardAvoidingView
            style={styles.screen}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
            <LinearGradient colors={['#ffedff', '#ffe3ff']} style={styles.gradient} >
                <Card style={styles.authContainer}>
                    <ScrollView showsVerticalScrollIndicator={false} >
                        {isSignupMode ? (  //Modified
                            <View>
                                <Input
                                    id="username"
                                    label="Username"
                                    placeholder="eg. John Doe"
                                    username
                                    keyboardType='default'
                                    required
                                    autoCapitalize="none"
                                    errorText="Firstname must be 3-14 characters long, if you add Surname, please make sure it is space separated."
                                    onInputChange={inputChangeHandler}
                                    initialvalue=""
                                />

                                <Input
                                    id="mobile"
                                    label="Mobile No."
                                    placeholder="eg. 9876503214"
                                    keyboardType='decimal-pad'
                                    required
                                    mobile
                                    autoCapitalize="none"
                                    errorText="Please enter a valid 10 digit mobile no."
                                    onInputChange={inputChangeHandler}
                                    initialvalue=""
                                />

                                <Input
                                    id="address"
                                    label="Address"
                                    placeholder="eg. 120, Park Ville Society, GIDC colony, Umb"
                                    keyboardType='default'
                                    required
                                    address
                                    autoCapitalize="none"
                                    errorText="Address should be 25-50 characters long"
                                    onInputChange={inputChangeHandler}
                                    initialvalue=""
                                />
                            </View>) : null}
                        <Input
                            id="email"
                            label="E-Mail"
                            placeholder="eg. johndoe@gmail.com"
                            keyboardType='email-address'
                            required
                            email
                            autoCapitalize="none"
                            errorText="Please enter a valid email address."
                            onInputChange={inputChangeHandler}
                            initialvalue=""
                        />
                        <Input
                            id="password"
                            label="Password"
                            placeholder="eg. John123"
                            password
                            keyboardType='default'
                            secureTextEntry
                            required
                            minLength={5}
                            autoCapitalize="none"
                            errorText="Password length should be minimum 8 characters long."
                            onInputChange={inputChangeHandler}
                            initialvalue=""
                        />
                        <View style={styles.buttonContainer}>
                            {isLoading ? (
                                <ActivityIndicator size='small' color={Colors.primary} />
                            ) : (
                                <Button
                                    title={isSignupMode ? 'Sign Up' : 'Login'}
                                    color={Colors.primary}
                                    onPress={authHandler}
                                />
                            )}
                        </View>
                        <View style={styles.buttonContainer}>
                            <Button
                                title={`Switch to ${isSignupMode ? 'Login' : 'Sign Up'} `}
                                color={Colors.accent}
                                onPress={() => {
                                    setIsSignupMode(prevState => !prevState);
                                }}
                            />
                        </View>
                    </ScrollView>
                </Card>
            </LinearGradient>
        </KeyboardAvoidingView>
    );
};

export const screenOptions = {
    headerTitle: 'Authenticate'
};

const styles = StyleSheet.create({
    screen: {
        flex: 1,
    },
    gradient: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    authContainer: {
        width: '80%',
        maxWidth: 400,
        maxHeight: 450,
        padding: 20
    },
    buttonContainer: {
        marginTop: 10,
    }
});

export default AuthScreen;
