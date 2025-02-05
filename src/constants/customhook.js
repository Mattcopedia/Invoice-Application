import { useDispatch, useSelector } from 'react-redux';
import { fetchReceipt } from '../store/redux-thunks/ReceiptThunk';
import { useRef } from 'react';

export const useGetRef = () => {
  const canvasRef = useRef(null);

  return canvasRef 
};
