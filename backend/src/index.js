import dotenv from 'dotenv';
dotenv.config();
import { createClient } from '@supabase/supabase-js';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import e from 'express';



const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);



const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173'
}));
app.use(morgan('combined'));
app.use(express.json());

//Basic route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Restaurant Management System API',
    version: '1.0.0',
    status: 'running'
  });
});

//Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

//Test API routes
app.get('/api/roles', async (req, res) => {
  try {
    const { data, error } = await supabase.from('roles').select('*');
    if (error) {
      return res.status(500).json({ error: 'Failed to fetch roles' });
    }
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/users', async (req, res) => {
  try {
    const { data, error } = await supabase.from('users').select('*');
    if (error) {
      return res.status(500).json({ error: 'Failed to fetch users' });
    }
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


//Not needed
app.post("/api/getRole", async (req, res) => {
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API available at http://localhost:${PORT}`);
});

//Post routes for entering data...

//ROLES TABLE
app.post('/api/roles', async (req, res) => {

  const { rolename, permission_level} = req.body;

  try {
    const { data, error } = await supabase
      .from('roles')
      .insert([{ rolename, permission_level }])
      .select();

    if (error) {
      return res.status(500).json({ error: 'Failed to add role data' });
    }

  } catch (error) {
    console.error(error);
    console.log("Error inserting role data");
    res.status(500).json({ error: 'Internal server error' });
  }
});

//USERS TABLE
app.post('/api/users', async (req, res) => {
  
  const { first_name, last_name, role_id, pin_code, is_active,  } = req.body;

  try {
    const { data, error } = await supabase
      .from('users')
      .insert([{ first_name, last_name, role_id, pin_code, is_active }])
      .select();

    if (error) {
      return res.status(500).json({ error: 'Failed to add user data' });
    }

  } catch (error) {
    console.error(error);
    console.log("Error inserting user data");
    res.status(500).json({ error: 'Internal server error' });
  }
});

//TABLES TABLE
app.post('/api/tables', async (req, res) => {

  const { table_number, status, assigned_waiter_id } = req.body;

  try {
    const { data, error } = await supabase
      .from('tables')
      .insert([{ table_number, status, assigned_waiter_id }])
      .select();

    if (error) {
      console.error("Supabase insert error:", error);
      return res.status(500).json({
        error: 'Failed to add table data',
        details: error
      });
    }

    res.json(data);
  } catch (error) {
    console.error(error);
    console.log("Error inserting table data");
    res.status(500).json({ error: 'Internal server error' });
  }
});

//MENU TABLE
app.post('/api/menu', async (req, res) => {

  const { name, description, price, category, is_available } = req.body;

  try {
    const {data, error } = await supabase
      .from('menu_items')
      .insert([{ name, description, price, category, is_available }])
      .select();
      
    if (error) {
      return res.status(500).json({ error: 'Failed to add menu item data' });
    }
  } catch (error) {
    console.error(error);
    console.log("Error inserting menu item data");
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/menu', async (req, res) => {
  try {
    const { data, error } = await supabase.from('menu_items').select('*');
    if (error) {
      return res.status(500).json({ error: 'Failed to fetch menu items' });
    }
    res.json(data);
  }
  catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

//GET ORDERS TABLE
app.get('/api/orders', async (req, res) => {
  try {
    const { data, error } = await supabase.from('orders').select('*');
    if (error) {
      return res.status(500).json({ error: 'Failed to fetch orders' });
    }
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

//ORDERS TABLE
app.post('/api/orders', async (req, res) => {

  const {table_id, waiter_id, order_status, total_amount, tip_amount } = req.body;

  try {
    const { data, error } = await supabase
      .from('orders')
      .insert([{ table_id, waiter_id, order_status, total_amount, tip_amount }])
      .select();

      if (error) {
      return res.status(500).json({ error: 'Failed to add order data' });
    }

  } catch (error) {
    console.error(error);
    console.log("Error inserting order data");
    res.status(500).json({ error: 'Internal server error' });
  }
});

//ORDER_ITEMS TABLE
app.post('/api/order_items', async (req, res) => {

  const { order_id, item_id, quantity, special_requests } = req.body;

  try {
    const { data, error } = await supabase
      .from('order_items')
      .insert([{ order_id, item_id, quantity, special_requests }])
      .select();

    if (error) {
      console.error("Supabase insert error:", error);
      return res.status(500).json({
        error: 'Failed to add order_item data',
        details: error
      });
    }

  } catch (error) {
    console.error(error);
    console.log("Error inserting order_item data");
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/order_items', async (req, res) => {
  try {
    const { data, error } = await supabase.from('order_items').select('*');
    if (error) {
      return res.status(500).json({ error: 'Failed to fetch order items' });
    }
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


