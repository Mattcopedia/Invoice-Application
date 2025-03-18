import React, { forwardRef } from 'react';
import {Pressable, TextInput} from 'react-native';
import styles from './styles';
import colors from '../../constants/colors';

const SearchInput = forwardRef(({placeholder,onChangeText,value,focusSearchInput}, ref) => {
    return (
        <Pressable style={styles.searchInput} onPress={focusSearchInput}  hitSlop={8}>
      <TextInput
        ref={ref} // Attach ref to TextInput
        value={value} 
       placeholderTextColor={colors.midGrey} 
       onChangeText={onChangeText}
       style={[styles.searchInput]} 
       placeholder={placeholder}  
      />
      </Pressable>
    );

  });

export default React.memo(SearchInput); 


  