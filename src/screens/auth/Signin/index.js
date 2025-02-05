import React, {useEffect, useState} from 'react';
import auth from '@react-native-firebase/auth';
import { LoginManager, AccessToken } from 'react-native-fbsdk-next';

import { GoogleSignin } from '@react-native-google-signin/google-signin'; 
import {Alert, Pressable, SafeAreaView, Text, Touchable, TouchableOpacity, View} from 'react-native';
import Button from '../../../components/Button';
import Input from '../../../components/Input'; 
import Title from '../../../components/Title'; 
import styles from './styles';  
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/AntDesign';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons'; 
import colors from '../../../constants/colors';
import { useDispatch } from 'react-redux';
import { setGoogleUser } from '../../../store/invoices';
import PasswordInput from '../../../components/PasswordInput/PasswordInput';
 
const Signin = () => { 
  const navigation = useNavigation();  
  const dispatch = useDispatch(); 
  const [values, setValues] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    GoogleSignin.configure({
      webClientId: '737466915635-s0gn45s0f4no2nuecnq1cier7qndflnp.apps.googleusercontent.com',
    });
  
  }, []); 
 
  const onChange = (value, key) => {
    setValues(vals => ({
      ...vals,
      [key]: value, 
    }));
  };

  async function onGoogleButtonPress() {
    try {
      // Check if your device supports Google Play
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
      // Prompt the user to select a Google account
      await GoogleSignin.signOut();
      const { idToken, user } = await GoogleSignin.signIn(); 
      console.log(idToken, user);
      dispatch(setGoogleUser(user));   
      // Create a Google credential with the token
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);
      // Sign-in the user with the credential
      return auth().signInWithCredential(googleCredential);
    } catch (error) {
      console.log(error); 
    }
  }
  


  
async function onFacebookButtonPress() {

  // Attempt login with permissions
  const result = await LoginManager.logInWithPermissions(['public_profile', 'email']);

  if (result.isCancelled) {
    throw 'User cancelled the login process';
  }

  // Once signed in, get the users AccessToken
  const data = await AccessToken.getCurrentAccessToken();

  if (!data) {
    throw 'Something went wrong obtaining access token';
  }
  
  console.log(data)
  // Create a Firebase credential with the AccessToken
  const facebookCredential = auth.FacebookAuthProvider.credential(data.accessToken);
 
  console.log(facebookCredential)
  // Sign-in the user with the credential 
  return auth().signInWithCredential(facebookCredential);
}


const togglePasswordVisibility = () => {
  setShowPassword(!showPassword);
};


  const onSubmit = () => { 
    if(values?.email?.trim() === "" || values?.password?.trim() === "" || !values.email || !values.password) {
      Alert.alert('Please complete the login form');
      return;
    }

    auth()
      .signInWithEmailAndPassword(values.email, values.password)
      .then(() => {
        console.log('User signed in!');
      }) 
      .catch(error => { 
        if (error.code === 'auth/email-already-in-use') {
          Alert.alert('That email address is already in use!');
        } else if (error.code === 'auth/invalid-email') {
          Alert.alert('That email address is invalid!');
        } else {
          Alert.alert(error.message);
        }   
      });
      // navigation.navigate('Home') 
  };

  

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.space}></View>
      <Title>Welcome back!</Title>

      <Input
        placeholder="Email"
        keyboardType="email-address"
        onChangeText={val => onChange(val, 'email')}
      />
     
     <View style={styles.passwordContainer}>
      <PasswordInput 
        placeholder="Password"
        secureTextEntry={!showPassword} 
        onChangeText={val => onChange(val, 'password')} 
      />
        <TouchableOpacity onPress={togglePasswordVisibility} style={styles.eyeIcon}>
          <MaterialIcon
            name={showPassword ? 'eye-off' : 'eye'}
            size={24}
            color={colors.black}
          /> 
        </TouchableOpacity>
     </View>
      <Button onPress={onSubmit}>Login</Button>


      {/* Google Oauth */}
      
      <TouchableOpacity style={styles.containerIcon} onPress={onGoogleButtonPress}>
      <Icon size={25}  color={colors.black} name="google" style={styles.loginText} /> 
      <Text style={styles.IconText}>Login with Google</Text>  
        </TouchableOpacity>     
       
       <View>
      <Text style={styles.footerText}> 
        Not Registered?
        <Text 
          onPress={() => navigation.navigate('Signup')}
          style={styles.footerLink}>
          {' '}
          Sign up!
        </Text> 
      </Text>
      <Pressable onPress={() => navigation.navigate("ForgotPassword")}>
       <Text  style={styles.footerCol} >Forgot your password?</Text> 
       </Pressable>
      </View> 
     
    </SafeAreaView>
  );
};

export default React.memo(Signin);
