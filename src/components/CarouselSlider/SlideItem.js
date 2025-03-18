import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useRef } from 'react';
import { Animated, Easing, Text, TouchableOpacity, View } from 'react-native';
import { imagePath } from '../../screens/app/AddTask';
import styles from './styles';

 
 
const SlideItem = ({item}) => {  
 
  const navigation = useNavigation()
  const InvoiceList = item?.InvoiceList
  console.log(`ImageUri35XC`,item?.ImageUri) 
  const translateYImage = useRef(new Animated.Value(40)).current;

  const handleNavigateRecent = () => {
    navigation.navigate(item?.url, {InvoiceList})   
  }
  useEffect(() => {
    Animated.timing(translateYImage, {
      toValue: 0,
      duration: 1000,
      useNativeDriver: true,
      easing: Easing.bounce, 
    }).start();
  }, []); 

 
  
  return ( 
    <View style={styles.container5}>
          <TouchableOpacity onPress={handleNavigateRecent}>  

          <Animated.Image
        source={item?.ImageUri ? { uri: item.ImageUri } : { uri: imagePath }}
        resizeMode="cover"
        style={[
          styles.imageBackground, // Full-screen background style
          {
            transform: [{ translateY: translateYImage }],
          }, 
        ]}
      />
     <View style={styles.overlay}>
        <Text style={styles.labelPhoto}>{item?.Title}</Text>
      </View>

      <View style={styles.overlay1}>
        <Text style={styles.text2}>{item?.Description?.substring(0,38)}</Text>
      </View>

      <View style={styles.overlay2}>
        <Text style={styles.text2}>{item?.Attention}</Text> 
      </View>


      </TouchableOpacity>  
  </View> 

  )
}

export default React.memo(SlideItem) 

