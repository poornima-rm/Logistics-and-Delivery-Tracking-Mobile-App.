import usersData from '../data/users.json';
import ordersData from '../data/orders.json';
import driversData from '../data/drivers.json';

// In-memory storage (simulates database)
let users = [...usersData.users];
let orders = [...ordersData.orders];
let drivers = [...driversData.drivers];

// Simulate network delay
const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

// Generate unique IDs
const generateId = (prefix) => `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

// ============= AUTH APIs =============
export const authLogin = async (credentials) => {
  await delay(800);
  
  const { email, password } = credentials;
  const user = users.find(u => 
    (u.email === email || u.phone === email) && u.password === password
  );
  
  if (!user) {
    throw new Error('Invalid credentials');
  }
  
  const { password: _, ...userWithoutPassword } = user;
  return {
    user: userWithoutPassword,
    token: `mock_token_${user.id}`,
  };
};

export const authSignup = async (data) => {
  await delay(800);
  
  const { email, phone, password, name, role = 'customer' } = data;
  
  // Check if user exists
  const existingUser = users.find(u => u.email === email || u.phone === phone);
  if (existingUser) {
    throw new Error('User already exists');
  }
  
  const newUser = {
    id: generateId('user'),
    email,
    phone,
    password,
    name,
    role,
    address: data.address || '',
    vehicleNumber: data.vehicleNumber || null,
  };
  
  users.push(newUser);
  
  const { password: _, ...userWithoutPassword } = newUser;
  return {
    user: userWithoutPassword,
    token: `mock_token_${newUser.id}`,
  };
};

export const verifyOTP = async (otp) => {
  await delay(500);
  
  // Mock OTP verification - always succeeds with 1234
  if (otp === '1234') {
    return { success: true };
  }
  
  throw new Error('Invalid OTP');
};

export const forgotPassword = async (email) => {
  await delay(800);
  
  const user = users.find(u => u.email === email || u.phone === email);
  if (!user) {
    throw new Error('User not found');
  }
  
  return { success: true, message: 'Password reset link sent to your email' };
};

// ============= ORDER APIs =============
export const getOrdersByRole = async (role, userId) => {
  await delay(600);
  
  if (role === 'customer') {
    return orders.filter(o => o.customerId === userId);
  } else if (role === 'driver') {
    return orders.filter(o => o.driverId === userId);
  } else if (role === 'admin') {
    return orders;
  }
  
  return [];
};

export const getOrderById = async (orderId) => {
  await delay(400);
  
  const order = orders.find(o => o.id === orderId);
  if (!order) {
    throw new Error('Order not found');
  }
  
  return order;
};

export const createOrder = async (orderData) => {
  await delay(800);
  
  const newOrder = {
    id: generateId('order'),
    customerId: orderData.customerId,
    customerName: orderData.customerName,
    address: orderData.address,
    deliveryType: orderData.deliveryType,
    paymentMethod: orderData.paymentMethod,
    amount: orderData.amount,
    status: 'PLACED',
    driverId: null,
    driverName: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    proofImageUri: null,
    packageDetails: orderData.packageDetails || '',
  };
  
  orders.push(newOrder);
  return newOrder;
};

export const updateOrderStatus = async (orderId, status) => {
  await delay(500);
  
  const orderIndex = orders.findIndex(o => o.id === orderId);
  if (orderIndex === -1) {
    throw new Error('Order not found');
  }
  
  orders[orderIndex] = {
    ...orders[orderIndex],
    status,
    updatedAt: new Date().toISOString(),
  };
  
  return orders[orderIndex];
};

export const assignOrderToDriver = async (orderId, driverId) => {
  await delay(500);
  
  const orderIndex = orders.findIndex(o => o.id === orderId);
  if (orderIndex === -1) {
    throw new Error('Order not found');
  }
  
  const driver = drivers.find(d => d.id === driverId);
  if (!driver) {
    throw new Error('Driver not found');
  }
  
  orders[orderIndex] = {
    ...orders[orderIndex],
    driverId,
    driverName: driver.name,
    updatedAt: new Date().toISOString(),
  };
  
  return orders[orderIndex];
};

export const deleteOrder = async (orderId) => {
  await delay(500);
  
  const orderIndex = orders.findIndex(o => o.id === orderId);
  if (orderIndex === -1) {
    throw new Error('Order not found');
  }
  
  orders.splice(orderIndex, 1);
  return { success: true, message: 'Order deleted successfully' };
};

export const uploadProof = async (orderId, imageUri) => {
  await delay(700);
  
  const orderIndex = orders.findIndex(o => o.id === orderId);
  if (orderIndex === -1) {
    throw new Error('Order not found');
  }
  
  orders[orderIndex] = {
    ...orders[orderIndex],
    proofImageUri: imageUri,
    updatedAt: new Date().toISOString(),
  };
  
  return orders[orderIndex];
};

// ============= DRIVER APIs =============
export const getDrivers = async () => {
  await delay(400);
  return drivers;
};

export const getDriverById = async (driverId) => {
  await delay(300);
  
  const driver = drivers.find(d => d.id === driverId);
  if (!driver) {
    throw new Error('Driver not found');
  }
  
  return driver;
};

// ============= STATISTICS APIs =============
export const getDashboardStats = async (role, userId) => {
  await delay(500);
  
  let relevantOrders = orders;
  
  if (role === 'customer') {
    relevantOrders = orders.filter(o => o.customerId === userId);
  } else if (role === 'driver') {
    relevantOrders = orders.filter(o => o.driverId === userId);
  }
  
  return {
    total: relevantOrders.length,
    placed: relevantOrders.filter(o => o.status === 'PLACED').length,
    shipped: relevantOrders.filter(o => o.status === 'SHIPPED').length,
    delivered: relevantOrders.filter(o => o.status === 'DELIVERED').length,
  };
};
