import firestore from '@react-native-firebase/firestore';
import { createAsyncThunk } from '@reduxjs/toolkit';

export const fetchInvoiceData = createAsyncThunk("InvoiceData/fetchInvoiceData",
    async (userId) => {
        try {
            const invoicesSnapshot = await firestore()
              .collection('invoices')
              .where('userId', '==', userId)
              .get();

            const newInvoices = [];
            invoicesSnapshot.forEach(documentSnapshot => {
              newInvoices.push({
                uid: documentSnapshot.id,
                ...(documentSnapshot.data() || {}),
              });
            });
               
            const sortedInvoices =  newInvoices.sort((a, b) => b.invoiceDate - a.invoiceDate)
             return sortedInvoices[0]; 
          } catch (error) {
            console.error('Error fetching data:', error);
            Alert.alert('Error', 'Failed to fetch data. Please try again.');
          }
    
    }
)
