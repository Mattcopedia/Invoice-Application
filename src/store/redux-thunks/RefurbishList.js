import { createAsyncThunk } from '@reduxjs/toolkit';
import firestore from '@react-native-firebase/firestore';

export const fetchGeneratedRefurbishInvoice = createAsyncThunk("GeneratedRefurbishInvoice/fetchGeneratedRefurbishInvoice",
    async (userId) => {
      console.log('GeneratedRefurbishInvoice','GeneratedRefurbishInvoice')
        try {
            const invoicesSnapshot = await  firestore() 
            .collection('GeneratedRefurbishInvoice')   
            .where('userId', '==', userId)
            .orderBy('createdAt', 'desc')  
            .get() 
   
            const newInvoices = [];
            invoicesSnapshot.forEach(documentSnapshot => {
              newInvoices.push({ 
                uid: documentSnapshot.id,
                ...(documentSnapshot.data() || {}),
              });
            });
      
            const sortedInvoices = newInvoices 
             
            return sortedInvoices 
          } catch (error) {
            console.error('Error fetching data:', error);
            Alert.alert('Error', 'Failed to fetch data. Please try again.');
          }
    
    }
) 
