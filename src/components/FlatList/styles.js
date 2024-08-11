import {StyleSheet} from 'react-native';
import colors from '../../constants/colors';

const styles = StyleSheet.create({
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
    num: {
        color: colors.purple,
        marginLeft: 5,
        marginRight: 5
    }, 
});

export default styles;
