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
    console.log('Connected to MSSQL for SymboFlow migrations.');

    // 1. Rename Issues to Tickets
    try {
      await pool.request().query(`
        IF EXISTS (SELECT * FROM sysobjects WHERE name='Issues' and xtype='U')
        BEGIN
            EXEC sp_rename 'Issues', 'Tickets';
            EXEC sp_rename 'Tickets.PK__Issues__3214EC07028543FB', 'PK_Tickets', 'OBJECT';
        END
      `);
      console.log('Renamed Issues to Tickets.');
    } catch (e) {
      console.log('Issues might already be renamed or constraint rename failed:', e.message);
    }

    // 2. Systems Table
    await pool.request().query(`
      IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Systems' and xtype='U')
      BEGIN
          CREATE TABLE Systems (
              Id INT PRIMARY KEY IDENTITY(1,1),
              Name NVARCHAR(100) NOT NULL,
              Description NVARCHAR(MAX),
              Status NVARCHAR(50) DEFAULT 'Active',
              CreatedAt DATETIME DEFAULT GETDATE()
          );
      END
      ELSE
      BEGIN
          IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('Systems') AND name = 'Status')
          BEGIN
              ALTER TABLE Systems ADD Status NVARCHAR(50) DEFAULT 'Active';
          END
      END
    `);
    console.log('Systems table updated.');

    // 3. ProjectSystems Bridging Table
    await pool.request().query(`
      IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='ProjectSystems' and xtype='U')
      BEGIN
          CREATE TABLE ProjectSystems (
              ProjectId INT FOREIGN KEY REFERENCES Projects(Id),
              SystemId INT FOREIGN KEY REFERENCES Systems(Id),
              PRIMARY KEY (ProjectId, SystemId)
          );
      END
    `);
    console.log('ProjectSystems bridging table created.');

    // 4. Milestones Table
    await pool.request().query(`
      IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Milestones' and xtype='U')
      BEGIN
          CREATE TABLE Milestones (
              Id INT PRIMARY KEY IDENTITY(1,1),
              Title NVARCHAR(255) NOT NULL,
              ProjectId INT FOREIGN KEY REFERENCES Projects(Id),
              Type NVARCHAR(50) DEFAULT 'Requirement',
              TargetDate DATE,
              CreatedAt DATETIME DEFAULT GETDATE()
          );
      END
      ELSE
      BEGIN
          IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('Milestones') AND name = 'Type')
          BEGIN
              ALTER TABLE Milestones ADD Type NVARCHAR(50) DEFAULT 'Requirement';
          END
      END
    `);
    console.log('Milestones table updated.');

    // 5. Tasks Table Additions
    await pool.request().query(`
      IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('Tasks') AND name = 'Description')
      BEGIN
          ALTER TABLE Tasks ADD Description NVARCHAR(MAX);
      END
      IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('Tasks') AND name = 'MilestoneId')
      BEGIN
          ALTER TABLE Tasks ADD MilestoneId INT FOREIGN KEY REFERENCES Milestones(Id);
      END
      IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('Tasks') AND name = 'AttachmentUrl')
      BEGIN
          ALTER TABLE Tasks ADD AttachmentUrl NVARCHAR(255);
      END
    `);
    console.log('Tasks table updated with Description, MilestoneId, AttachmentUrl.');

    // 6. Tickets Table Additions (formerly Issues)
    await pool.request().query(`
      IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('Tickets') AND name = 'SystemId')
      BEGIN
          ALTER TABLE Tickets ADD SystemId INT FOREIGN KEY REFERENCES Systems(Id);
      END
    `);
    console.log('Tickets table updated with SystemId.');

    // 7. Groups and UserGroups
    await pool.request().query(`
      IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Groups' and xtype='U')
      BEGIN
          CREATE TABLE Groups (
              Id INT PRIMARY KEY IDENTITY(1,1),
              Name NVARCHAR(100) NOT NULL,
              Description NVARCHAR(MAX),
              CreatedAt DATETIME DEFAULT GETDATE()
          );
      END
      ELSE
      BEGIN
          IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('Groups') AND name = 'Description')
          BEGIN
              ALTER TABLE Groups ADD Description NVARCHAR(MAX);
          END
      END
    `);
    console.log('Groups table updated.');

    await pool.request().query(`
      IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='UserGroups' and xtype='U')
      BEGIN
          CREATE TABLE UserGroups (
              UserId INT FOREIGN KEY REFERENCES Users(Id),
              GroupId INT FOREIGN KEY REFERENCES Groups(Id),
              PRIMARY KEY (UserId, GroupId)
          );
      END
    `);
    console.log('UserGroups bridging table created.');

    // 8. Users Table Additions
    await pool.request().query(`
      IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('Users') AND name = 'Status')
      BEGIN
          ALTER TABLE Users ADD Status NVARCHAR(50) DEFAULT 'Active';
      END
      IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('Users') AND name = 'Description')
      BEGIN
          ALTER TABLE Users ADD Description NVARCHAR(MAX);
      END
    `);
    console.log('Users table updated.');

    // 9. Departments (Optional but mapped in spec)
    await pool.request().query(`
      IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Departments' and xtype='U')
      BEGIN
          CREATE TABLE Departments (
              Id INT PRIMARY KEY IDENTITY(1,1),
              Name NVARCHAR(100) NOT NULL,
              CreatedAt DATETIME DEFAULT GETDATE()
          );
      END
    `);

    console.log('SymboFlow DB Migrations complete!');
  } catch (err) {
    console.error('Migration Error:', err);
  } finally {
    if (pool) await pool.close();
  }
}

updateDB();
