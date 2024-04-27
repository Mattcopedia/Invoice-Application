import React, {useEffect, useState} from 'react';
import auth from '@react-native-firebase/auth';
import { LoginManager, AccessToken } from 'react-native-fbsdk-next';

import { GoogleSignin } from '@react-native-google-signin/google-signin'; 
import {Alert, SafeAreaView, Text, TouchableOpacity} from 'react-native';
import Button from '../../../components/Button';
import Input from '../../../components/Input';
import Title from '../../../components/Title'; 
import styles from './styles';  
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/AntDesign';
import colors from '../../../constants/colors';

const Signin = () => {
  const navigation = useNavigation();  

  const [values, setValues] = useState({});

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



  const onSubmit = () => { 
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
      <Title>Welcome back!</Title>

      <Input
        placeholder="Email"
        keyboardType="email-address"
        onChangeText={val => onChange(val, 'email')}
      />
      <Input
        placeholder="Password"
        secureTextEntry
        onChangeText={val => onChange(val, 'password')} 
      />

      <Button onPress={onSubmit}>Login</Button>


      {/* Google Oauth */}
      
      <TouchableOpacity style={styles.containerIcon} onPress={onGoogleButtonPress}>
      <Icon size={25}  color={colors.black} name="google" style={styles.loginText} /> 
      <Text style={styles.IconText}>Login with Google</Text>  
        </TouchableOpacity>  

     <TouchableOpacity style={styles.containerIcon} onPress={() => onFacebookButtonPress()}> 
      <Icon size={25}  color={colors.black} name="facebook-square" style={styles.loginText} /> 
      <Text style={[styles.IconText, styles.IconFaceBookText ]}>Login with Facebook</Text>  
        </TouchableOpacity>     
      
      <Text style={styles.footerText}> 
        Not Registered?
        <Text
          onPress={() => navigation.navigate('Signup')}
          style={styles.footerLink}>
          {' '}
          Sign up!
        </Text>
      </Text>
    </SafeAreaView>
  );
};

export default React.memo(Signin);
