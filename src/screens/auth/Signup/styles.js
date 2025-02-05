import {StyleSheet} from 'react-native';
import colors from '../../../constants/colors';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 24,
  },
  space: {
    height: 30
  },
  footerText: {
    color: colors.grey,
    fontSize: 15,
    textAlign: 'center',
    marginTop: 28,
  },
  footerLink: {
    color: colors.purple,
    fontWeight: 'bold',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
  },
  agreeText: {
    color: colors.grey,
    fontSize: 12,
    marginLeft: 8,
  },
  link: {
    textDecorationLine: 'underline',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
  }, 
  eyeIcon: {
    padding: 2,
    marginLeft: 'auto',
    padding: 15,
    borderRadius: 10,
  },
});

export default styles;
