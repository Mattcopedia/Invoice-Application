import { StyleSheet } from 'react-native';
import colors from '../../../constants/colors';

import { Dimensions } from 'react-native';
const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
    containerFlex: {
        flex: 1,
        flexDirection: 'row',
        marginVertical: 10,
        marginHorizontal: 4,
    },
    containerFlex2: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        marginVertical: 10,
        marginHorizontal: 4,
        
    },
    containerShape: {
        flex: 1, // Ensure container takes up available space
        marginBottom: 80
    },
    item: {
        flexDirection: 'column',
        textAlign: "center", 
        marginLeft: 30,
    },
    item2: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    image: {
        height: 85,
        width: 85,
        marginRight: 10, 
    },
    text: {
        flex: 1,
        color: colors.purple
    },
    text1: {
        flex: 1,
        color: colors.purple,
        textAlign: "center" 
    },
    num: {
        color: colors.purple,
        marginLeft: 19,
        marginRight: 5,
        marginTop:1
    },

    container: {
        flex: 1,
        padding: 20,
        marginBottom: 20,
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
        fontSize: 14, 
        color: colors.black,
        marginHorizontal: 24,
        fontWeight: '500',
        marginTop: 5,
        marginLeft: 30,
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
    button1: {
        margin: 24,
        marginTop: 15,
    },
    delRow: {
        display: "flex",
        flexDirection: 'row',
        justifyContent: "center",
        alignItems: "center",
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
        width: '87%',
        height: 200, 
        marginTop: 15
    },
    Photo: {
        justifyContent: 'center', 
        alignItems: 'center',   
        width: '120%',
        marginBottom: 20,
        flexDirection: "row",
        alignItems: 'center',
        justifyContent: 'center',
    },
    PhotoContainer: {
        flexDirection: "row",
        flex: 1, // Ensure container takes up available space
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
    text2: {
        flex: 1,
        color: colors.purple,
        textAlign: "center",
        justifyContent: "center",
        alignItems: "center",
        fontSize: 20,
        marginTop: 200,
    },
    delRow: {
        display: "flex",
        flexDirection: 'row',
        justifyContent: "center",
        alignItems: "center",
    },
    titleProduct: {
        fontSize: 16,
        color: colors.purple,
        fontWeight: '500',
        textAlign: "center",
        marginLeft: 9,
        marginTop:1,
      },   
      delete: {
        width: 24,
        height: 24,   
        marginLeft: 5,
      },  
      imageBackgroundFlat: {
        width: '85%',
        height: 200, 
        marginTop: 15
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
  
    Photo: {
      width: width * 1,
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
    passwordContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 10,
        backgroundColor: colors.lightGrey,
        marginLeft: 20,
        marginRight: 8 ,
      }, 
      eyeIcon: {
      },
});

export default styles;
