import React from 'react';
import {Pressable, View} from 'react-native';
import styles from './styles';

const Checkbox = ({checked,onChange}) => {
  return (
    <Pressable
      onPress={onChange}
      style={[styles.container, checked ? styles.checkedBox : {}]}>
      {checked ? <View style={styles.innerSquare} /> : null}
    </Pressable>
  );  
};

export default React.memo(Checkbox);
