import React from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ToastContainer = () => {
  const notify = () => {
    toast.success("This is a success message!");
    toast.error("This is an error message!");
  };

  return (
    <div>
      <h1>Toast Notification Example</h1>
      <button onClick={notify}>Show Toasts</button>
      <ToastContainer 
        position="top-right" // You can change the position here
        autoClose={5000} // Time in milliseconds before the toast disappears
        hideProgressBar={false} // Show progress bar
        newestOnTop={false} // Newest toast on top
        closeOnClick // Close on click
        rtl={false} // Right to left
        pauseOnFocusLoss 
        draggable 
        pauseOnHover 
      />
    </div>
  );
};

export default ToastContainer;