import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { useDispatch, useSelector } from 'react-redux';
import { setProductItem } from '../store/invoices';
import { setAllProduct } from '../store/invoices';


export const categories = [
  {
    label: 'Quick Task',
    value: 'quick_task', 
  },
  {
    label: 'Urgent',
    value: 'urgent',
  },
  {
    label: 'Important',
    value: 'important',
  },
  {
    label: 'Nice to Have',
    value: 'nice_to_have',
  },
  {
    label: 'Low Priority',
    value: 'low_priority',
  },
];




export function numberToWords(num) {
   const realNum = Math.floor(num) 
  const belowTwenty = [
      'ZERO', 'ONE', 'TWO', 'THREE', 'FOUR', 'FIVE', 'SIX', 'SEVEN', 'EIGHT', 'NINE', 'TEN', 
      'ELEVEN', 'TWELVE', 'THIRTEEN', 'FOURTEEN', 'FIFTEEN', 'SIXTEEN', 'SEVENTEEN', 'EIGHTEEN', 'NINETEEN'
  ];
  const tens = ['', '', 'TWENTY', 'THIRTY', 'FORTY', 'FIFTY', 'SIXTY', 'SEVENTY', 'EIGHTY', 'NINETY'];
  const scales = ['', 'THOUSAND', 'MILLION', 'BILLION'];

  function numberToWordsHelper(n) {
      if (n < 20) return belowTwenty[n];
      if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 ? '-' + belowTwenty[n % 10] : '');
      if (n < 1000) return belowTwenty[Math.floor(n / 100)] + ' HUNDRED' + (n % 100 ? ' AND ' + numberToWordsHelper(n % 100) : '');

      for (let i = 0, unit = 1; i < scales.length; i++, unit *= 1000) {
          if (n < unit * 1000) {
              return numberToWordsHelper(Math.floor(n / unit)) + ' ' + scales[i] + (n % unit ? ', ' + numberToWordsHelper(n % unit) : '');
          }
      }
  }

  const words = numberToWordsHelper(realNum); 
  return words + ' NAIRA ONLY';
}


export const formatNumberWithCommas = (number) => {
  // Convert the input to a number if it's a string
  const numericValue = Math.floor(Number(number)); 

  // Check if numericValue is a valid number
  if (!isNaN(numericValue)) {
    // If it's a valid number, format it with commas
    const num = numericValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return num + ".00"  
  } else {
    // If it's not a valid number, return the original input
    return number; 
  }  
};



export const getWelcomeName = () => {
  const GoogleUser = useSelector(state =>state?.invoices?.GoogleUser )
  const UserName = useSelector(state => state?.invoices?.UserName ) 
  if(GoogleUser?.name) {
    return GoogleUser?.name
  }

  if(UserName?.displayName) {
    return UserName?.displayName
  } 
  return ""
}

export const getName = () => {
  const GoogleUser = useSelector(state =>state?.invoices?.GoogleUser )
const UserName = useSelector(state => state?.invoices?.UserName ) 


  if(GoogleUser?.name) {
    return `
    <p class="color" >Sales Rep.: ${GoogleUser?.name}</p>
    `
  } 

  if(UserName?.displayName) {
    return ` 
    <p class="color" >Sales Rep.: ${UserName?.displayName}</p>  
    `
  }
  return ``
}

export const getProductItem = () => {

  const user = useSelector(state => state?.invoices?.user)

  const fetchItem = () => {
    firestore() 
    .collection('ProductItem')
    .where('userId', '==', user?.uid)
    .get() 
    .then(querySnapshot => {
        const newProductItem = []; 
        querySnapshot.forEach(documentSnapshot => {
          newProductItem.push({
            uid: documentSnapshot.id,
            ...(documentSnapshot.data() || {}),
          }); 
        });
       
        //function to get the latest invoice. 
  const sortedInvoices =  newProductItem.sort((a, b) => b.invoiceDate - a.invoiceDate); 
         dispatch(setProductItem(sortedInvoices[0]));    
         dispatch(setAllProduct(sortedInvoices));    
    });  
  }
  fetchItem()
    return (
      <Text>Book</Text>
    )
}

export const extractTimestamp = (path) => {
  const segments = path.split(".");
  const timestampSegment = segments[segments.length - 2];
  const timestamp = timestampSegment.substring(timestampSegment.length - 13);
  return timestamp; 
}


export const convertDate = (date) => {

  const dateObj = new Date(date);
  const day = dateObj.getDate();
  const month = dateObj.getMonth() + 1; 
  const year = dateObj.getFullYear().toString().slice(-2); 

  const formattedDate = `${day}/${month}/${year}`;
  
  return formattedDate;
}

export const calculateTotalAmount = (items) => {
  const totalAmount = items?.reduce((total, item) => total + item.Amount, 0);
  return totalAmount;
};     