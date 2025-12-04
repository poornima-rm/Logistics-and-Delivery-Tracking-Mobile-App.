import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import ordersReducer from './slices/ordersSlice';
import driversReducer from './slices/driversSlice';
import notificationsReducer from './slices/notificationsSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    orders: ordersReducer,
    drivers: driversReducer,
    notifications: notificationsReducer,
  },
});

export default store;
