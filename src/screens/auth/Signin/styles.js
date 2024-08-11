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
  footerCol: {
    color: colors.grey,
    fontSize: 15, 
    textAlign: 'center',
    marginTop:10,
  }, 
  footerLink: { 
    color: colors.purple,
    fontWeight: 'bold',
    textAlign: "left"
  },
  backIcon: {
    width: 32,
    height: 32,
  }, 
  loginText: {
    marginLeft: 10
  },
  containerIcon: {
    backgroundColor: colors.white,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    borderRadius: 10,
    padding: 13, 
    marginVertical: 8,
    borderColor: colors.black,
     borderWidth: 0.5
  },

  IconText: {
    color: colors.black,
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 60
  },
  blueBgIcon: {
    backgroundColor: colors.blue,
  },
  IconFaceBookText: {
    marginLeft: 52
  }
});

export default styles;
