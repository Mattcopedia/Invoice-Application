import { StyleSheet } from 'react-native';
import colors from '../../constants/colors';

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
});

export default styles;
