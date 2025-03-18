

import React from 'react'
import { ActivityIndicator, ImageBackground, Modal, Pressable, Text, TouchableOpacity, View } from 'react-native';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AntDesign from 'react-native-vector-icons/AntDesign'; 
import styles from './styles';
import colors from '../../constants/colors';
import { choosePhotoFromLibrary2, choosePhotoFromLibrary3, takePhotoFromCamera2, takePhotoFromCamera3 } from '../../constants/categories'; 

const UploadImage1 = ({setModalVisible,modalVisible,item,transferred,HandleUploadImage,setProductItems,index}) => { 
  return (  
    <View>
    <TouchableOpacity onPress={() => setModalVisible(index)}>
      <View style={styles.Photo}>
        <ImageBackground source={{ uri: item?.ImageUri }}  style={styles.imageBackground}>
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
        <TouchableOpacity onPress={() => takePhotoFromCamera3(index,setProductItems,setModalVisible)} style={styles.buttonUpload}>
            <SimpleLineIcons onPress={() => takePhotoFromCamera3(index,setProductItems,setModalVisible)} size={60}  color={colors.black} name="camera" /> 
            <Text onPress={() => takePhotoFromCamera3(index,setProductItems,setModalVisible)} style={styles.textStyle}>Camera</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => choosePhotoFromLibrary3(index,setProductItems,setModalVisible)} style={styles.buttonUpload}>
            <MaterialIcons onPress={() => choosePhotoFromLibrary3(index,setProductItems,setModalVisible)} size={60}  color={colors.black} name="photo-library" /> 
            <Text onPress={() => choosePhotoFromLibrary3(index,setProductItems,setModalVisible)} style={styles.textStyle}>Library</Text>  
          </TouchableOpacity>    
        </View>
        
        </View>     
      </Pressable> 

      </Modal>  
    <View style={styles.PhotoContainer}>
      {item?.uploading ? (  
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

    </View>
  )
}

export default React.memo(UploadImage1)

//uploadin, uploaded