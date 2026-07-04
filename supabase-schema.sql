-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create admin_users table
CREATE TABLE admin_users (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create products table
CREATE TABLE products (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  price TEXT NOT NULL,
  category TEXT NOT NULL,
  story TEXT,
  material TEXT,
  description TEXT NOT NULL,
  details TEXT[],
  materials TEXT,
  care TEXT,
  options TEXT[],
  images TEXT[],
  featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create sales table
CREATE TABLE sales (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  product_name TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  total_price TEXT NOT NULL,
  customer_email TEXT,
  customer_name TEXT,
  status TEXT DEFAULT 'pending', -- pending, completed, cancelled
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_featured ON products(featured);
CREATE INDEX idx_sales_status ON sales(status);
CREATE INDEX idx_sales_created_at ON sales(created_at);

-- Enable Row Level Security
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales ENABLE ROW LEVEL SECURITY;

-- Create policies for admin_users (only authenticated admins can read/write)
CREATE POLICY "Admins can view all admin users" ON admin_users FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Admins can insert admin users" ON admin_users FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Admins can update admin users" ON admin_users FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Admins can delete admin users" ON admin_users FOR DELETE USING (auth.role() = 'authenticated');

-- Create policies for products (public read, admin write)
CREATE POLICY "Public can view products" ON products FOR SELECT USING (true);
CREATE POLICY "Admins can insert products" ON products FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Admins can update products" ON products FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Admins can delete products" ON products FOR DELETE USING (auth.role() = 'authenticated');

-- Create policies for sales (admin only)
CREATE POLICY "Admins can view all sales" ON sales FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Admins can insert sales" ON sales FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Admins can update sales" ON sales FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Admins can delete sales" ON sales FOR DELETE USING (auth.role() = 'authenticated');

-- Insert default admin user (password: admin123 - should be changed in production)
-- Note: This is a simple hash for demonstration. In production, use proper bcrypt hashing.
INSERT INTO admin_users (email, password_hash, name) 
VALUES ('admin@amapels.com', '$2b$10$placeholder_hash_change_in_production', 'Admin User');
