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
    
    // Add Role column to Users if it doesn't exist
    await pool.request().query(`
      IF NOT EXISTS (
        SELECT * FROM sys.columns 
        WHERE object_id = OBJECT_ID('Users') AND name = 'Role'
      )
      BEGIN
        ALTER TABLE Users ADD Role NVARCHAR(50) DEFAULT 'Member';
      END
    `);
    
    // Make Alice an Admin
    await pool.request().query(`
      UPDATE Users SET Role = 'Admin' WHERE DisplayName = 'Alice';
    `);

    // Ensure Role is returned in lookups
    console.log('Database schema and seed data updated successfully.');
  } catch (err) {
    console.error('Error:', err);
  } finally {
    if (pool) await pool.close();
  }
}

updateDB();
