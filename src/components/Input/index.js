import React from 'react';
import {TextInput} from 'react-native';
import styles from './styles';
import colors from '../../constants/colors';

const Input = ({outlined,showText, textBox, ...props}) => {
  return (
    <TextInput
      placeholderTextColor={colors.midGrey} 
      style={[styles.input1, outlined ? styles.outlined : {}, showText ? styles.showText : {},  textBox ? styles.textBox : {} ]}
      {...props} 
    /> 
  );
};

export default React.memo(Input);
 