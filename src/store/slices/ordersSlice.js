import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as api from '../../api';

// Async thunks
export const fetchOrders = createAsyncThunk(
  'orders/fetchOrders',
  async ({ role, userId }, { rejectWithValue }) => {
    try {
      const orders = await api.getOrdersByRole(role, userId);
      return orders;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchOrderById = createAsyncThunk(
  'orders/fetchOrderById',
  async (orderId, { rejectWithValue }) => {
    try {
      const order = await api.getOrderById(orderId);
      return order;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createOrder = createAsyncThunk(
  'orders/createOrder',
  async (orderData, { rejectWithValue }) => {
    try {
      const order = await api.createOrder(orderData);
      return order;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateOrderStatus = createAsyncThunk(
  'orders/updateOrderStatus',
  async ({ orderId, status }, { rejectWithValue }) => {
    try {
      const order = await api.updateOrderStatus(orderId, status);
      return order;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const assignDriver = createAsyncThunk(
  'orders/assignDriver',
  async ({ orderId, driverId }, { rejectWithValue }) => {
    try {
      const order = await api.assignOrderToDriver(orderId, driverId);
      return order;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteOrder = createAsyncThunk(
  'orders/deleteOrder',
  async (orderId, { rejectWithValue }) => {
    try {
      await api.deleteOrder(orderId);
      return orderId;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const uploadProof = createAsyncThunk(
  'orders/uploadProof',
  async ({ orderId, imageUri }, { rejectWithValue }) => {
    try {
      const order = await api.uploadProof(orderId, imageUri);
      return order;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchDashboardStats = createAsyncThunk(
  'orders/fetchDashboardStats',
  async ({ role, userId }, { rejectWithValue }) => {
    try {
      const stats = await api.getDashboardStats(role, userId);
      return stats;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const ordersSlice = createSlice({
  name: 'orders',
  initialState: {
    orders: [],
    currentOrder: null,
    stats: {
      total: 0,
      placed: 0,
      shipped: 0,
      delivered: 0,
    },
    loading: false,
    error: null,
    filter: 'ALL', // ALL, PLACED, SHIPPED, DELIVERED
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setFilter: (state, action) => {
      state.filter = action.payload;
    },
    clearCurrentOrder: (state) => {
      state.currentOrder = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch orders
    builder.addCase(fetchOrders.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchOrders.fulfilled, (state, action) => {
      state.loading = false;
      state.orders = action.payload;
    });
    builder.addCase(fetchOrders.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
    
    // Fetch single order
    builder.addCase(fetchOrderById.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchOrderById.fulfilled, (state, action) => {
      state.loading = false;
      state.currentOrder = action.payload;
    });
    builder.addCase(fetchOrderById.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
    
    // Create order
    builder.addCase(createOrder.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(createOrder.fulfilled, (state, action) => {
      state.loading = false;
      state.orders.push(action.payload);
    });
    builder.addCase(createOrder.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
    
    // Update order status
    builder.addCase(updateOrderStatus.fulfilled, (state, action) => {
      const index = state.orders.findIndex(o => o.id === action.payload.id);
      if (index !== -1) {
        state.orders[index] = action.payload;
      }
      if (state.currentOrder?.id === action.payload.id) {
        state.currentOrder = action.payload;
      }
    });
    
    // Assign driver
    builder.addCase(assignDriver.fulfilled, (state, action) => {
      const index = state.orders.findIndex(o => o.id === action.payload.id);
      if (index !== -1) {
        state.orders[index] = action.payload;
      }
      if (state.currentOrder?.id === action.payload.id) {
        state.currentOrder = action.payload;
      }
    });
    
    // Delete order
    builder.addCase(deleteOrder.fulfilled, (state, action) => {
      state.orders = state.orders.filter(o => o.id !== action.payload);
    });
    
    // Upload proof
    builder.addCase(uploadProof.fulfilled, (state, action) => {
      const index = state.orders.findIndex(o => o.id === action.payload.id);
      if (index !== -1) {
        state.orders[index] = action.payload;
      }
      if (state.currentOrder?.id === action.payload.id) {
        state.currentOrder = action.payload;
      }
    });
    
    // Dashboard stats
    builder.addCase(fetchDashboardStats.fulfilled, (state, action) => {
      state.stats = action.payload;
    });
  },
});

export const { clearError, setFilter, clearCurrentOrder } = ordersSlice.actions;
export default ordersSlice.reducer;