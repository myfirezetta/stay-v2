const sql = require('mssql');
const fs = require('fs');
const path = require('path');

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

async function seedDB() {
  let pool;
  try {
    console.log('Connecting to MSSQL...');
    pool = await sql.connect(config);

    console.log('Running schema.sql...');
    const schemaSql = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
    
    // MSSQL driver doesn't natively handle 'GO' batch separators in a single query.
    // We split by GO (case-insensitive, on its own line)
    const batches = schemaSql.split(/^GO\b/im);
    for (const batch of batches) {
      if (batch.trim()) {
        await pool.request().query(batch);
      }
    }
    console.log('Schema created successfully.');

    console.log('Inserting seed data...');

    // 1. Users
    await pool.request().query(`
      IF NOT EXISTS (SELECT * FROM Users WHERE DisplayName = 'Alice')
      INSERT INTO Users (DisplayName, Email) VALUES ('Alice', 'alice@example.com')
      
      IF NOT EXISTS (SELECT * FROM Users WHERE DisplayName = 'Bob')
      INSERT INTO Users (DisplayName, Email) VALUES ('Bob', 'bob@example.com')
    `);

    // 2. Groups
    await pool.request().query(`
      IF NOT EXISTS (SELECT * FROM Groups WHERE Name = 'Backend Team')
      INSERT INTO Groups (Name) VALUES ('Backend Team')
      
      IF NOT EXISTS (SELECT * FROM Groups WHERE Name = 'Frontend Team')
      INSERT INTO Groups (Name) VALUES ('Frontend Team')
    `);

    // 3. Departments
    await pool.request().query(`
      IF NOT EXISTS (SELECT * FROM Departments WHERE Name = 'Engineering')
      INSERT INTO Departments (Name) VALUES ('Engineering')
    `);

    // 4. Projects
    await pool.request().query(`
      IF NOT EXISTS (SELECT * FROM Projects WHERE Name = 'Alpha Redesign')
      INSERT INTO Projects (Name, Description) VALUES ('Alpha Redesign', 'Revamp of the main UI')
      
      IF NOT EXISTS (SELECT * FROM Projects WHERE Name = 'API V2')
      INSERT INTO Projects (Name, Description) VALUES ('API V2', 'Next-gen GraphQL endpoints')
    `);

    // Fetch Project IDs
    const projResult = await pool.request().query('SELECT Id, Name FROM Projects');
    const projs = projResult.recordset.reduce((acc, p) => ({ ...acc, [p.Name]: p.Id }), {});

    // 5. Tasks
    await pool.request().query(`
      IF NOT EXISTS (SELECT * FROM Tasks WHERE Title = 'Fix Auth Bug')
      INSERT INTO Tasks (Title, ProjectId, Status) VALUES ('Fix Auth Bug', ${projs['API V2']}, 'In Progress')
      
      IF NOT EXISTS (SELECT * FROM Tasks WHERE Title = 'Setup Tailwind')
      INSERT INTO Tasks (Title, ProjectId, Status) VALUES ('Setup Tailwind', ${projs['Alpha Redesign']}, 'Done')
    `);

    // 6. Tickets
    await pool.request().query(`
      IF NOT EXISTS (SELECT * FROM Tickets WHERE Title = 'Server 500 on login')
      INSERT INTO Tickets (Title, ProjectId, Status) VALUES ('Server 500 on login', ${projs['API V2']}, 'Open')
    `);

    // 7. Systems
    await pool.request().query(`
      IF NOT EXISTS (SELECT * FROM Systems WHERE Name = 'AWS EKS')
      INSERT INTO Systems (Name) VALUES ('AWS EKS')
      
      IF NOT EXISTS (SELECT * FROM Systems WHERE Name = 'Vercel')
      INSERT INTO Systems (Name) VALUES ('Vercel')
    `);

    // 8. Milestones
    await pool.request().query(`
      IF NOT EXISTS (SELECT * FROM Milestones WHERE Title = 'Q3 Launch')
      INSERT INTO Milestones (Title, ProjectId, TargetDate) VALUES ('Q3 Launch', ${projs['Alpha Redesign']}, '2026-09-30')
    `);

    console.log('Seed data inserted successfully.');
  } catch (err) {
    console.error('Error during seeding:', err);
  } finally {
    if (pool) await pool.close();
  }
}

seedDB();
