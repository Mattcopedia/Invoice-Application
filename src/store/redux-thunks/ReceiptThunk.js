import firestore from '@react-native-firebase/firestore';
import { createAsyncThunk } from '@reduxjs/toolkit';

export const fetchReceipt = createAsyncThunk("Receipt/fetchReceipt",
    async (userId) => { 
        try {
            const refurbishSummarySnapshot = await firestore()
              .collection('Receipt')  
              .where('userId', '==', userId)
              .orderBy('createdAt', 'desc')  
              .get(); 

            const newRefurbishSummary = [];
            refurbishSummarySnapshot.forEach(documentSnapshot => {
              newRefurbishSummary.push({
                uid: documentSnapshot.id,  
                ...(documentSnapshot.data() || {}), 
              });
            });
      
            const sortedrefurbishSummary = newRefurbishSummary 
             return sortedrefurbishSummary;  
          } catch (error) {
            console.error('Error fetching data:', error); 
            Alert.alert('Error', 'Failed to fetch data. Please try again.');
          } 
     
    }
)
