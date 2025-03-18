import React, { useRef, useState } from 'react';
import { Animated, View } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import Pagination from './Pagination';
import SlideItem from './SlideItem';
import styles from './styles';


const CarouselSlider = ({InvoiceList1,RefurbishInvoiceList1,receiptList1}) => {

  const [index, setIndex] = useState(0)  

const InvoiceList = InvoiceList1?.length > 0 ? InvoiceList1[0] : null;
const RefurbishInvoiceList = RefurbishInvoiceList1?.length > 0 ? RefurbishInvoiceList1[0] : null;
const receiptList = receiptList1?.length > 0 ? receiptList1[0] : null; 

   const scrollX = useRef(new Animated.Value(0)).current;
 
   console.log(`InvoiceList35CX`,InvoiceList)
   console.log(`RefurbishInvoiceList35CX`,RefurbishInvoiceList)
   console.log(`receiptList35CX`,receiptList)    


   const data = [
    InvoiceList && {
      id: 1,
      Title: 'Recent Invoice',
      Attention: InvoiceList?.Attention,
      ImageUri: InvoiceList?.Product[0]?.ImageUri,
      Description: InvoiceList?.Product[0]?.Description,
      url: 'LatestInvoice',
      InvoiceList: InvoiceList,
    },
  
    RefurbishInvoiceList && {
      id: 2,
      Title: 'Recent Refurbishment',
      Attention: RefurbishInvoiceList?.Attention,
      ImageUri: RefurbishInvoiceList?.Product[0]?.ImageUri,
      Description: RefurbishInvoiceList?.Product[0]?.Description,
      url: 'LatestRefurb',
      InvoiceList: RefurbishInvoiceList,
    },
  
    receiptList && {
      id: 3, 
      Title: 'Recent Receipt',
      Attention: receiptList?.Attention,
      ImageUri: InvoiceList?.Product[0]?.ImageUri, // FIXED 
      Description: receiptList?.Description, 
      url: 'LatestReceipt',
      InvoiceList:receiptList,    
    },
  ].filter(Boolean); 
   
  const handleOnScroll = event => {
    Animated.event(
      [
        { 
          nativeEvent: {
            contentOffset: {
              x: scrollX,
            },
          },
        },
      ],
      {
        useNativeDriver: false,
      },
    )(event);
  };

const handleOnViewableItemsChanged = useRef(({viewableItems}) => {
  console.log('viewableItems', viewableItems); 
  if (viewableItems.length > 0) {
    setIndex(viewableItems[0].index);
  } 
}).current;

const viewabilityConfig = useRef({
  itemVisiblePercentThreshold: 50,
}).current;

  
  return (
    <SafeAreaView>
    <View style={styles.container23}>
      <FlatList
      data={ data?.length  !== 0 ? data: []}  
      keyExtractor={(item, index) => index.toString()}  
      renderItem={({item}) => <SlideItem item={item} />}
      horizontal
      pagingEnabled
      snapToAlignment='center'
      showsHorizontalScrollIndicator={false} 
      onScroll={handleOnScroll}
      onViewableItemsChanged={handleOnViewableItemsChanged}
      viewabilityConfig={viewabilityConfig}
       />
       <View style={styles.alignDot}>
       <Pagination data={data} scrollX={scrollX} index={index} />
       </View>

       </View>
    </SafeAreaView>
  )
}

export default React.memo(CarouselSlider)  

