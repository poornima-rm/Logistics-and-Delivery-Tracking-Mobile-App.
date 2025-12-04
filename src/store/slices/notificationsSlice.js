import { createSlice } from '@reduxjs/toolkit';

let notificationId = 0;

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState: {
    notifications: [],
  },
  reducers: {
    addNotification: (state, action) => {
      const notification = {
        id: ++notificationId,
        message: action.payload.message,
        type: action.payload.type || 'info', // success, error, warning, info
        timestamp: new Date().toISOString(),
      };
      state.notifications.push(notification);
    },
    removeNotification: (state, action) => {
      state.notifications = state.notifications.filter(
        n => n.id !== action.payload
      );
    },
    clearAllNotifications: (state) => {
      state.notifications = [];
    },
  },
});

export const { addNotification, removeNotification, clearAllNotifications } = notificationsSlice.actions;
export default notificationsSlice.reducer;