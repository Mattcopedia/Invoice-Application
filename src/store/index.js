import { configureStore } from '@reduxjs/toolkit';
import userSlice from './user';
import tasksSlice from './tasks';
import invoicesSlice from './invoices'; 
import  imagesSlice from './images';

export default configureStore({
  reducer: { 
    user: userSlice,
    tasks: tasksSlice,
    invoices: invoicesSlice, 
    images:imagesSlice,     
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({ serializableCheck: false }),
});
