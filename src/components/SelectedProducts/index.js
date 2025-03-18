import React from 'react'
import Button from '../Button/index';  
import Input from '../Input/index';
import InvoiceText from '../invoiceText/invoiceText';

import {
    ActivityIndicator, 
    ImageBackground,
    ScrollView,
    Text,
    TouchableOpacity,
    View,  
  } from 'react-native';
  import styles from '../../screens/app/SelectedProduct/styles';

const ProductSelectComponent = ({productItems,onSubmit,handleProductItemChange,color}) => { 
  return (   
    <ScrollView  keyboardShouldPersistTaps="handled">  
    {productItems.map((item, index) => ( 
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
    ))}

      {color && (
           <Button style={styles.button} type="blue" onPress={onSubmit}>
           <Text>Done</Text> 
         </Button>
      )}

    

  </ScrollView>
  )
}

export default React.memo(ProductSelectComponent); 