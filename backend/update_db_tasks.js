const sql = require('mssql');

const config = {
  user: 'eclafs',
  password: 'SXmLBY57do4tp2kqx1',
  server: 'sya',
  database: 'projectmng',
  options: {
    encrypt: true,
    trustServerCertificate: true
  }
};

async function updateDB() {
  let pool;
  try {
    pool = await sql.connect(config);
    
    await pool.request().query(`
      IF NOT EXISTS (
        SELECT * FROM sys.columns 
        WHERE object_id = OBJECT_ID('Tasks') AND name = 'AssigneeId'
      )
      BEGIN
        ALTER TABLE Tasks ADD AssigneeId INT FOREIGN KEY REFERENCES Users(Id);
      END
    `);

    await pool.request().query(`
      IF NOT EXISTS (
        SELECT * FROM sys.columns 
        WHERE object_id = OBJECT_ID('Tasks') AND name = 'StartDate'
      )
      BEGIN
        ALTER TABLE Tasks ADD StartDate DATETIME;
      END
    `);

    await pool.request().query(`
      IF NOT EXISTS (
        SELECT * FROM sys.columns 
        WHERE object_id = OBJECT_ID('Tasks') AND name = 'DueDate'
      )
      BEGIN
        ALTER TABLE Tasks ADD DueDate DATETIME;
      END
    `);

    console.log('Database updated: Added AssigneeId, StartDate, DueDate to Tasks.');
  } catch (err) {
    console.error('Error:', err);
  } finally {
    if (pool) await pool.close();
  }
}

updateDB();
