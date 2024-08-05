import React from 'react';
import { StyleSheet, View, Text, Dimensions, TouchableOpacity, TouchableWithoutFeedback, Modal } from 'react-native';

const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;

const CustomModal = props => {
    return (

        <Modal {...props}>
            <TouchableOpacity style={styles.modalCentered} onPress={props.overlayClick}>
                <TouchableWithoutFeedback>
                    <View style={{ ...styles.modal, ...props.style }}>
                        {props.children}
                    </View>
                </TouchableWithoutFeedback>
            </TouchableOpacity>
        </Modal>

    );
}

const styles = StyleSheet.create({
    modalCentered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.6)'
    },
    modal: {
        width: WIDTH - WIDTH/4 + 20,
        height: HEIGHT / 2,
        backgroundColor: 'white',
        borderRadius: 10,
        // justifyContent: 'center',
        // alignItems: 'center',
        // paddingTop: 8,
        // paddingBottom: 8,
    },
});

export default CustomModal;