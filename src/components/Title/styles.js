import {StyleSheet} from 'react-native';
import colors from '../../constants/colors';

const styles = StyleSheet.create({
  title: {
    color: colors.black,
    fontSize: 28,
    fontWeight: 'bold',
    paddingBottom: 5
  },
  thin: {
    fontSize: 24,
    fontWeight: '300',
    color: colors.purple,
    paddingHorizontal: 24, 
  },
  upward: {
   marginBottom: 10,
  } 
});

export default styles;
