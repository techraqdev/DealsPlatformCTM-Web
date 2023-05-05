import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { MessageType } from './enumContainer';

export const toastMessage = (messageType: number, message: string, time = 15000) => {
  if (messageType === MessageType.Success) {
    toast.success(message, {
      position: toast.POSITION.BOTTOM_RIGHT,
      hideProgressBar: false,
      autoClose: time,
      closeOnClick: true,
      pauseOnFocusLoss: false,
    });
  } else if (messageType === MessageType.Error) {
    toast.error(message, {
      position: toast.POSITION.BOTTOM_RIGHT,
      hideProgressBar: false,
      autoClose: time,
      closeOnClick: true,
      pauseOnFocusLoss: false,
    });
  } else if (messageType === MessageType.Warning) {
    toast.error(message, {
      position: toast.POSITION.BOTTOM_RIGHT,
      hideProgressBar: false,
      autoClose: time,
      closeOnClick: true,
      pauseOnFocusLoss: false,
    });
  } else {
    toast(message, {
      position: toast.POSITION.BOTTOM_RIGHT,
      hideProgressBar: false,
      autoClose: time,
      closeOnClick: true,
      pauseOnFocusLoss: false,
    });
  }
};
