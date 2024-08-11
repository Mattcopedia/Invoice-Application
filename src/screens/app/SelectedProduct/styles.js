import { StyleSheet } from 'react-native';
import colors from '../../../constants/colors';

const styles = StyleSheet.create({
    containerFlex: {
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
        marginLeft: 5,
        marginRight: 5
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
    delete: {
        width: 24,
        height: 24,   
        marginLeft: 5,
      }, 
      titleProduct: { 
        fontSize: 16,
        color: colors.purple,
        fontWeight: '500',
        textAlign: "center",
      },    
      invoiceText: {
        fontSize: 14, 
        color: colors.black,
        marginHorizontal: 24,
        fontWeight: '500',
        marginTop: 5,
        marginLeft: 30,
      },
});

export default styles;
