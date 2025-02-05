import React, {useState} from 'react';
import {
  Alert,
  Linking,
  SafeAreaView,
  ScrollView, 
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Button from '../../../components/Button';
import Checkbox from '../../../components/Checkbox';
import Input from '../../../components/Input';
import Title from '../../../components/Title';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons'; 
import { 
  PRIVACY_POLICY_LINK, 
  TERMS_CONDITIONS_LINK,
} from '../../../constants/links';
import styles from './styles';
import colors from '../../../constants/colors';
import PasswordInput from '../../../components/PasswordInput/PasswordInput';

const Signup = ({navigation}) => {
  const [agreed, setAgreed] = useState(false);
  const [values, setValues] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const onCheckboxPress = () => {
    setAgreed(value => !value);
  };

  const onLinkPress = url => {
    Linking.openURL(url);
  };

  const onChange = (value, key) => {
    setValues(vals => ({
      ...vals,
      [key]: value,
    }));
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };


  const onSubmit = () => {
    if(values?.email?.trim() === "" || values?.password?.trim() === "" || !values.email || !values.password
  ||  values?.first_name?.trim() === "" || !values.first_name || values?.last_name?.trim() === "" || !values.last_name
 || values?.confirm_password?.trim() === "" || !values.confirm_password
  ) {  
      Alert.alert('Please complete the sign up form') 
      return;
    }

    if (!values.first_name || !values.last_name) {
      Alert.alert('Please enter first name and last name');
      return;
    }
    if (values.password !== values.confirm_password) {
      Alert.alert('Passwords do not match');
      return;
    }
    if (!agreed) {
      Alert.alert('You should agree to the terms');
      return;
    }

    auth()
      .createUserWithEmailAndPassword(values.email, values.password)
      .then(() => {
        auth().currentUser.updateProfile({
          displayName: `${values.first_name} ${values.last_name}`,
        });
      })
      .catch(error => {
        if (error.code === 'auth/email-already-in-use') {
          Alert.alert('That email address is already in use!');
        }

        if (error.code === 'auth/invalid-email') {
          Alert.alert('That email address is invalid!');
        }

        console.error(error);
      });
      // navigation.navigate('Home')  

      
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
      <View style={styles.space}></View>
        <Title>Join the ride!</Title> 

        <Input
          onChangeText={val => onChange(val, 'first_name')}
          placeholder="First Name"
        />
        <Input
          onChangeText={val => onChange(val, 'last_name')}
          placeholder="Last Name"
        />
        <Input
          onChangeText={val => onChange(val, 'email')}
          placeholder="Email"
          keyboardType="email-address"
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

     <View style={styles.passwordContainer}>
      <PasswordInput 
          placeholder="Confirm Password"
          secureTextEntry={!showConfirmPassword} 
        onChangeText={val => onChange(val, 'confirm_password')}
        showText
      />
        <TouchableOpacity onPress={toggleConfirmPasswordVisibility} style={styles.eyeIcon}>
          <MaterialIcon
            name={showConfirmPassword ? 'eye-off' : 'eye'}
            size={24}
            color={colors.black}
          /> 
        </TouchableOpacity>
     </View>


        <View style={styles.row}>
          <Checkbox checked={agreed} onChange={onCheckboxPress} />

          <Text style={styles.agreeText}>
            I agree to
            <Text
              style={styles.link}
              onPress={() => onLinkPress(TERMS_CONDITIONS_LINK)}>
              {' '}
              Terms and Conditions
            </Text>{' '}
            and
            <Text
              style={styles.link}
              onPress={() => onLinkPress(PRIVACY_POLICY_LINK)}>
              {' '}
              Privacy Policy
            </Text>
          </Text>
        </View>

        <Button onPress={onSubmit} type="blue">
          Create new account
        </Button>

        <Text style={styles.footerText}>
          Already Registered?
          <Text
            onPress={() => navigation.navigate('Signin')}
            style={styles.footerLink}>
            {' '}
            Sign in!
          </Text>
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
};

export default React.memo(Signup);
