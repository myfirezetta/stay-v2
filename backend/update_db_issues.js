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
      IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Issues' and xtype='U')
      BEGIN
          CREATE TABLE Issues (
              Id INT PRIMARY KEY IDENTITY(1,1),
              Title NVARCHAR(255) NOT NULL,
              TaskId INT FOREIGN KEY REFERENCES Tasks(Id),
              AssigneeId INT FOREIGN KEY REFERENCES Users(Id),
              Status NVARCHAR(50) DEFAULT 'New',
              StartDate DATETIME,
              DueDate DATETIME,
              CreatedAt DATETIME DEFAULT GETDATE()
          );
      END
    `);

    console.log('Database updated: Created Issues table.');
  } catch (err) {
    console.error('Error:', err);
  } finally {
    if (pool) await pool.close();
  }
}

updateDB();
