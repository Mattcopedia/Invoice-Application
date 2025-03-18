import { Dimensions, StyleSheet } from 'react-native';
import colors from '../../constants/colors';
const {width,height} = Dimensions.get("screen"); 


const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 100,
    width: 60,
    height: 60,
    backgroundColor: colors.blue,
    position: 'absolute',
    bottom: height * 0, 
    right: 24,
  },
  plus: {
    fontSize: 32,
    marginTop: -2,
    color: colors.white,
    fontWeight: '600',
  },

});

export default styles;
