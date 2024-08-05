import React, { useEffect, useReducer } from 'react';
import { Text, TextInput, StyleSheet, View } from 'react-native';

const INPUT_CHANGE = 'INPUT_CHANGE';
const INPUT_BLUR = 'INPUT_BLUR';

const inputReducer = (state, action) => {
    switch (action.type) {
        case INPUT_CHANGE:
            return {
                ...state,
                value: action.value,
                isValid: action.isValid
            }
        case INPUT_BLUR: 
            return {
                ...state,
                touched: true
            }
        default:
            return state;
    }
};

const Input = props => {

    const [inputState, dispatch] = useReducer(inputReducer, {
        value: props.initialValue ? props.initialValue : '',
        isValid: props.initiallyValid,
        touched: false
    });

    const { onInputChange, id } = props;
    useEffect(() => {
        if (inputState.touched){
            onInputChange(id, inputState.value, inputState.isValid);
        }
    }, [inputState, onInputChange, id]);

    const textChangeHandler = text => {
        const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        const usernameRegex = /^([a-zA-Z][a-zA-Z]{2,13})([ ][a-zA-Z]{1,14})*$/; //first name-> 3 chars atleast. max-14 chars | surname-> optional max-14 chars
        const mobileNoRegex = /^[6789][0-9]{9}$/;  //Indian mobile nos.
        const addressRegex = /^[a-zA-Z0-9\s,'-]{25,49}[a-zA-Z]$/; //atleast 10 chars..  //^([0-9 \,]*[a-zA-Z][ a-zA-Z]{9,})$
        const passwordRegex = /^[a-zA-Z][a-zA-Z0-9_!@#$%^&*]{7,25}$/;
        let isValid = true;
        if (props.required && text.trim().length === 0) {
            isValid = false;
        }
        if (props.email && !emailRegex.test(text.toLowerCase())) {
            isValid = false;
        }
        if (props.username && !usernameRegex.test(text)) {
            isValid = false;
        }
        if (props.mobile && !mobileNoRegex.test(text)) {  
            isValid = false;
        }
        if (props.address && !addressRegex.test(text)) {
            isValid = false;
        }
        if (props.password && !passwordRegex.test(text)) {
            isValid = false;
        }
        if (props.min != null && +text < props.min) {
            isValid = false;
        }
        if (props.max != null && +text > props.max) {
            isValid = false;
        }
        if (props.minLength != null && text.length < props.minLength) {
            isValid = false;
        }

        dispatch({ type: INPUT_CHANGE, value: text, isValid: isValid });
    };

    const lostFocusHandler = () => {
        dispatch({ type: INPUT_BLUR });
    }

    return (
        <View style={styles.formControl} >
            <Text style={styles.label} >{props.label}</Text>
            <TextInput
                {...props}
                style={styles.input}
                value={inputState.value}
                onChangeText={textChangeHandler}
                onBlur={lostFocusHandler}
            />
            { !inputState.isValid && inputState.touched && (
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>
                        {props.errorText}
                    </Text>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    formControl: {
        width: '100%'
    },
    label: {
        fontFamily: '', //open-sans-bold
        marginVertical: 8
    },
    input: {
        paddingHorizontal: 2,
        paddingVertical: 5,
        borderBottomColor: '#ccc',
        borderBottomWidth: 1
    },
    errorContainer: {
        marginVertical: 5,
    },
    errorText: {
        // fontFamily: '' // 'open-sans'
        color: 'red',
        fontSize: 13
    }
});

export default Input;