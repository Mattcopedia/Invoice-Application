
import React from 'react'
import Input from '../Input'
import { ImageBackground, Text, TouchableOpacity, View } from 'react-native'
import styles from '../../screens/app/SelectedProduct/styles'
import InvoiceText from '../invoiceText/invoiceText'

const ViewList = ({handleProductItemChange,item,index}) => { 
  return (
    <View key={index}>
    <Text style={styles.label}>Product Item {index+1}</Text>
      <TouchableOpacity>
          {item?.ImageUri && (
           <View style={styles.Photo}>
           <ImageBackground source={{ uri: item.ImageUri }} style={styles.imageBackground}>
           </ImageBackground>
         </View>   
          )} 
      </TouchableOpacity>

      <Text style={styles.invoiceText}>Description</Text>
              <InvoiceText>
              {item?.completeDescription}
              </InvoiceText> 

      <Text style={styles.label}>Quantity</Text>
      <Input
        value={item.Quantity}
        onChangeText={(value) => handleProductItemChange(index, 'Quantity', value)}
        outlined
        placeholder="2"
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

     <View style={{height: 37}}></View>

    </View>
  )
}

export default React.memo(ViewList) 