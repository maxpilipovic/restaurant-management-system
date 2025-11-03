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
  console.log(req.body);

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

//Get route
app.get('/api/tables', async (req, res) => {
  try {
    const { data, error } = await supabase.from('tables').select('*');
    if (error) {
      return res.status(500).json({ error: 'Failed to fetch tables' });
    }
    res.json(data);
  } catch (error) {
    console.error(error);
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

//PATCH route to update order status
app.patch('/api/orders/:id', async (req, res) => {
  const { id } = req.params;
  const { order_status } = req.body;

  try {
    const { data, error } = await supabase
      .from('orders')
      .update({ order_status })
      .eq('order_id', id)
      .select();

    if (error) {
      return res.status(500).json({ error: 'Failed to update order status' });
    }

    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

//GET REQUEST FOR MENU ITEMS
app.get('/api/menu_items', async (req, res) => {
  try {
    const { data, error } = await supabase.from('menu_items').select('*');
    if (error) {
      return res.status(500).json({ error: 'Failed to fetch menu items' });
    }
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

//POST 
app.put('/api/tables/:id', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const { data, error } = await supabase
      .from('tables')
      .update({ status })
      .eq('table_id', id)
      .select();

    if (error) {
      return res.status(500).json({ error: 'Failed to update table status' });
    }

    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

//GET ROLES
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

//PUT to updat role
app.put('/api/users/:id/role', async (req, res) => {
  const { id } = req.params;
  const { role_id } = req.body;

  try {
    const { data, error } = await supabase
      .from('users')
      .update({ role_id })
      .eq('user_id', id)
      .select();

    if (error) {
      return res.status(500).json({ error: 'Failed to update user role' });
    }

    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

//DELETE worker
app.delete('/api/users/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const { data, error } = await supabase
      .from('users')
      .delete()
      .eq('user_id', id)
      .select();

    if (error) {
      return res.status(500).json({ error: 'Failed to delete user' });
    }

    res.json({ message: 'User deleted successfully', data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.put('/api/users/:id/unassign-tables', async (req, res) => {
  const { id } = req.params;

  try {
    const { error } = await supabase
      .from('tables')
      .update({ assigned_waiter_id: null })
      .eq('assigned_waiter_id', id);

    if (error) throw error;

    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to unassign tables' });
  }
});

//PUT to assign table to waiter
app.put('/api/tables/:id/assign', async (req, res) => {
  const { id } = req.params;
  const { assigned_waiter_id } = req.body;

  try {
    const { data, error } = await supabase
      .from('tables')
      .update({ assigned_waiter_id })
      .eq('table_id', id)
      .select();

    if (error) {
      return res.status(500).json({ error: 'Failed to assign table to waiter' });
    }

    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

//MENU API CALLS
//Add menu item
app.post('/api/menu_items/add', async (req, res) => {
  const { name, price } = req.body;

  try {
    const { data, error } = await supabase
      .from('menu_items')
      .insert([{ name, price}])
      .select();

    if (error) {
      return res.status(500).json({ error: 'Failed to add menu item' });
    }

    res.json(data[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

//Delete menu item
app.delete('/api/menu_items/:id/delete_menuitem', async (req, res) => {
  const { id } = req.params;

  try {
    const { data, error } = await supabase
      .from('menu_items')
      .delete()
      .eq('item_id', id)
      .select();

    if (error) {
      return res.status(500).json({ error: 'Failed to delete menu item' });
    }

    res.json({ message: 'Menu item deleted successfully', data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

//Change price of menu item
app.put('/api/menu_items/:id/change', async (req, res) => {
  const { id } = req.params;
  const { price } = req.body;

  try {
    const { data, error } = await supabase
      .from('menu_items')
      .update({ price })
      .eq('item_id', id)
      .select();

    if (error) {
      return res.status(500).json({ error: 'Failed to update menu item price' });
    }

    res.json(data[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});