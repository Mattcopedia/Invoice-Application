import React from 'react';
import {TextInput} from 'react-native';
import styles from './styles';
import colors from '../../constants/colors';

const PasswordInput = ({showText,...props}) => {
  return (
    <TextInput
      placeholderTextColor={colors.midGrey} 
      style={[styles.passwordInput, showText ?  styles.showText : {}]}
      {...props} 
    />  
  );
};

export default React.memo(PasswordInput);
  