import {Dimensions, StyleSheet} from 'react-native';
import colors from '../../../constants/colors';

export const { width, height } = Dimensions.get('window');


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
  labelsav: {
    fontSize: 12,
    color: colors.black,
    marginHorizontal: 24,
    fontWeight: '500',
    marginTop: 5,
    marginBottom: 5,
    textAlign: 'center',
    paddingRight:37 ,
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
  imageBackground: {
    width: '85%',
    height: 200, 
    marginTop: 15
  },
  imageBackgroundFlat: {
    width: '85%',
    height: 200, 
    marginTop: 15
  },
  Photo: {
    justifyContent: 'center', 
    alignItems: 'center',   
    marginLeft: 50,
   
  },
  PhotoContainer: {
   flexDirection: "row",
   flex: 1,
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
    width: '120%',
    height: 200,
    marginBottom: 20,
    flexDirection: "row",
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '70%',
    padding: 10,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  }, 
  closeBtn: {
    paddingLeft: 200,
    paddingTop: 5,
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
preview: {
  width: width * 0.9,
  backgroundColor: "#F8F8F8",
  marginTop: 15, 
},
containerSig: {
  flex: 1,
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  paddingTop: 10, 
},
borderSig: {
  borderColor: colors.grey,
  borderWidth: 1, 
  borderRadius: 1,
},
signature: {
  flex: 1,
  width:  width * 0.8,
  height:  200, // Adjust as needed
},
buttonContainer: {
  flexDirection: 'row',
  justifyContent: 'space-around',
  width:  '100%' ,
  padding: 10, 
},
text2: {
  flex: 1,
  color: colors.purple,
  textAlign: "center",
  justifyContent: "center",
  alignItems: "center",
  fontSize: 20,
  marginTop: 200,
},
container2: {
  flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F5FCFF',
},
strokeColorButton: {
  marginHorizontal: 2.5, marginVertical: 0.5, width: 30, height: 30, borderRadius: 15,
},
strokeWidthButton: {
  marginHorizontal: 2.5, marginVertical: 8, width: 30, height: 30, borderRadius: 15,
  justifyContent: 'center', alignItems: 'center', backgroundColor: '#39579A'
},
functionButton: {
  marginHorizontal: 2.5, marginVertical: 1, height: 30, width: 60,
  backgroundColor: '#39579A', justifyContent: 'center', alignItems: 'center', borderRadius: 5,
} 
}); 

export default styles;
