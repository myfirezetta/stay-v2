const sql = require('mssql');

const config = {
  user: 'eclafs',
  password: 'SXmLBY57do4tp2kqx1',
  server: 'sya',
  options: {
    encrypt: true, // Use this if you're on Windows Azure
    trustServerCertificate: true // Change to true for local dev / self-signed certs
  }
};

async function initDB() {
  try {
    console.log('Connecting to MSSQL server...');
    // Connect to the master DB first to create the project DB
    let pool = await sql.connect({ ...config, database: 'master' });
    
    console.log('Checking if database projectmng exists...');
    const dbCheckResult = await pool.request().query(`
      SELECT * FROM sys.databases WHERE name = 'projectmng'
    `);
    
    if (dbCheckResult.recordset.length === 0) {
      console.log('Creating database projectmng...');
      await pool.request().query(`CREATE DATABASE projectmng`);
      console.log('Database created.');
    } else {
      console.log('Database projectmng already exists.');
    }

    await pool.close();
    
    console.log('Connecting to projectmng...');
    // Reconnect to the new DB
    pool = await sql.connect({ ...config, database: 'projectmng' });
    
    console.log('Creating tables...');
    
    // Create Projects table
    await pool.request().query(`
      IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Projects' and xtype='U')
      CREATE TABLE Projects (
          Id INT PRIMARY KEY IDENTITY(1,1),
          Name NVARCHAR(255) NOT NULL,
          Description NVARCHAR(MAX),
          CreatedAt DATETIME DEFAULT GETDATE()
      )
    `);

    // Create Tasks table
    await pool.request().query(`
      IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Tasks' and xtype='U')
      CREATE TABLE Tasks (
          Id INT PRIMARY KEY IDENTITY(1,1),
          Title NVARCHAR(255) NOT NULL,
          ProjectId INT FOREIGN KEY REFERENCES Projects(Id),
          Status NVARCHAR(50) DEFAULT 'Todo',
          CreatedAt DATETIME DEFAULT GETDATE()
      )
    `);

    // Create Feed table
    await pool.request().query(`
      IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Feed' and xtype='U')
      CREATE TABLE Feed (
          Id INT PRIMARY KEY IDENTITY(1,1),
          Content NVARCHAR(MAX) NOT NULL,
          ParsedTags NVARCHAR(MAX), -- JSON string of extracted tags
          CreatedAt DATETIME DEFAULT GETDATE()
      )
    `);

    console.log('Tables created successfully.');
    process.exit(0);
  } catch (err) {
    console.error('Error during DB initialization:', err);
    process.exit(1);
  }
}

initDB();
