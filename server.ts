import express, { Request, Response, NextFunction } from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database("hotspot.db");

// Initialize Database
db.exec(`
  CREATE TABLE IF NOT EXISTS vouchers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    code TEXT UNIQUE NOT NULL,
    duration_minutes INTEGER NOT NULL,
    price REAL NOT NULL,
    status TEXT DEFAULT 'active', -- active, used, expired
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    expires_at DATETIME,
    used_at DATETIME,
    upload_limit INTEGER DEFAULT 0, -- in Mbps, 0 means no limit
    download_limit INTEGER DEFAULT 0 -- in Mbps, 0 means no limit
  );

  CREATE TABLE IF NOT EXISTS sessions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    voucher_id INTEGER,
    mac_address TEXT NOT NULL,
    ip_address TEXT,
    start_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    end_time DATETIME,
    bytes_up INTEGER DEFAULT 0,
    bytes_down INTEGER DEFAULT 0,
    FOREIGN KEY(voucher_id) REFERENCES vouchers(id)
  );

  CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value TEXT
  );

  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    role TEXT NOT NULL, -- staff, customer, agent
    email TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS packages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    duration_minutes INTEGER NOT NULL,
    price REAL NOT NULL,
    description TEXT,
    data_limit_mb INTEGER DEFAULT 0, -- 0 means unlimited
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    type TEXT NOT NULL, -- sale, disbursement, float
    amount REAL NOT NULL,
    description TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS customers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    address TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

// Migration: Add expires_at column if it doesn't exist
const tableInfo = db.prepare("PRAGMA table_info(vouchers)").all() as any[];
const hasExpiresAt = tableInfo.some(col => col.name === 'expires_at');
if (!hasExpiresAt) {
  db.exec("ALTER TABLE vouchers ADD COLUMN expires_at DATETIME");
}

const hasFirstUsedAt = tableInfo.some(col => col.name === 'first_used_at');
if (!hasFirstUsedAt) {
  db.exec("ALTER TABLE vouchers ADD COLUMN first_used_at DATETIME");
}

const hasTotalBytesUp = tableInfo.some(col => col.name === 'total_bytes_up');
if (!hasTotalBytesUp) {
  db.exec("ALTER TABLE vouchers ADD COLUMN total_bytes_up INTEGER DEFAULT 0");
}

const hasTotalBytesDown = tableInfo.some(col => col.name === 'total_bytes_down');
if (!hasTotalBytesDown) {
  db.exec("ALTER TABLE vouchers ADD COLUMN total_bytes_down INTEGER DEFAULT 0");
}

const hasUploadLimit = tableInfo.some(col => col.name === 'upload_limit');
if (!hasUploadLimit) {
  db.exec("ALTER TABLE vouchers ADD COLUMN upload_limit INTEGER DEFAULT 0");
}

const hasDownloadLimit = tableInfo.some(col => col.name === 'download_limit');
if (!hasDownloadLimit) {
  db.exec("ALTER TABLE vouchers ADD COLUMN download_limit INTEGER DEFAULT 0");
}

const hasDataLimitMbVoucher = tableInfo.some(col => col.name === 'data_limit_mb');
if (!hasDataLimitMbVoucher) {
  db.exec("ALTER TABLE vouchers ADD COLUMN data_limit_mb INTEGER DEFAULT 0");
}

const packageTableInfo = db.prepare("PRAGMA table_info(packages)").all() as any[];
const hasDataLimitMb = packageTableInfo.some(col => col.name === 'data_limit_mb');
if (!hasDataLimitMb) {
  db.exec("ALTER TABLE packages ADD COLUMN data_limit_mb INTEGER DEFAULT 0");
}

const userTableInfo = db.prepare("PRAGMA table_info(users)").all() as any[];
const hasPassword = userTableInfo.some(col => col.name === 'password');
if (!hasPassword) {
  db.exec("ALTER TABLE users ADD COLUMN password TEXT");
}

const JWT_SECRET = process.env.JWT_SECRET || "asansl-secret-key";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Auth Middleware
  const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).json({ error: "Access denied. No token provided." });

    jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
      if (err) return res.status(403).json({ error: "Invalid or expired token." });
      (req as any).user = user;
      next();
    });
  };

  const checkExpirations = () => {
    db.prepare("UPDATE vouchers SET status = 'expired' WHERE status = 'active' AND expires_at IS NOT NULL AND expires_at < CURRENT_TIMESTAMP").run();
  };

  // Auth Routes
  app.post("/api/auth/login", async (req, res) => {
    const { username, password } = req.body;
    const user = db.prepare("SELECT * FROM users WHERE username = ?").get() as any;

    if (!user || !user.password) {
      return res.status(401).json({ error: "Invalid username or password." });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: "Invalid username or password." });
    }

    const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, JWT_SECRET, { expiresIn: '24h' });
    res.json({ token, user: { id: user.id, username: user.username, role: user.role, email: user.email } });
  });

  app.post("/api/auth/register", async (req, res) => {
    const { username, password, role, email } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
      const result = db.prepare('INSERT INTO users (username, password, role, email) VALUES (?, ?, ?, ?)')
        .run(username, hashedPassword, role || 'staff', email);
      res.json({ success: true, id: result.lastInsertRowid });
    } catch (err) {
      res.status(400).json({ error: 'Username already exists' });
    }
  });

  app.get("/api/auth/me", authenticateToken, (req, res) => {
    res.json((req as any).user);
  });

  // API Routes
  app.get("/api/stats", authenticateToken, (req, res) => {
    checkExpirations();
    const activeVouchers = db.prepare("SELECT COUNT(*) as count FROM vouchers WHERE status = 'active'").get() as { count: number };
    const totalRevenue = db.prepare("SELECT SUM(price) as total FROM vouchers WHERE status = 'used'").get() as { total: number };
    const activeSessions = db.prepare("SELECT COUNT(*) as count FROM sessions WHERE end_time IS NULL OR end_time > CURRENT_TIMESTAMP").get() as { count: number };
    
    // System Insights (Simulated for demo)
    const cpuUsage = Math.floor(Math.random() * 30) + 10; // 10-40%
    const dataStats = db.prepare("SELECT SUM(total_bytes_up) as upload, SUM(total_bytes_down) as download FROM vouchers").get() as { upload: number, download: number };
    const totalDataUsage = (dataStats.upload || 0) + (dataStats.download || 0);
    
    // Revenue Breakdown (Simulated for demo)
    const agentCommission = (totalRevenue.total || 0) * 0.1;
    const netProceeds = (totalRevenue.total || 0) - agentCommission;
    
    res.json({
      activeVouchers: activeVouchers.count,
      totalRevenue: totalRevenue.total || 0,
      activeSessions: activeSessions.count,
      cpuUsage,
      totalDataUsage,
      totalUpload: dataStats.upload || 0,
      totalDownload: dataStats.download || 0,
      agentCommission,
      netProceeds,
      balance: 17287 // Hardcoded from screenshot
    });
  });

  app.get("/api/sales/recent", authenticateToken, (req, res) => {
    const recentSales = db.prepare(`
      SELECT v.code, v.price as amount, v.used_at, u.username
      FROM vouchers v
      LEFT JOIN users u ON u.id = 1 -- Mock user for demo
      WHERE v.status = 'used'
      ORDER BY v.used_at DESC
      LIMIT 5
    `).all();
    res.json(recentSales);
  });

  app.get("/api/vouchers", authenticateToken, (req, res) => {
    checkExpirations();
    const vouchers = db.prepare("SELECT * FROM vouchers ORDER BY created_at DESC LIMIT 50").all();
    res.json(vouchers);
  });

  app.post("/api/vouchers/generate", authenticateToken, (req, res) => {
    const { count, duration, price, validityDays, expiryDate, uploadLimit, downloadLimit, dataLimitMb } = req.body;
    const codes = [];
    const insert = db.prepare("INSERT INTO vouchers (code, duration_minutes, price, expires_at, upload_limit, download_limit, data_limit_mb) VALUES (?, ?, ?, ?, ?, ?, ?)");
    
    const generateCode = () => Math.random().toString(36).substring(2, 8).toUpperCase();
    
    let expiresAt = null;
    if (expiryDate) {
      expiresAt = new Date(expiryDate).toISOString();
    } else if (validityDays && validityDays > 0) {
      expiresAt = new Date(Date.now() + validityDays * 24 * 60 * 60 * 1000).toISOString();
    } else if (duration && duration > 0) {
      expiresAt = new Date(Date.now() + duration * 60 * 1000).toISOString();
    }

    db.transaction(() => {
      for (let i = 0; i < count; i++) {
        const code = generateCode();
        insert.run(code, duration, price, expiresAt, uploadLimit || 0, downloadLimit || 0, dataLimitMb || 0);
        codes.push(code);
      }
    })();

    res.json({ success: true, codes });
  });

  app.post("/api/vouchers/bulk-upload", authenticateToken, (req, res) => {
    const { vouchers } = req.body;
    if (!Array.isArray(vouchers)) {
      return res.status(400).json({ error: "Invalid data format" });
    }

    const insert = db.prepare("INSERT INTO vouchers (code, duration_minutes, price, expires_at, upload_limit, download_limit, data_limit_mb) VALUES (?, ?, ?, ?, ?, ?, ?)");
    
    try {
      db.transaction(() => {
        for (const v of vouchers) {
          let expiresAt = null;
          if (v.expiryDate) {
            expiresAt = new Date(v.expiryDate).toISOString();
          } else if (v.validityDays && v.validityDays > 0) {
            expiresAt = new Date(Date.now() + v.validityDays * 24 * 60 * 60 * 1000).toISOString();
          } else if (v.duration && v.duration > 0) {
            expiresAt = new Date(Date.now() + v.duration * 60 * 1000).toISOString();
          }
          
          insert.run(
            v.code.toUpperCase(), 
            v.duration || 60, 
            v.price || 0, 
            expiresAt, 
            v.uploadLimit || 0, 
            v.downloadLimit || 0, 
            v.dataLimitMb || 0
          );
        }
      })();
      res.json({ success: true, count: vouchers.length });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/vouchers/redeem", (req, res) => {
    checkExpirations();
    const { code, macAddress } = req.body;
    const voucher = db.prepare("SELECT * FROM vouchers WHERE code = ? AND status = 'active'").get() as any;

    if (!voucher) {
      return res.status(400).json({ error: "Invalid or already used voucher code." });
    }

    const endTime = new Date(Date.now() + voucher.duration_minutes * 60000).toISOString();
    
    db.transaction(() => {
      db.prepare("UPDATE vouchers SET status = 'used', used_at = CURRENT_TIMESTAMP, first_used_at = COALESCE(first_used_at, CURRENT_TIMESTAMP) WHERE id = ?").run(voucher.id);
      db.prepare("INSERT INTO sessions (voucher_id, mac_address, end_time) VALUES (?, ?, ?)").run(voucher.id, macAddress, endTime);
    })();

    res.json({ success: true, endTime });
  });

  app.get("/api/sessions/active", authenticateToken, (req, res) => {
    const sessions = db.prepare(`
      SELECT s.*, v.code 
      FROM sessions s 
      JOIN vouchers v ON s.voucher_id = v.id 
      WHERE s.end_time > CURRENT_TIMESTAMP
    `).all();
    res.json(sessions);
  });

  app.post("/api/vouchers/bulk-expire", authenticateToken, (req, res) => {
    const { ids } = req.body;
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ error: "No voucher IDs provided." });
    }

    const stmt = db.prepare("UPDATE vouchers SET status = 'expired' WHERE id = ? AND status = 'active'");
    db.transaction(() => {
      for (const id of ids) {
        stmt.run(id);
      }
    })();

    res.json({ success: true });
  });

  app.post("/api/vouchers/bulk-delete", authenticateToken, (req, res) => {
    const { ids } = req.body;
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ error: "No voucher IDs provided." });
    }

    // Note: In a real app, we might want to check if vouchers are linked to sessions
    // For this demo, we'll just delete them.
    const stmt = db.prepare("DELETE FROM vouchers WHERE id = ?");
    db.transaction(() => {
      for (const id of ids) {
        stmt.run(id);
      }
    })();

    res.json({ success: true });
  });

  app.get("/api/sales/history", authenticateToken, (req, res) => {
    const history = db.prepare(`
      SELECT 
        date(used_at) as date,
        SUM(price) as amount,
        COUNT(*) as count
      FROM vouchers 
      WHERE status = 'used' AND used_at IS NOT NULL
      GROUP BY date(used_at)
      ORDER BY date DESC
      LIMIT 7
    `).all();
    // Reverse to get chronological order for the chart
    res.json(history.reverse());
  });

  // Packages API
  app.get('/api/packages', (req, res) => {
    const packages = db.prepare('SELECT * FROM packages ORDER BY created_at DESC').all();
    res.json(packages);
  });

  app.post('/api/packages', authenticateToken, (req, res) => {
    const { name, duration_minutes, price, description, data_limit_mb } = req.body;
    db.prepare('INSERT INTO packages (name, duration_minutes, price, description, data_limit_mb) VALUES (?, ?, ?, ?, ?)')
      .run(name, duration_minutes, price, description, data_limit_mb || 0);
    res.json({ success: true });
  });

  // Customers API
  app.get('/api/customers', authenticateToken, (req, res) => {
    try {
      const customers = db.prepare('SELECT * FROM customers ORDER BY created_at DESC').all();
      res.json(customers);
    } catch (err: any) {
      console.error('Error fetching customers:', err);
      res.status(500).json({ error: err.message });
    }
  });

  app.post('/api/customers', authenticateToken, (req, res) => {
    try {
      const { name, email, phone, address } = req.body;
      const result = db.prepare('INSERT INTO customers (name, email, phone, address) VALUES (?, ?, ?, ?)')
        .run(name, email, phone, address);
      res.json({ success: true, id: result.lastInsertRowid });
    } catch (err: any) {
      console.error('Error creating customer:', err);
      res.status(500).json({ error: err.message });
    }
  });

  app.put('/api/customers/:id', authenticateToken, (req, res) => {
    const { id } = req.params;
    const { name, email, phone, address } = req.body;
    db.prepare('UPDATE customers SET name = ?, email = ?, phone = ?, address = ? WHERE id = ?')
      .run(name, email, phone, address, id);
    res.json({ success: true });
  });

  app.delete('/api/customers/:id', authenticateToken, (req, res) => {
    const { id } = req.params;
    db.prepare('DELETE FROM customers WHERE id = ?').run(id);
    res.json({ success: true });
  });

  // Users API
  app.get('/api/users', authenticateToken, (req, res) => {
    const users = db.prepare('SELECT * FROM users ORDER BY created_at DESC').all();
    res.json(users);
  });

  app.post('/api/users', authenticateToken, (req, res) => {
    const { username, role, email } = req.body;
    try {
      db.prepare('INSERT INTO users (username, role, email) VALUES (?, ?, ?)')
        .run(username, role, email);
      res.json({ success: true });
    } catch (err) {
      res.status(400).json({ error: 'Username already exists' });
    }
  });

  // Transactions API
  app.get('/api/transactions', authenticateToken, (req, res) => {
    const transactions = db.prepare('SELECT * FROM transactions ORDER BY created_at DESC').all();
    res.json(transactions);
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  // Initial data
  const packageCount = db.prepare('SELECT COUNT(*) as count FROM packages').get() as { count: number };
if (packageCount.count === 0) {
  db.prepare('INSERT INTO packages (name, duration_minutes, price, description) VALUES (?, ?, ?, ?)')
    .run('1 Hour Basic', 60, 10, 'Standard 1 hour internet access');
  db.prepare('INSERT INTO packages (name, duration_minutes, price, description) VALUES (?, ?, ?, ?)')
    .run('3 Hours Pro', 180, 25, 'High speed 3 hours internet access');
  db.prepare('INSERT INTO packages (name, duration_minutes, price, description) VALUES (?, ?, ?, ?)')
    .run('24 Hours Unlimited', 1440, 50, 'Full day unlimited internet access');
}

const userCount = db.prepare('SELECT COUNT(*) as count FROM users').get() as { count: number };
if (userCount.count === 0) {
  const adminPassword = await bcrypt.hash('admin123', 10);
  const userPassword = await bcrypt.hash('user123', 10);
  
  db.prepare('INSERT INTO users (username, password, role, email) VALUES (?, ?, ?, ?)')
    .run('admin', adminPassword, 'staff', 'admin@asansl.com');
  db.prepare('INSERT INTO users (username, password, role, email) VALUES (?, ?, ?, ?)')
    .run('john_doe', userPassword, 'customer', 'john@example.com');
} else {
  // Update existing users with default passwords if they don't have one
  const usersWithoutPassword = db.prepare("SELECT * FROM users WHERE password IS NULL").all() as any[];
  for (const user of usersWithoutPassword) {
    const defaultPassword = await bcrypt.hash(user.username + '123', 10);
    db.prepare("UPDATE users SET password = ? WHERE id = ?").run(defaultPassword, user.id);
  }
}

const customerCount = db.prepare('SELECT COUNT(*) as count FROM customers').get() as { count: number };
if (customerCount.count === 0) {
  db.prepare('INSERT INTO customers (name, email, phone, address) VALUES (?, ?, ?, ?)')
    .run('Walk-in Customer', 'walkin@example.com', '000-000-0000', 'N/A');
  db.prepare('INSERT INTO customers (name, email, phone, address) VALUES (?, ?, ?, ?)')
    .run('Jane Smith', 'jane@example.com', '123-456-7890', 'Kampala, Uganda');
}

app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
