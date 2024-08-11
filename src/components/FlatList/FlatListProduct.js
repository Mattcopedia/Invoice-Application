import React from 'react';
import {Pressable, View,FlatList, Image,Text} from 'react-native';
import styles from './styles';
import { useNavigation } from '@react-navigation/native';

const FlatListProduct = ({filteredAllInvoices,page}) => {
    const navigation = useNavigation();
    const handleNavigate = (item) => {
        if (item.type === 'productSelect') {
          navigation.navigate('ProductSelect', { item });
        } else {
          navigation.navigate('Product', { item });
        }
        
      };

  return (
    <FlatList
    showsVerticalScrollIndicator={true}
    data={filteredAllInvoices}
    keyExtractor={(item, index) => index.toString()}
    renderItem={({ item, index }) => (
        <Pressable onPress={() => handleNavigate(item)} style={styles.containerFlex}>
            <View style={styles.item}>
                <Text style={styles.num}>{index+1}</Text>
                <Image
                    style={styles.image}
                    source={{
                        uri: item?.ImageUri,
                    }}
                />
                <Text style={styles.text}>{item?.Description.substring(0, 23)} - {item.SampleCode}</Text>
            </View>
        </Pressable>
    )}
/>
  );
}; 

export default React.memo(FlatListProduct);
 