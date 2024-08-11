import { createAsyncThunk } from '@reduxjs/toolkit';
import firestore from '@react-native-firebase/firestore';

export const fetchGeneratedInvoice = createAsyncThunk("GeneratedInvoice/fetchGeneratedInvoice",
    async (userId) => {
        try {
            const invoicesSnapshot = await  firestore() 
            .collection('GeneratedInvoice')  
            .where('userId', '==', userId)
            .get() 
  
            const newInvoices = [];
            invoicesSnapshot.forEach(documentSnapshot => {
              newInvoices.push({
                uid: documentSnapshot.id,
                ...(documentSnapshot.data() || {}),
              });
            });
      
            const sortedInvoices = newInvoices.sort((a, b) => b.invoiceDate - a.invoiceDate);
            return sortedInvoices 
          } catch (error) {
            console.error('Error fetching data:', error);
            Alert.alert('Error', 'Failed to fetch data. Please try again.');
          }
    
    }
) 
