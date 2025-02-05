import React, { useCallback, useEffect, useState } from 'react'
import InvoiceText from '../invoiceText/invoiceText';

import {
    ActivityIndicator, 
    FlatList, 
    ImageBackground, 
    Modal, 
    Pressable,  
    ScrollView,
    Text,
    TouchableOpacity,
    View,  
  } from 'react-native';
  import styles from '../../screens/app/AddTask/styles';

import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Button from '../Button';
import Input from '../Input';
import colors from '../../constants/colors';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import SelectedProducts from '../../components/SelectedProducts/index' 


const SelectView = ({filterselectedProducts,productItems,setModalVisible,modalVisible,HandleUploadImage,transferred,
  takePhotoFromCamera,choosePhotoFromLibrary,handleProductItemChange,deleteProductItem,onSubmit,loading,addProductItem,setProductItems,handleProductItemChange2,productItems2}) => { 
   
    const navigation = useNavigation();
    const [refreshKey, setRefreshKey] = useState(0);

 
   useFocusEffect(
     useCallback(() => {
       setRefreshKey(prevKey => prevKey + 1);
     }, [])
   );  

  
  return (     
    <> 
     <FlatList  
     data={filterselectedProducts.length !== 0 ? filterselectedProducts : [] }   
     keyExtractor={(item, index) => index.toString()}  
     key={`${refreshKey}`}   
     keyboardShouldPersistTaps="handled"  

     renderItem={({ item, index }) => ( 
       <SelectedProducts productItems={productItems2} color={false} onSubmit={onSubmit} handleProductItemChange={handleProductItemChange2}  /> 
     
      )} 

      ListHeaderComponent={ 
        <> 
        { productItems.map((item, index) => ( 
  <View key={index}>
  <Text style={styles.label}>Product Item {index+1}</Text>
    <TouchableOpacity onPress={() => setModalVisible(index)}>
      <View style={styles.Photo}>
        <ImageBackground source={{ uri: item?.ImageUri }} style={styles.imageBackground}>
          <Text style={styles.labelPhoto}>Select an image</Text>  
        </ImageBackground>
      </View> 
    </TouchableOpacity>

    <Modal animationType="fade" transparent={true} visible={modalVisible  === index} onRequestClose={() => { setModalVisible(false); }}>
      
    <Pressable style={styles.modalBackground} onPress={() => setModalVisible(false)}>
      <View style={styles.modalContent}>  

      <View  onPress={() => setModalVisible(false)} >
         <AntDesign size={20}  style={styles.closeBtn} color={colors.black} name="close" /> 
         </View>    

        <View style={styles.alignIcon}>
        <TouchableOpacity onPress={() => takePhotoFromCamera(index,setProductItems,setModalVisible)} style={styles.buttonUpload}>
            <SimpleLineIcons onPress={() => takePhotoFromCamera(index,setProductItems,setModalVisible)} size={60}  color={colors.black} name="camera" /> 
            <Text onPress={() => takePhotoFromCamera(index,setProductItems,setModalVisible)} style={styles.textStyle}>Camera</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => choosePhotoFromLibrary(index,setProductItems,setModalVisible)} style={styles.buttonUpload}>
            <MaterialIcons onPress={() => choosePhotoFromLibrary(index,setProductItems,setModalVisible)} size={60}  color={colors.black} name="photo-library" /> 
            <Text onPress={() => choosePhotoFromLibrary(index,setProductItems,setModalVisible)} style={styles.textStyle}>Library</Text>  
          </TouchableOpacity>    
        </View>
        
        </View>     
      </Pressable> 

      </Modal>  



    <View style={styles.PhotoContainer}>
      {item.uploading ? (
        <View style={styles.status}>
          <Text>{transferred} % completed</Text>
          <ActivityIndicator size="large" color="#0000ff" /> 
        </View> 
      ) : (    
        <TouchableOpacity onPress={() => HandleUploadImage(index)} style={styles.takePhoto}>
          <Text style={styles.textPhoto}> Upload Image</Text>  
        </TouchableOpacity>      
      )}
    </View>

    <Text style={styles.label}>Sample Description</Text>
    <Input
      value={item?.Description}
      onChangeText={(value) => handleProductItemChange(index, 'Description', value)}
      outlined
      placeholder="Enter Description"
      multiline={true}
      numberOfLines={1}  
    />

      
<Text style={styles.label}>Sample Code</Text> 
<Input
  value={item?.SampleCode}
  onChangeText={(value) => handleProductItemChange(index, 'SampleCode', value)} 
  outlined
  placeholder="EQEC507"
/>


    <Text style={styles.label}>Quantity</Text>
    <Input
      value={item.Quantity}
      onChangeText={(value) => handleProductItemChange(index, 'Quantity', value)}
      outlined
      placeholder="1"
      keyboardType="numeric" 
    />

    <Text style={styles.label}>Unit Price</Text>
    <Input
      value={item.UnitPrice}
      onChangeText={(value) => handleProductItemChange(index, 'UnitPrice', value)}
      outlined
      placeholder="N500" 
      keyboardType="numeric"
    /> 

    <View>
     <Text style={styles.label}>Amount</Text>
     <Text style={styles.labelAmount}>{item.Amount}</Text> 
     </View> 
   
   {productItems.length > 1 && (
     <Button style={styles.button}  del="red" onPress={() => deleteProductItem(index)}>
     <Text>Delete</Text> 
   </Button>  
   )}

   <View style={{height: 37}}></View>

  </View>


)) 
 }


        </>
      }

      ListFooterComponent={
        <>
             <Button style={styles.button} type="blue" onPress={addProductItem}>
            <Text>Add Product</Text> 
          </Button>  

          <Button style={styles.button} type="blue" onPress={() => navigation.navigate("SelectProduct")}>
            <Text>Select Product</Text> 
          </Button>  
  
        {loading ? (
          <ActivityIndicator /> 
        ) : (
          <Button style={styles.button} type="blue" onPress={onSubmit}>
            <Text>Done</Text> 
          </Button>
        )}
        </>
      }
 
     />
     </>
  )
}

export default React.memo(SelectView); 