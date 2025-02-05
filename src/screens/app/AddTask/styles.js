import {StyleSheet} from 'react-native';
import colors from '../../../constants/colors';

import { Dimensions } from 'react-native';
const { width, height } = Dimensions.get('window');



const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15, // Adjust padding as needed
    marginBottom: 20,
  },
  containerProduct: {
    flex: 1,
    padding: 15, // Adjust padding as needed
  },
  allProduct: {

  },
  backContainer: {
    padding: 24,
  },
  backIcon: {
    width: 32,
    height: 32,
  },
  label: {
    fontSize: 12,
    color: colors.black,
    marginHorizontal: 24,
    fontWeight: '500',
    marginTop: 12,
  },
  label2: {
    fontSize: 18,
    color: colors.black,
    marginHorizontal: 24,
    fontWeight: '500',
    marginTop: 12,
  },
  invoiceText: {
    fontSize: 14, 
    color: colors.black,
    marginHorizontal: 24,
    fontWeight: '500',
    marginTop: 5,
    marginLeft: 30,
  },
  invoiceText2: {
    fontSize: 17,
    color: colors.purple,
    fontWeight: '300',
    marginLeft: 8,
    marginVertical: 10,
    textAlign: "center"
  },
  AddProduct: {
    fontSize: 14, 
    color: colors.black,
    marginHorizontal: 24,
    fontWeight: '500',
    marginTop: 5,
    marginLeft: 30,
    textAlign: "center"
  },
  button: {
    margin: 24,
  },
  picker: {
    color: colors.midGrey,
    fontSize: 16,
    paddingLeft: 40,
    marginHorizontal: 14,
  }, 
  pickerBorder: {
    borderColor: colors.grey, 
    borderWidth: 1,
    borderRadius: 10,
    marginTop:15,
    marginHorizontal: 23, 
  }, 
  errorText: { 
    color: "#FF8C8C",
    fontSize: 12,
    marginBottom: 10,
    marginLeft: 23
  },
 
  imageBackgroundFlat: {
    width: '85%',
    height: 200, 
    marginTop: 15
  },

  PhotoContainer: {
   flexDirection: "row",
   flex: 1,
   alignItems: 'center',
   justifyContent: 'center',
  },
  PhotoContainerView: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  takePhoto: {
      backgroundColor: colors.blue,
      borderRadius: 10,  
      padding: 13, 
      marginVertical: 8, 
      marginLeft: 10, 
  },
  textPhoto: {
    color: colors.white 
  },
  Photo: {
    width: width * 1,
    height: 200,
    marginBottom: 20,
    flexDirection: "row",
    alignItems: 'center',
    justifyContent: 'center',
  },
  PhotoView: {
    width: width * 0.9,
    height: 200,
    marginBottom: 20,
    flexDirection: "row",
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalContent: {
    width: width * 0.7,
    padding: 10,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  }, 
  closeBtn: {
    paddingLeft: 200,
    paddingTop: 5,
    paddingLeft: width * 0.5,
  },
  imageBackground: {
    width: width * 0.85,
    height: 200, 
    marginTop: 15
  }, 
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
 
  alignIcon: {
     display: "flex",
    flexDirection: "row"
  },
  buttonUpload: { 
    justifyContent: 'center',
    alignItems: 'center',  
    margin: 32
  },
  textStyle: {
    color: colors.black,  
    fontWeight: 'bold',
    textAlign: 'center',
  },
  statusView: {
    height: 10,
  },
  status: {
    justifyContent: 'center',
    alignItems: 'center',  
  },
  labelPhoto: {
    marginVertical: 85,
    marginHorizontal: 80,
    color: colors.black 
  },
  labelAmount: {
    paddingHorizontal: 24,
    borderRadius: 10,
    color: colors.black,
    marginVertical: 12,
    marginLeft: 23,
    fontSize: 15,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.grey,
    paddingVertical: 18,
    marginRight: 23
  },
  padLeft: {
    paddingLeft: 37
  },
  text1: {
    flex: 1,
    color: colors.purple,
    textAlign: "center",
    justifyContent: "center",
    alignItems: "center",
    fontSize: 20,
    marginTop: 200,
},
titleProduct: {
  fontSize: 16,
  color: colors.purple,
  fontWeight: '500',
  textAlign: "center",
  paddingTop: 40,
  marginRight: 30
},
checkbox: {
  flexDirection: 'row',
  alignItems: 'center',
  padding: 10,
  backgroundColor:'#d3d3d3',
  borderRadius: 5,
  marginBottom: 5,
},
 textRef: {
  color: colors.black
 },
 StatusContainer: {
  marginTop: 20,
  flexDirection: 'row',
  justifyContent: 'space-around',
  alignItems: 'center',
}
}); 

export default styles;
