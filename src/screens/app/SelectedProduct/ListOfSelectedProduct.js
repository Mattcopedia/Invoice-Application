import { View, Text, FlatList, SafeAreaView, Pressable, Image, BackHandler } from 'react-native';
import React, { useEffect, useState } from 'react';
import Header from '../../../components/Header';
import firestore from '@react-native-firebase/firestore';
import { useSelector, useDispatch } from 'react-redux';
import styles from './styles';
import { useNavigation, useIsFocused } from "@react-navigation/native";
import { setSelectedItem, setToUpdate } from '../../../store/invoices';
import Title from '../../../components/Title';
import Button from '../../../components/Button';

const AllSelectedProducts = () => { 
    const dispatch = useDispatch(); 
    const navigation = useNavigation();
    const user = useSelector(state => state?.invoices?.user)
    const invoices = useSelector(state => state?.invoices?.invoiceLatest)
    const allProduct = useSelector(state => state?.invoices?.selectedItem);
    const filteredProducts = allProduct?.filter(product => product?.invoiceNo === invoices?.invoiceNo)
    const arrangedProducts = filteredProducts?.slice().reverse(); 
    const [deletionCount, setDeletionCount] = useState(0);
    const isFocused = useIsFocused();  

    const handleBack = () => {
        navigation.goBack()
      }; 



      useEffect(() => {   
        firestore() 
            .collection('SelectedItem') 
            .where('userId', '==', user?.uid)
            .get() 
            .then(querySnapshot => {
                const newProductItem = []; 
                querySnapshot.forEach(documentSnapshot => {
                  newProductItem.push({
                    uid: documentSnapshot.id, 
                    ...(documentSnapshot.data() || {}),
                  }); 
                }); 
               
                const sortedProducts = newProductItem.sort((a, b) => b.invoiceDate - a.invoiceDate);
                dispatch(setSelectedItem(sortedProducts));   
            });       
      }, [user, dispatch, isFocused,deletionCount]); 
 
   
      const handleDelete = async (item) => {
        try {
       await firestore()
        .collection('SelectedItem') 
        .doc(item?.uid)
        .delete() 
        .then(() => {  
            console.log("Product Deleted!")
            dispatch(setToUpdate()); 
            setDeletionCount(deletionCount + 1); 
        }); 
          
        } catch (error) {
            console.error("Error deleting product: ", error);
        }
    };
    
    

    return ( 
        <SafeAreaView style={{ flex: 1 }}> 
          <Pressable style={styles.backContainer} hitSlop={8}  onPress={handleBack}
 >
        <Image
          style={styles.backIcon}
          source={require('../../../assets/back.png')}
        />
      </Pressable> 
      <Text style={styles.titleProduct}>Delete selected product</Text> 
               {(allProduct?.length === 0 || !allProduct) && (
                <Text style={styles.text2}>Select a product</Text>
            )} 
            <View style={{ flex: 1 }}> 
                <FlatList
                    showsVerticalScrollIndicator={true}
                    data={arrangedProducts}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item, index }) => (
                        <Pressable style={styles.containerFlex}>
                            <View style={styles.item}>
                            <Text style={styles.num}>{index+1}</Text>
                                <Image
                                    style={styles.image}
                                    source={{
                                        uri: item?.ImageUri,
                                    }}
                                />
                                <Text style={styles.text}>{item?.Description.substring(0, 100)}</Text>
                                <Pressable style={styles.deletecontainer} onPress={() => handleDelete(item)} >
                        <Image style={styles.delete} source={require('../../../assets/icons8-delete-48.png')} />
                                </Pressable>    
                            </View>
                         
                        </Pressable>
                    )}
                />
            </View>
        </SafeAreaView>
    );
};

export default AllSelectedProducts;
