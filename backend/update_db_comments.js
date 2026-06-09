const sql = require('mssql');
require('dotenv').config();

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

async function updateDb() {
  try {
    await sql.connect(config);
    console.log('Connected to DB');

    await sql.query(`
      CREATE TABLE Comments (
        Id INT IDENTITY(1,1) PRIMARY KEY,
        Text NVARCHAR(MAX) NOT NULL,
        AuthorId INT NOT NULL FOREIGN KEY REFERENCES Users(Id),
        TaskId INT NULL FOREIGN KEY REFERENCES Tasks(Id),
        IssueId INT NULL FOREIGN KEY REFERENCES Issues(Id),
        AttachmentUrl NVARCHAR(500) NULL,
        AttachmentName NVARCHAR(255) NULL,
        CreatedAt DATETIME DEFAULT GETDATE(),
        CONSTRAINT CHK_CommentTarget CHECK (TaskId IS NOT NULL OR IssueId IS NOT NULL)
      );
    `);
    
    console.log('Comments table created successfully!');

    // Add some mock comments
    await sql.query(`
      INSERT INTO Comments (Text, AuthorId, TaskId) 
      VALUES ('This looks good to me, but let us verify the edge cases.', 1, 1);
      
      INSERT INTO Comments (Text, AuthorId, IssueId) 
      VALUES ('I found the bug! It was a race condition in the auth middleware.', 2, 1);
    `);
    
    console.log('Mock comments inserted.');
    
    process.exit(0);
  } catch (err) {
    console.error('Error updating DB:', err);
    process.exit(1);
  }
}

updateDb();
