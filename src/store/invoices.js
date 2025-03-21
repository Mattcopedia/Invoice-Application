import {createSlice,createAsyncThunk} from '@reduxjs/toolkit';
import firestore from '@react-native-firebase/firestore';
import { fetchProductItem } from './redux-thunks/ProductItemThunk';
import { fetchInvoiceData } from './redux-thunks/InvoiceDataThunk';
import { fetchproductInvoice } from './redux-thunks/ProductInvoiceThunk';
import { fetchselectedItem } from './redux-thunks/selectedItemThunk';
import { fetchSummaryData } from './redux-thunks/SummaryThunk';
import { fetchGeneratedInvoice } from './redux-thunks/GeneratedInvoiceThunk';
import { fetchProductSelect } from './redux-thunks/ProductSelectThunk';
import { fetchRefurbish } from './redux-thunks/RefurbishThunk';
import { fetchRefurbishSummary } from './redux-thunks/RefurbishSummaryThunk';
import { fetchGeneratedRefurbishInvoice } from './redux-thunks/RefurbishList';
import { fetchReceipt } from './redux-thunks/ReceiptThunk';

export const invoicesSlice = createSlice({
  name: 'invoices',
  initialState: { 
    data: null,
    toUpdate: null,
    InvoiceCreated: false,
    subTotal: "",

    allProduct: [], 
    allProductLoading: false,  
    allProductError: false, 

    GoogleUser: "",
    images:"",
    ProductItem: [],
    summary: null, 
    user: null, 
    UserName: "",
    selectedItem: [], 
    addProduct:[],
    filteredSelectedItem: [],

    GeneratedInvoice:[], 
    GeneratedInvoiceLoading: false,
    GeneratedInvoiceError: null,
    
    InvoiceList:[], 
    RefurbishInvoiceList: [],
    specificInvoice: "",
    productSelect: [], 
    receipt:[], 

    receiptStore: [], 
    receiptStoreLoading: false,
    receiptStore: null, 

    checkBoxSelectedItems: [],
    refurbish:[],
    refurbishSummary: [],

    GeneratedRefurbishInvoiceList: [],
    GeneratedRefurbishInvoiceListLoading: false,
    GeneratedRefurbishInvoiceListError: null,

    receiptList: [], 
    duplicateInvoiceList:[],
    invoiceLatest: [],
    summaryLatest: [], 
    refurbishSummaryLatest: [],
    selectField: [],
  },  


  extraReducers: (builder) => {
   
    builder.addCase(fetchProductItem.pending, (state) => {
      state.allProductLoading = true;  
      state.allProductError = null; 
    })
    .addCase(fetchProductItem.fulfilled,(state,action) => {
      state.allProductLoading = false;  
      state.allProduct = action.payload     
    })
    .addCase(fetchProductItem.rejected,(state,action) => {
      state.allProductLoading = false;  
      state.allProductError = action.payload;    
    })


    builder.addCase(fetchInvoiceData.fulfilled,(state,action) => {
      state.data = action.payload
    })  
    builder.addCase(fetchproductInvoice.fulfilled,(state,action) => {
      state.addProduct = action.payload //you must filter
    }) 
    builder.addCase(fetchselectedItem.fulfilled,(state,action) => {
      state.selectedItem = action.payload
    }) 
    builder.addCase(fetchSummaryData.fulfilled,(state,action) => {
      state.summary = action.payload
    }) 

    builder.addCase(fetchGeneratedInvoice.pending, (state) => {
      state.GeneratedInvoiceLoading = true; 
      state.GeneratedInvoiceError = null;
    })
    .addCase(fetchGeneratedInvoice.fulfilled,(state,action) => {
      state.GeneratedInvoiceLoading = false;
      state.GeneratedInvoice = action.payload  
    })
    .addCase(fetchGeneratedInvoice.rejected, (state, action) => {
      state.GeneratedInvoiceLoading = false;  
      state.GeneratedInvoiceError = action.payload;  
    });
    
    builder.addCase(fetchProductSelect.fulfilled,(state,action) => {
      state.productSelect = action.payload  
    }) 



    builder.addCase(fetchReceipt.pending, (state) => {
      state.receiptStoreLoading = true;  
      state.receiptStoreError = null;
    })
    .addCase(fetchReceipt.fulfilled,(state,action) => {
      state.receiptStoreLoading = false;  
      state.receiptStore = action.payload     
    }) 
    .addCase(fetchReceipt.rejected,(state,action) => {
      state.receiptStoreLoading = false;  
      state.receiptStoreError = action.payload;     
    })



    builder.addCase(fetchRefurbish.fulfilled,(state,action) => {
      state.refurbish = action.payload     
    }) 
    builder.addCase(fetchRefurbishSummary.fulfilled,(state,action) => {
      state.refurbishSummary = action.payload     
    }) 


    builder.addCase(fetchGeneratedRefurbishInvoice.pending, (state) => {
      state.GeneratedRefurbishInvoiceListLoading = true;  
      state.GeneratedRefurbishInvoiceListError = null;
    })
    .addCase(fetchGeneratedRefurbishInvoice.fulfilled,(state,action) => {
      state.GeneratedRefurbishInvoiceListLoading = false;  
      state.GeneratedRefurbishInvoiceList = action.payload     
    }) 
    .addCase(fetchGeneratedRefurbishInvoice.rejected,(state,action) => {
      state.GeneratedRefurbishInvoiceListLoading = false;  
      state.GeneratedRefurbishInvoiceListError = action.payload;     
    })

  },  
  

  reducers: {
    setInvoices: (state, action) => {
      state.data = action.payload;
    },
    setToUpdate: state => { 
      state.toUpdate = Math.random();
    },
    setinvoiceCreated: (state, action) => {
      state.InvoiceCreated = action.payload;
    },
    setSubTotal: (state, action) => {
      state.subTotal = action.payload
    },
    setAllProduct: (state, action) => {
      state.allProduct = action.payload;
    },
    setGoogleUser: (state, action) => {
      state.GoogleUser = action.payload;
    },
    setImages: (state, action) => {
      state.images = action.payload;
    },
    setProductItem: (state, action) => {
      state.ProductItem = action.payload;
    },
    setSummary: (state, action) => {
      state.summary = action.payload;
    },
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setUserName: (state, action) => {
      state.UserName = action.payload;
    }, 
    setSelectedItem: (state, action) => {
      state.selectedItem = action.payload;  
    }, 
    setGeneratedInvoice: (state, action) => { 
      state.GeneratedInvoice = action.payload;  
    }, 
    setInvoiceList: (state, action) => {
      state.InvoiceList = action.payload;  
    },  
    setRefurbishInvoiceList: (state, action) => {
      state.RefurbishInvoiceList = action.payload;   
    },  
    setfilteredSelectedItem: (state, action) => {
      state.filteredSelectedItem = action.payload;  
    },  
    setAddProduct: (state,action) => {
      state.addProduct = action.payload;  
    },
    setSpecificInvoice: (state,action) => {
      state.specificInvoice = action.payload;  
    },
    setReceipt: (state,action) => {
      state.receipt = action.payload;  
    },
    setReceiptList: (state,action) => {
      state.receiptList = action.payload;  
    }, 
    setCheckBoxSelectedItem: (state,action) => {
      state.checkBoxSelectedItems = action.payload;  
    },
    setRefurbish: (state,action) => {
      state.refurbish = action.payload;    
    }, 
    setRefurbishSummary: (state,action) => {
      state.refurbishSummary = action.payload;    
    },   
    setGeneratedRefurbishInvoiceList: (state,action) => {
      state.GeneratedRefurbishInvoiceList = action.payload;    
    },   
    setDuplicateInvoiceList: (state,action) => {
      state.duplicateInvoiceList = action.payload     
    }, 
    setInvoiceLatest: (state,action) => {
      state.invoiceLatest = action.payload     
    },
    setSummaryLatest: (state,action) => {
      state.summaryLatest = action.payload     
    },
    setRefurbishSummaryLatest : (state,action) => {
      state.refurbishSummaryLatest = action.payload     
    },
    setSelectField : (state,action) => {
      state.selectField = action.payload     
    },
  },  
});

// Action creators are generated for each case reducer function
export const {setInvoices, setToUpdate,setinvoiceCreated,setAllProduct,setGoogleUser,
setImages,setProductItem,setSummary,setUser,setUserName,setSubTotal,setSelectedItem,setGeneratedInvoice
,setInvoiceList,setfilteredSelectedItem,setAddProduct,setSpecificInvoice,setReceipt,setCheckBoxSelectedItem,setRefurbish,
setRefurbishSummary,setGeneratedRefurbishInvoiceList, setRefurbishInvoiceList,setReceiptList,setDuplicateInvoiceList,
setRefurbishSummaryLatest,setSummaryLatest,setInvoiceLatest,setSelectField
 } = invoicesSlice.actions; 

export default invoicesSlice.reducer;   