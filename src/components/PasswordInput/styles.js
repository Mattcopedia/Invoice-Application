import {StyleSheet} from 'react-native';
import colors from '../../constants/colors';

const styles = StyleSheet.create({
  passwordInput: {
    backgroundColor: colors.lightGrey,
    paddingHorizontal: 24,
    paddingVertical: 13,
    paddingRight: 240,
    borderRadius: 10,
    color: colors.black,
    marginVertical: 12, 
    fontSize: 15,
     
  },  
 showText : {
  backgroundColor: colors.lightGrey,
  paddingHorizontal: 24,
  paddingVertical: 13,
  paddingRight: 180,
  borderRadius: 10,
  color: colors.black,
  marginVertical: 12,
  fontSize: 15, 
 }
});

export default styles;
