import {createSlice,createAsyncThunk} from '@reduxjs/toolkit';
import firestore from '@react-native-firebase/firestore';
import { fetchProductItem } from './redux-thunks/ProductItemThunk';
import { fetchInvoiceData } from './redux-thunks/InvoiceDataThunk';
import { fetchproductInvoice } from './redux-thunks/ProductInvoiceThunk';
import { fetchselectedItem } from './redux-thunks/selectedItemThunk';
import { fetchSummaryData } from './redux-thunks/SummaryThunk';
import { fetchGeneratedInvoice } from './redux-thunks/GeneratedInvoiceThunk';
import { fetchProductSelect } from './redux-thunks/ProductSelectThunk';


 
export const invoicesSlice = createSlice({
  name: 'invoices',
  initialState: { 
    data: null,
    toUpdate: null,
    InvoiceCreated: false,
    subTotal: "",
    allProduct: [],
    GoogleUser: "",
    images:"",
    ProductItem: [],
    summary: null, 
    user: null, 
    UserName: "",
    selectedItem: [], 
    filteredSelectedItem: [],
    GeneratedInvoice:[],
    InvoiceList:[],
    addProduct:[],
    specificInvoice: "",
    productSelect: []
  },


  extraReducers: (builder) => {
    builder.addCase(fetchProductItem.fulfilled,(state,action) => {
      state.allProduct = action.payload
    }) 
    builder.addCase(fetchInvoiceData.fulfilled,(state,action) => {
      state.data = action.payload
    }) 
    builder.addCase(fetchproductInvoice.fulfilled,(state,action) => {
      state.addProduct = action.payload
    }) 
    builder.addCase(fetchselectedItem.fulfilled,(state,action) => {
      state.selectedItem = action.payload
    }) 
    builder.addCase(fetchSummaryData.fulfilled,(state,action) => {
      state.summary = action.payload
    }) 
    builder.addCase(fetchGeneratedInvoice.fulfilled,(state,action) => {
      state.GeneratedInvoice = action.payload  
    }) 
    builder.addCase(fetchProductSelect.fulfilled,(state,action) => {
      state.productSelect = action.payload  
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
    setfilteredSelectedItem: (state, action) => {
      state.filteredSelectedItem = action.payload;  
    },  
    setAddProduct: (state,action) => {
      state.addProduct = action.payload;  
    },
    setSpecificInvoice: (state,action) => {
      state.specificInvoice = action.payload;  
    }
  }, 
});

// Action creators are generated for each case reducer function
export const {setInvoices, setToUpdate,setinvoiceCreated,setAllProduct,setGoogleUser,
setImages,setProductItem,setSummary,setUser,setUserName,setSubTotal,setSelectedItem,setGeneratedInvoice
,setInvoiceList,setfilteredSelectedItem,setAddProduct,setSpecificInvoice
 } = invoicesSlice.actions;

export default invoicesSlice.reducer;   