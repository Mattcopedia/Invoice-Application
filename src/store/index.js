import { configureStore } from '@reduxjs/toolkit';
import {
  invoicesSlice
} from './invoices'; 

export default configureStore({
  reducer: { 
    invoices:invoicesSlice.reducer
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({ serializableCheck: false }),
});
 