import {createSlice} from '@reduxjs/toolkit';

export const invoicesSlice = createSlice({
  name: 'invoices',
  initialState: { 
    data: null,
    toUpdate: null,
  },
  reducers: {
    setInvoices: (state, action) => {
      state.data = action.payload;
    },
    setToUpdate: state => { 
      state.toUpdate = Math.random();
    },
  },
});

// Action creators are generated for each case reducer function
export const {setInvoices, setToUpdate} = invoicesSlice.actions;

export default invoicesSlice.reducer;   