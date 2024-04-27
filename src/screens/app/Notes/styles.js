import { StyleSheet } from 'react-native';
import colors from '../../../constants/colors';

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    noteView: {
        flex: 1,
        backgroundColor: colors.white,
        margin: 10,
        padding: 10,
        borderRadius: 10,
        shadowColor: "red",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 7,
        alignItems: "center"
    },
    noteTitle: {
        fontSize: 20,
        fontWeight: "bold"
    },
    noteDescription: {
        fontSize: 16,
        marginTop: 5
    },
    backIcon: {
        width: 32,
        height: 32,
    },
    backContainer: {
        padding: 24,
    },
    button: {
        margin: 24,
    },
    bottom: {
        marginBottom: 50,
    },
    readMore: {
        fontSize: 16,
        marginTop: 5,
        color: colors.grey
    },
})
export default styles;