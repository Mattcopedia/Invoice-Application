import {StyleSheet} from 'react-native';
import colors from '../../../constants/colors';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20, // Adjust padding as needed
    marginBottom: 20
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
  invoiceText: {
    fontSize: 17, 
    color: colors.black,
    marginHorizontal: 24,
    fontWeight: '500',
    marginTop: 5,
    marginLeft: 30,
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
    width: '80%',
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
  centeredView: {
    flex: 1,
    marginTop: 22,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: "column",
    backgroundColor: 'rgba(0,0,0,0.5)' 
  },
  modalView: {
    backgroundColor: 'white',
  justifyContent: 'center',
  alignItems: 'center',
  flexDirection: "row",
  borderRadius: 10,
  paddingLeft: 30
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
  closeButton: {
    flexDirection: "column",
    alignSelf: "flex-start",
    marginRight: 15,
    marginTop: 15,
  },
  status: {
    justifyContent: 'center',
    alignItems: 'center',  
  },
  labelPhoto: {
    marginVertical: 85,
    marginHorizontal: 80,
    color: colors.black 
  }
}); 

export default styles;
