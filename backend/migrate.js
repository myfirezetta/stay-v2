const fs = require('fs');

let content = fs.readFileSync('index.js', 'utf8');

// 1. Replace mssql with postgres
content = content.replace("const sql = require('mssql');", "const postgres = require('postgres');");

// 2. Replace connection config
const newConfig = `
const sql = postgres('postgresql://postgres.tsavzxmdqgccftrddeph:SXmLBY57do4tp2kqx1@aws-0-ap-northeast-2.pooler.supabase.com:6543/postgres', {
  ssl: 'require'
});
`;
content = content.replace(/const config = {[\s\S]*?};\n\nasync function connectDB\(\) {[\s\S]*?}\n\nconnectDB\(\);/m, newConfig);

// 3. Replace sql.query\` with sql\`
content = content.replace(/sql\.query`/g, 'sql`');

// 4. Replace result.recordset with result
content = content.replace(/\.recordset/g, '');

// 5. Replace OUTPUT INSERTED.* with RETURNING *
content = content.replace(/OUTPUT INSERTED\.\*/g, 'RETURNING *');

// 6. Replace OUTPUT DELETED.Id with RETURNING Id
content = content.replace(/OUTPUT DELETED\.Id/g, 'RETURNING Id');

// 7. Add module.exports for Vercel instead of server.listen
content = content.replace(/server\.listen\(PORT, \(\) => {[\s\S]*?}\);/m, `
if (process.env.NODE_ENV !== 'production') {
  server.listen(PORT, () => {
    console.log(\`Server is running on port \${PORT}\`);
  });
}
module.exports = app;
`);

fs.writeFileSync('index.js', content);
console.log('Migration complete');
