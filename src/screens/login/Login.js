import React, { useEffect, useRef, useState } from 'react'
import {
    Image, ImageBackground, StyleSheet, Text, View, TextInput,
    TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, Keyboard, Alert, ActivityIndicator

} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import ratios from '../../styles/ratios';
import { useNavigation } from '@react-navigation/native';
import ErrorHandler from '../../components/ErrorHandler';
import MainButton from '../../components/mainButton/MainButton';
import Icon from "react-native-vector-icons/Feather"

let {
    widthPixel,
    heightPixel,
    fontPixel,
    pixelSizeVertical,
    pixelSizeHorizontal,
} = ratios



const Login = () => {

    const [showPassword, setShowPassword] = useState(false);
    const [hidePassword, setHidePassword] = useState(true);

    const navigation = useNavigation()


    // backend
    // ab yaha ham use details se login krwaty hai jo signup me krwaya 
    // ap  yaha be hamy same fdata lena hai 
    const [fdata, setFdata] = useState({
        email: "",
        password: ""
    })

    // eske bad ap 1 error msg bana lo
    const [errormsg, setErrormsg] = useState(null);
    //  mtlb agr user exist nai krta to error dekhayenge na


    const [loading, setLoading] = useState(false);

    const [emailError, setEmailError] = useState('');


    const validateEmail = (email) => {
        // Regular expression for email validation
        // const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

        const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;


        if (!emailRegex.test(email)) {
            setEmailError('Invalid email address');
            return false;
        } else {
            setEmailError('');
            return true;
        }
    };



    const [passwordError, setPasswordError] = useState('');

    // Function to validate password length
    const validatePassword = (password) => {
        if (password.length < 6) {
          setPasswordError('Password must be at least 6 characters long');
          return false;
        } else {
          setPasswordError('');
          return true;
        }
      };
    





    const sendToBackend = () => {
        // console.log(fdata);
        // ab log lagane se pata chal gya ke data hamary pass araha hai 
        // to ab ham esme conditions lga denge 
        // yani hame check krna he ke agr email or password nai hai to phr 1 error dekhao ke all fields
        // are required 

        if (fdata.email === "" || fdata.password === "") {
            setErrormsg("All fields are Required");
            // error hamne set to kr deya ab ise dekhana be prega to signup se copy kr lenge
            return;
        }

        if (!validateEmail(fdata.email)) {
            return; // Stop execution if email is invalid
        }


           // Password length validation
    if (!validatePassword(fdata.password)) {
        return; // Stop execution if password is invalid
      }
  


        // ab agr empty nai hai data to else wala 
        else {
            setLoading(true)
            fetch("https://women-safety-app-backend-production.up.railway.app/signin", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(fdata),
            })
                .then(res => res.json())
                .then(
                    async data => {
                        if (data.error) {
                            setLoading(false)
                            setErrormsg('Invalid credentials');

                            setErrormsg(data.error)
                        }
                        else if (data.message === "Successfully Signed In") {
                            setLoading(false)

                            Alert.alert("Logged Successfully")

                            // agr hamne local storage me login information save krwani ho async storage
                            // is ke ander me user da data store krwana chahta hun
                            await AsyncStorage.setItem("user", JSON.stringify(data))

                                .catch(e => {
                                    console.log(e);
                                });
                            navigation.navigate("XplafesList", { data })
                        }
                    }
                )
                .catch(err => {
                    setLoading(false)
                    console.log(err);
                    Alert.alert("Server Error")
                })
        }


    }




    const scrollViewRef = useRef(null);

    useEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener(
            'keyboardDidShow',
            _keyboardDidShow
        );
        const keyboardDidHideListener = Keyboard.addListener(
            'keyboardDidHide',
            _keyboardDidHide
        );

        return () => {
            keyboardDidShowListener.remove();
            keyboardDidHideListener.remove();
        };
    }, []);

    const _keyboardDidShow = () => {
        scrollViewRef.current.scrollTo({ y: 220, animated: true });
        // setHeightTop(260);
    };

    const _keyboardDidHide = () => {
        // setHeightTop(30);
    };


    // Second method of loading
    if (loading) {
        return (
            <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <ActivityIndicator size="large" color="red" />
            </View>
        );
    }





    const passwordHandler = () => {
        setShowPassword(!showPassword)
    }


    return (


        <ScrollView style={[styles.container,]}>

            <KeyboardAvoidingView style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <ScrollView style={{ flex: 1 }}
                    ref={scrollViewRef}
                >
                    <Image
                        style={{ borderRadius: 30, position: 'absolute', width: "100%", height: "100%", top: 0, zIndex: -1 }}
                        // resizeMode="contain"
                        source={require("../../assets/images/register.png")}
                    />
                    <View style={styles.textContainer}>
                        <View style={styles.container1}>
                            <Text style={styles.login}>Login</Text>
                        </View>

                        {/* yaha me ab error dekha deta hun agr user sara khush ni fill krta to */}
                        {
                            // errormsg ? <ErrorHandler title="All fields are Required" /> : null
                            errormsg && <ErrorHandler title={errormsg} />

                        }


                        <View style={styles.container2}>
                            <Text style={styles.email}>Email</Text>
                        </View>

                        <View style={styles.inputContainer}>
                            <TextInput
                                placeholder='Enter your email'
                                placeholderTextColor="#FFECD0"
                                style={[styles.input, styles.email]}

                                onChangeText={(text) => setFdata({ ...fdata, email: text.toLowerCase() })}

                                onPressIn={() => {
                                    setErrormsg(null);
                                    setEmailError(''); // Clear email validation error

                                }
                                }
                            />
                        </View>

{/* Display email validation error */}
{emailError ? (
  <Text style={styles.errorText}>{emailError}</Text>
) : null}



                        <View style={{ marginTop: heightPixel(19) }}>
                            <View style={styles.container2}>
                                <Text style={styles.email}>Password</Text>
                            </View>

                            <View style={styles.inputContainer}>
                                <TextInput
                                    placeholder='Enter your password'
                                    placeholderTextColor="#FFECD0"
                                    style={[styles.input, styles.email]}

                                    onChangeText={(text) => setFdata({ ...fdata, password: text })}

                                    // secureTextEntry={true}
                                    // for password 
                                    secureTextEntry={!showPassword}


                                    onPressIn={() => {
                                        setErrormsg(null)
                                        setPasswordError(''); // Clear password validation error

                                    }}
                                />

                                <TouchableOpacity onPress={passwordHandler} style={{ position: 'absolute', right: 10, top: 8, }}>
                                    {
                                        showPassword ?
                                            <Icon name='eye' size={20} color="#FFECD0" />

                                            :
                                            <Icon name='eye-off' size={20} color="#FFECD0" />

                                    }
                                </TouchableOpacity>
                            </View>

                              {/* Display password validation error */}
            {passwordError ? (
              <Text style={styles.errorText}>{passwordError}</Text>
            ) : null}


                        </View>


                    </View>
                    {/* </ImageBackground> */}

                    <View style={styles.forgotContainer}>
                        <TouchableOpacity
                            onPress={() => navigation.navigate("ForgotPassword")}
                        >
                            <Text style={styles.forgotButton}>Forgot Password?</Text>
                        </TouchableOpacity>
                    </View>


                    {/* {loading ? <ActivityIndicator size={'large'} color="red" /> : */}

                    <View style={styles.imageContainer}>
                        {/* <Image
                            style={{ width: widthPixel(45), height: heightPixel(45) }}
                            source={require("../../assets/images/google-logo.png")}
                        />
                        <Image
                            style={{ width: widthPixel(45), height: heightPixel(45) }}
                            source={require("../../assets/images/fb-logo.png")}
                        />
                        <Image
                            style={{ width: widthPixel(45), height: heightPixel(45) }}
                            source={require("../../assets/images/apple-logo.png")}
                        /> */}
                    </View>

                    {/* } */}


                    <View style={styles.registerButtonContainer}>
                        <Text style={styles.newHere}>New Here?</Text>
                        <TouchableOpacity
                            onPress={() => navigation.navigate("Register")}
                        >
                            <Text style={styles.register}> Register</Text>
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity style={{ marginBottom: 27 }} onPress={() => sendToBackend()}>
                        <MainButton title="Login" />
                    </TouchableOpacity>

                    {/* <View style={styles.button}>
                        <TouchableOpacity
                            onPress={() => sendToBackend()}
                        >
                            <Text style={styles.loginButton}>Login</Text>
                        </TouchableOpacity>
                    </View> */}
                </ScrollView>

            </KeyboardAvoidingView>
        </ScrollView>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        // backgroundColor: "red",
        backgroundColor: "#FF3974",
        borderRadius: 30,
        width: "100%",
        height: "100%",
    },
    textContainer: {
        // top: "65%",
        // position: 'absolute',

    },
    container1: {
        // flex: 0.2,
        // backgroundColor: "green",
        // width:widthPixel(338),
        // height:heightPixel(67),
        left: 21,
        bottom: 20,
        marginTop: heightPixel(396),

    },
    login: {
        color: "#FFECD0",
        fontFamily: "Nunito-ExtraBold",
        fontSize: fontPixel(36),

    },
    email: {
        color: "#FFECD0",
        fontFamily: "Nunito-Regular",
        fontSize: fontPixel(14),
        // backgroundColor: "green",

    },
    inputContainer: {
        marginHorizontal: widthPixel(25),
        height: widthPixel(40),
        width: widthPixel(309)
        // width:"75%"
    },
    input: {
        borderWidth: 1,
        borderColor: "#FFECD0",
        borderRadius: 10,
        // paddingHorizontal: widthPixel(10),
        padding: widthPixel(10)

    },
    container2: {
        // flex: 1,
        // backgroundColor:"yellow",
        left: 25,
        marginBottom: heightPixel(2)

    },
    forgotContainer: {
        // backgroundColor: "red",
        marginRight: widthPixel(75),
        alignItems: 'flex-end',
        // marginLeft: widthPixel(217),
        marginTop: heightPixel(13)
    },
    forgotButton: {
        color: "#FFECD0",
        fontFamily: "Nunito-Bold",
        fontSize: fontPixel(14),
        // backgroundColor: "blue",
    },
    imageContainer: {
        flexDirection: 'row',
        marginLeft: widthPixel(25)
    },
    registerButtonContainer: {
        flexDirection: 'row',
        marginTop: heightPixel(74),
        marginLeft: widthPixel(34)
    },
    newHere: {
        color: "#FFECD0",
        fontFamily: "Nunito-Regular",
        fontSize: fontPixel(16),
        // backgroundColor: "green",
    },
    register: {
        color: "#FFECD0",
        fontFamily: "Nunito-Bold",
        fontSize: fontPixel(16),
        // backgroundColor: "gray",
    },
    button: {
        // alignItems: 'flex-end',
        backgroundColor: "#FFECD0",
        width: widthPixel(144),
        height: heightPixel(60),
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 7,
        marginHorizontal: widthPixel(30),
        alignSelf: 'flex-end',
        marginTop: -41,
    },
    loginButton: {
        color: "#372329",
        fontFamily: "Nunito-Italic",
        fontSize: fontPixel(24),
    },

    errorText:{
        marginLeft: 30,
        width:"70%",
        marginTop: 5,
        color: "red",
        backgroundColor: "white",
        textAlign: 'center',
        borderRadius: 10,
        fontSize: 15
    }

})




export default Login;
