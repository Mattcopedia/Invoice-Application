import { createAsyncThunk } from '@reduxjs/toolkit';
import firestore from '@react-native-firebase/firestore';

export const fetchRefurbishSummary = createAsyncThunk("RefurbishSummary/fetchRefurbishSummary",
    async (userId) => {
        try {
            const refurbishSummarySnapshot = await firestore()
              .collection('RefurbishSummary')
              .where('userId', '==', userId)
              .orderBy('createdAt', 'desc') 
              .get() 

            const newRefurbishSummary = [];
            refurbishSummarySnapshot.forEach(documentSnapshot => {
              newRefurbishSummary.push({
                uid: documentSnapshot.id,
                ...(documentSnapshot.data() || {}),   
              });
            });
      
            const sortedrefurbishSummary = newRefurbishSummary
            console.log(`sortedrefurbishSummary4`,sortedrefurbishSummary)
             return sortedrefurbishSummary[0];  
          } catch (error) {
            console.error('Error fetching data:', error);
            Alert.alert('Error', 'Failed to fetch data. Please try again.');
          } 
    
    }
)
