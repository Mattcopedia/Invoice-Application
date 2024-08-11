import React, {useEffect, useState} from 'react';
import auth from '@react-native-firebase/auth';
import {Alert, Pressable, SafeAreaView, Text, Touchable, TouchableOpacity, View} from 'react-native';
import Button from '../../../components/Button';
import Input from '../../../components/Input'; 
import Title from '../../../components/Title'; 
import styles from './styles';  
 
const ForgotPassword = () => { 

  const [email, setEmail] = useState("");

  const resetPassword = () => { 
    console.log(email)
    if (email) {
      auth()
        .sendPasswordResetEmail(email)
        .then(() => {
          Alert.alert('Password reset email has been sent successfully');
        })
        .catch(error => {
          console.error(error.message); 
          Alert.alert(error.message);
        }); 
    } else {
      Alert.alert('Please enter a valid email');
    }
  }; 
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.space}></View>
      <Title>Forgot Password?</Title>
       <Text style={styles.footerCol}>Please enter your email address and we'll send a password reset link to your mail.
         Also ensure to check your spam folder</Text>
      <Input
        placeholder="Email"
        keyboardType="email-address" 
        onChangeText={setEmail}
      />

      <Button onPress={resetPassword}>Send Email</Button>

    </SafeAreaView>
  );
};

export default React.memo(ForgotPassword);
