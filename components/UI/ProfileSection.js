import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StyleSheet, View, Text } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import Colors from '../../constants/Colors';
import authActions from '../../store/actions/auth';


const ProfileSection = props => {

    const [usrname, setUsrname] = useState("");
    const [phone, setPhone] = useState("");

    // let usrname = "xyz";
    // let phone = "123";
    useEffect(() => {
        loadUserInfo();
    });
    loadUserInfo = async () => {
        const usrData = await AsyncStorage.getItem('userData');
        const transformedData = JSON.parse(usrData);
        if (transformedData) {
            const { username, mobile } = transformedData;
            // usrname = username;
            // phone = mobile;
            setUsrname(username);
            setPhone(mobile);
            // console.log("usrname ===> ", usrname);
            // console.log("phone ===> ", phone);
        }
    }
    // console.log("usrname1 ===> ", usrname);
    // console.log("phone1 ===> ", phone);

    // const username = useSelector(state => state.auth.username);
    // const address = useSelector(state => state.auth.address);
    // const mobile = useSelector(state => state.auth.mobile);


    const date = new Date();
    const currentHour = date.getHours();

    let greet = '';
    if (currentHour >= 0 && currentHour < 12) {
        greet = 'Good Morning,';
    }
    else if (currentHour >= 12 && currentHour < 16) {
        greet = 'Good Afternoon,';
    }
    else if (currentHour >= 16 && currentHour <= 23) {
        greet = 'Good Evening,';
    }

    return (
        <View style={styles.profileArea}>

            <View style={styles.nameWraper} >
                <Text style={styles.greeting} >{greet}</Text>
                <Text style={styles.name} >{usrname.split(' ')[0]}</Text>
            </View>

            <View style={styles.mobileWraper}>
                <Text style={styles.mobile} >{phone}</Text>
            </View>

        </View>
    );
}

const styles = StyleSheet.create({
    profileArea: {
        // backgroundColor: 'black',
        minHeight: '15%',
        color: 'white',
        padding: 10,
        maxHeight: '21%',
        justifyContent: 'space-between'
    },
    greeting: {
        color: Colors.primary,
        fontSize: 19,
        fontFamily: 'nunito-regular'
    },
    nameWraper: {
        marginBottom: 10,
    },
    name: {
        color: Colors.primary,
        fontSize: 25,
        fontFamily: 'nunito-semi-bold',
        marginTop: 3
    },
    mobileWraper: {
        // flexDirection:'column', //by default
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
    },
    mobile: {
        color: Colors.primary,
        fontSize: 12,
        fontFamily: 'nunito-regular',
        padding: 3,
        paddingRight: 6
    }

});

export default ProfileSection;