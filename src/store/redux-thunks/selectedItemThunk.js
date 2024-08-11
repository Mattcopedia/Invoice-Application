import { createAsyncThunk } from '@reduxjs/toolkit';
import firestore from '@react-native-firebase/firestore';

export const fetchselectedItem = createAsyncThunk("selectedItem/fetchselectedItem",
    async (userId) => {
        try {
            const selectedItemSnapshot = await firestore()
        .collection('SelectedItem')
        .where('userId', '==', userId)
        .get();

      const newSelectedItem = [];
      selectedItemSnapshot.forEach(documentSnapshot => {
        newSelectedItem.push({
          uid: documentSnapshot.id,
          ...(documentSnapshot.data() || {}),
        });
      });

      const sortedSelectedItem = newSelectedItem.sort((a, b) => b.invoiceDate - a.invoiceDate);
          return sortedSelectedItem

          } catch (error) {
            console.error('Error fetching data:', error);
            Alert.alert('Error', 'Failed to fetch data. Please try again.');
          }
    
    } 
)
