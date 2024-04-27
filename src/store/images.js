import {createSlice} from '@reduxjs/toolkit';

export const imagesSlice = createSlice({
  name: 'images', 
  initialState: { 
    data: null,
    toUpdate: null,  
  },
  reducers: {
    setImages: (state, action) => {
      state.data = action.payload;
    },
    setToUpdate: state => { 
      state.toUpdate = Math.random();
    },
  }, 
}); 

// Action creators are generated for each case reducer function
export const {setImages, setToUpdate} = imagesSlice.actions;

export default imagesSlice.reducer;   