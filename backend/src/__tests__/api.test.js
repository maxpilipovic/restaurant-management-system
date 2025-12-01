import { jest } from '@jest/globals';
import request from 'supertest';
import express from 'express';

// Create a test app with the same routes as the main app
const app = express();
app.use(express.json());

// Mock Supabase client
const mockSupabaseClient = {
  from: jest.fn(() => mockSupabaseClient),
  select: jest.fn(() => mockSupabaseClient),
  insert: jest.fn(() => mockSupabaseClient),
  update: jest.fn(() => mockSupabaseClient),
  delete: jest.fn(() => mockSupabaseClient),
  eq: jest.fn(() => mockSupabaseClient),
  single: jest.fn(() => mockSupabaseClient),
};

// Basic route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Restaurant Management System API',
    version: '1.0.0',
    status: 'running'
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Test API routes with mocked Supabase
app.get('/api/roles', async (req, res) => {
  try {
    const result = mockSupabaseClient.from('roles').select('*');
    const resolvedResult = result instanceof Promise ? await result : result;
    if (resolvedResult.error) {
      return res.status(500).json({ error: 'Failed to fetch roles' });
    }
    res.json(resolvedResult.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/users', async (req, res) => {
  try {
    const result = mockSupabaseClient.from('users').select('*');
    const resolvedResult = result instanceof Promise ? await result : result;
    if (resolvedResult.error) {
      return res.status(500).json({ error: 'Failed to fetch users' });
    }
    res.json(resolvedResult.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/tables', async (req, res) => {
  try {
    const result = mockSupabaseClient.from('tables').select('*');
    const resolvedResult = result instanceof Promise ? await result : result;
    if (resolvedResult.error) {
      return res.status(500).json({ error: 'Failed to fetch tables' });
    }
    res.json(resolvedResult.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/menu_items', async (req, res) => {
  try {
    const result = mockSupabaseClient.from('menu_items').select('*');
    const resolvedResult = result instanceof Promise ? await result : result;
    if (resolvedResult.error) {
      return res.status(500).json({ error: 'Failed to fetch menu items' });
    }
    res.json(resolvedResult.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/orders', async (req, res) => {
  try {
    const result = mockSupabaseClient.from('orders').select('*');
    const resolvedResult = result instanceof Promise ? await result : result;
    if (resolvedResult.error) {
      return res.status(500).json({ error: 'Failed to fetch orders' });
    }
    res.json(resolvedResult.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/roles', async (req, res) => {
  const { rolename, permission_level } = req.body;
  try {
    const result = mockSupabaseClient
      .from('roles')
      .insert([{ rolename, permission_level }])
      .select();
    const resolvedResult = result instanceof Promise ? await result : result;
    if (resolvedResult.error) {
      return res.status(500).json({ error: 'Failed to add role data' });
    }
    res.status(201).json(resolvedResult.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/users', async (req, res) => {
  const { first_name, last_name, role_id, pin_code, is_active } = req.body;
  try {
    const result = mockSupabaseClient
      .from('users')
      .insert([{ first_name, last_name, role_id, pin_code, is_active }])
      .select();
    const resolvedResult = result instanceof Promise ? await result : result;
    if (resolvedResult.error) {
      return res.status(500).json({ error: 'Failed to add user data' });
    }
    res.status(201).json(resolvedResult.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/tables', async (req, res) => {
  const { table_number, status, assigned_waiter_id } = req.body;
  try {
    const result = mockSupabaseClient
      .from('tables')
      .insert([{ table_number, status, assigned_waiter_id }])
      .select();
    const resolvedResult = result instanceof Promise ? await result : result;
    if (resolvedResult.error) {
      return res.status(500).json({ error: 'Failed to add table data' });
    }
    res.status(201).json(resolvedResult.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.put('/api/tables/:id', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    const result = mockSupabaseClient
      .from('tables')
      .update({ status })
      .eq('table_id', id)
      .select();
    const resolvedResult = result instanceof Promise ? await result : result;
    if (resolvedResult.error) {
      return res.status(500).json({ error: 'Failed to update table status' });
    }
    res.json(resolvedResult.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/orders', async (req, res) => {
  const { table_id, waiter_id, order_status, total_amount, tip_amount } = req.body;
  try {
    const result = mockSupabaseClient
      .from('orders')
      .insert([{ table_id, waiter_id, order_status, total_amount, tip_amount }])
      .select();
    const resolvedResult = result instanceof Promise ? await result : result;
    if (resolvedResult.error) {
      return res.status(500).json({ error: 'Failed to add order data' });
    }
    res.status(201).json(resolvedResult.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.delete('/api/users/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = mockSupabaseClient
      .from('users')
      .delete()
      .eq('user_id', id)
      .select();
    const resolvedResult = result instanceof Promise ? await result : result;
    if (resolvedResult.error) {
      return res.status(500).json({ error: 'Failed to delete user' });
    }
    res.json({ message: 'User deleted successfully', data: resolvedResult.data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

describe('API Endpoints', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset mock to return itself for chaining
    mockSupabaseClient.from.mockReturnValue(mockSupabaseClient);
    mockSupabaseClient.select.mockReturnValue(mockSupabaseClient);
    mockSupabaseClient.insert.mockReturnValue(mockSupabaseClient);
    mockSupabaseClient.update.mockReturnValue(mockSupabaseClient);
    mockSupabaseClient.delete.mockReturnValue(mockSupabaseClient);
    mockSupabaseClient.eq.mockReturnValue(mockSupabaseClient);
  });

  describe('Basic Routes', () => {
    test('GET / should return API information', async () => {
      const response = await request(app).get('/');
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message');
      expect(response.body).toHaveProperty('version', '1.0.0');
      expect(response.body).toHaveProperty('status', 'running');
    });

    test('GET /health should return health status', async () => {
      const response = await request(app).get('/health');
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('status', 'OK');
      expect(response.body).toHaveProperty('timestamp');
    });
  });

  describe('Roles API', () => {
    test('GET /api/roles should fetch all roles', async () => {
      const mockRoles = [
        { role_id: 1, rolename: 'Chef', permission_level: 1 },
        { role_id: 2, rolename: 'Waiter', permission_level: 2 },
      ];
      mockSupabaseClient.select.mockResolvedValue({ data: mockRoles, error: null });

      const response = await request(app).get('/api/roles');
      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockRoles);
      expect(mockSupabaseClient.from).toHaveBeenCalledWith('roles');
    });

    test('GET /api/roles should handle errors', async () => {
      mockSupabaseClient.select.mockResolvedValue({ 
        data: null, 
        error: { message: 'Database error' } 
      });

      const response = await request(app).get('/api/roles');
      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty('error', 'Failed to fetch roles');
    });

    test('POST /api/roles should create a new role', async () => {
      const newRole = { rolename: 'Manager', permission_level: 3 };
      const createdRole = { role_id: 3, ...newRole };
      mockSupabaseClient.select.mockResolvedValue({ data: [createdRole], error: null });

      const response = await request(app)
        .post('/api/roles')
        .send(newRole);

      expect(response.status).toBe(201);
      expect(response.body).toEqual([createdRole]);
      expect(mockSupabaseClient.insert).toHaveBeenCalledWith([newRole]);
    });
  });

  describe('Users API', () => {
    test('GET /api/users should fetch all users', async () => {
      const mockUsers = [
        { user_id: 1, first_name: 'John', last_name: 'Doe', role_id: 1, email: 'john@example.com' },
      ];
      mockSupabaseClient.select.mockResolvedValue({ data: mockUsers, error: null });

      const response = await request(app).get('/api/users');
      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockUsers);
    });

    test('POST /api/users should create a new user', async () => {
      const newUser = {
        first_name: 'Jane',
        last_name: 'Smith',
        role_id: 2,
        pin_code: '1234',
        is_active: true,
      };
      const createdUser = { user_id: 2, ...newUser };
      mockSupabaseClient.select.mockResolvedValue({ data: [createdUser], error: null });

      const response = await request(app)
        .post('/api/users')
        .send(newUser);

      expect(response.status).toBe(201);
      expect(response.body).toEqual([createdUser]);
    });

    test('DELETE /api/users/:id should delete a user', async () => {
      const deletedUser = { user_id: 1, first_name: 'John', last_name: 'Doe' };
      mockSupabaseClient.select.mockResolvedValue({ data: [deletedUser], error: null });

      const response = await request(app).delete('/api/users/1');
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'User deleted successfully');
      expect(mockSupabaseClient.eq).toHaveBeenCalledWith('user_id', '1');
    });
  });

  describe('Tables API', () => {
    test('GET /api/tables should fetch all tables', async () => {
      const mockTables = [
        { table_id: 1, table_number: 1, status: 'available', assigned_waiter_id: null },
      ];
      mockSupabaseClient.select.mockResolvedValue({ data: mockTables, error: null });

      const response = await request(app).get('/api/tables');
      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockTables);
    });

    test('POST /api/tables should create a new table', async () => {
      const newTable = {
        table_number: 5,
        status: 'available',
        assigned_waiter_id: null,
      };
      const createdTable = { table_id: 5, ...newTable };
      mockSupabaseClient.select.mockResolvedValue({ data: [createdTable], error: null });

      const response = await request(app)
        .post('/api/tables')
        .send(newTable);

      expect(response.status).toBe(201);
      expect(response.body).toEqual([createdTable]);
    });

    test('PUT /api/tables/:id should update table status', async () => {
      const updatedTable = { table_id: 1, table_number: 1, status: 'occupied' };
      mockSupabaseClient.select.mockResolvedValue({ data: [updatedTable], error: null });

      const response = await request(app)
        .put('/api/tables/1')
        .send({ status: 'occupied' });

      expect(response.status).toBe(200);
      expect(response.body).toEqual([updatedTable]);
      expect(mockSupabaseClient.update).toHaveBeenCalledWith({ status: 'occupied' });
      expect(mockSupabaseClient.eq).toHaveBeenCalledWith('table_id', '1');
    });
  });

  describe('Menu Items API', () => {
    test('GET /api/menu_items should fetch all menu items', async () => {
      const mockMenuItems = [
        { item_id: 1, name: 'Burger', price: 10.99, category: 'Main', is_available: true },
      ];
      mockSupabaseClient.select.mockResolvedValue({ data: mockMenuItems, error: null });

      const response = await request(app).get('/api/menu_items');
      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockMenuItems);
    });
  });

  describe('Orders API', () => {
    test('GET /api/orders should fetch all orders', async () => {
      const mockOrders = [
        { order_id: 1, table_id: 1, waiter_id: 1, order_status: 'Open', total_amount: 0, tip_amount: 0 },
      ];
      mockSupabaseClient.select.mockResolvedValue({ data: mockOrders, error: null });

      const response = await request(app).get('/api/orders');
      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockOrders);
    });

    test('POST /api/orders should create a new order', async () => {
      const newOrder = {
        table_id: 1,
        waiter_id: 1,
        order_status: 'Open',
        total_amount: 0,
        tip_amount: 0,
      };
      const createdOrder = { order_id: 1, ...newOrder };
      mockSupabaseClient.select.mockResolvedValue({ data: [createdOrder], error: null });

      const response = await request(app)
        .post('/api/orders')
        .send(newOrder);

      expect(response.status).toBe(201);
      expect(response.body).toEqual([createdOrder]);
    });
  });
});
