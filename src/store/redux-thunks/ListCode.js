import firestore from '@react-native-firebase/firestore';

 
export const fetcher = async (userId,collectionName) => { 
    try {
      const querySnapshot = await firestore()
        .collection(collectionName)
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
 

  export const fetchInvoiceList = async (userId,collectionName) => {
        try { 
            const invoicesSnapshot = await  firestore() 
            .collection(collectionName)    
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

