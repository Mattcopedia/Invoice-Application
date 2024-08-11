import { createAsyncThunk } from '@reduxjs/toolkit';
import firestore from '@react-native-firebase/firestore';

export const fetchSummaryData = createAsyncThunk("summaryData/fetchsummaryData",
    async (userId) => {
        try {
            const summarySnapshot = await firestore()
            .collection('Summary')
            .where('userId', '==',userId)
            .get();
    
          const newSummary = [];
          summarySnapshot.forEach(documentSnapshot => {
            newSummary.push({
              uid: documentSnapshot.id,
              ...(documentSnapshot.data() || {}),
            });
          });
    
          const sortedSummary = newSummary.sort((a, b) => b.invoiceDate - a.invoiceDate);
          return sortedSummary[0]
          } catch (error) {
            console.error('Error fetching data:', error);
            Alert.alert('Error', 'Failed to fetch data. Please try again.');
          }
    
    } 
)
