import { createAsyncThunk } from '@reduxjs/toolkit';
import firestore from '@react-native-firebase/firestore';


 
export const fetchProductSelect = createAsyncThunk(
  'ProductSelect/fetchProductSelect',
  async (userId) => { // dispatch is available in the second argument
    try {
      const querySnapshot = await firestore()
        .collection('ProductSelect')
        .where('userId', '==', userId)
        .get(); 
      const newProductItem = [];
      querySnapshot.forEach(documentSnapshot => { 
        newProductItem.push({
          uid: documentSnapshot.id,
          ...(documentSnapshot.data() || {}), 
        });
      }); 
      const sortedInvoices = newProductItem.sort((a, b) => b.invoiceDate - a.invoiceDate);
       return sortedInvoices  
    } catch (error) {
      console.error('Error fetching product item:', error);
    }
  }
);