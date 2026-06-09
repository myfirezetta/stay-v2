import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import postgres from 'postgres';
import multer from 'multer';
import path from 'path';
import bcrypt from 'bcryptjs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, '/tmp')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, uniqueSuffix + path.extname(file.originalname))
  }
});
const upload = multer({ storage: storage });

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PATCH', 'DELETE']
  }
});


const sql = postgres('postgresql://postgres.tsavzxmdqgccftrddeph:SXmLBY57do4tp2kqx1@aws-0-ap-northeast-2.pooler.supabase.com:5432/postgres', {
  ssl: 'require'
});


async function getUserAuth(req) {
  const userId = req.headers['x-user-id'];
  if (!userId) return { id: 1, role: 'Admin' }; // Fallback
  
  const result = await sql`SELECT Id, Role FROM Users WHERE Id = ${userId}`;
  if (result.length > 0) {
    return { id: result[0].Id, role: result[0].Role };
  }
  return { id: parseInt(userId), role: 'Member' };
}

// FEED
app.get('/api/feed', async (req, res) => {
  try {
    const auth = await getUserAuth(req);
    const result = await sql`SELECT * FROM Feed ORDER BY CreatedAt ASC`;
    let allItems = result;
    
    // Filter for Members
    if (auth.role !== 'Admin') {
      const allowedProjectsResult = await sql`SELECT ProjectId FROM UserProjects WHERE UserId = ${auth.id}`;
      const allowedProjectIds = allowedProjectsResult.map(r => r.ProjectId);
      
      const allowedTasksResult = await sql`SELECT Id FROM Tasks WHERE ProjectId IN (SELECT ProjectId FROM UserProjects WHERE UserId = ${auth.id})`;
      const allowedTaskIds = allowedTasksResult.map(r => r.Id);

      const allowedTicketsResult = await sql`SELECT Id FROM Tickets WHERE ProjectId IN (SELECT ProjectId FROM UserProjects WHERE UserId = ${auth.id}) OR TaskId IN (SELECT Id FROM Tasks WHERE ProjectId IN (SELECT ProjectId FROM UserProjects WHERE UserId = ${auth.id}))`;
      const allowedTicketIds = allowedTicketsResult.map(r => r.Id);
      
      allItems = allItems.filter(item => {
        if (item.AuthorId === auth.id) return true;
        
        try {
          const tags = JSON.parse(item.ParsedTags || '[]');
          for (let tag of tags) {
            if (tag.type === 'user' && parseInt(tag.id) === auth.id) return true;
            if (tag.type === 'project' && allowedProjectIds.includes(parseInt(tag.id))) return true;
            if (tag.type === 'task' && allowedTaskIds.includes(parseInt(tag.id))) return true;
            if (tag.type === 'ticket' && allowedTicketIds.includes(parseInt(tag.id))) return true;
          }
        } catch (e) {}
        
        return false;
      });
    }

    // Structure into parents and replies
    const posts = allItems.filter(i => !i.ParentId).sort((a, b) => new Date(b.CreatedAt) - new Date(a.CreatedAt));
    const replies = allItems.filter(i => i.ParentId);
    
    const formattedPosts = posts.map(post => ({
      ...post,
      replies: replies.filter(r => r.ParentId === post.Id).sort((a, b) => new Date(a.CreatedAt) - new Date(b.CreatedAt))
    }));
    
    res.json(formattedPosts);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.patch('/api/feed/:id', async (req, res) => {
  try {
    const feedId = req.params.id;
    const { content, parsedTags } = req.body;
    const result = await sql`
      UPDATE Feed 
      SET Content = ${content}, ParsedTags = ${JSON.stringify(parsedTags)}
      RETURNING *
      WHERE Id = ${feedId}
    `;
    if (result.length === 0) return res.status(404).send('Feed not found');
    io.emit('feed_updated', result[0]);
    res.json(result[0]);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.delete('/api/feed/:id', async (req, res) => {
  try {
    const feedId = req.params.id;
    const result = await sql`
      DELETE FROM Feed RETURNING Id WHERE Id = ${feedId}
    `;
    if (result.length === 0) return res.status(404).send('Feed not found');
    io.emit('feed_deleted', feedId);
    res.json({ success: true });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// LOOKUP
app.get('/api/lookup', async (req, res) => {
  try {
    const auth = await getUserAuth(req);
    let projects, tasks, tickets, milestones, systems;
    
    if (auth.role === 'Admin') {
      projects = await sql`SELECT Id as id, Name as name FROM Projects`;
      tasks = await sql`SELECT Id as id, Title as title FROM Tasks`;
      tickets = await sql`SELECT Id as id, Title as title FROM Tickets`;
      milestones = await sql`SELECT Id as id, Title as title FROM Milestones`;
      systems = await sql`SELECT Id as id, Name as name FROM Systems`;
    } else {
      projects = await sql`SELECT Id as id, Name as name FROM Projects WHERE Id IN (SELECT ProjectId FROM UserProjects WHERE UserId = ${auth.id})`;
      tasks = await sql`SELECT Id as id, Title as title FROM Tasks WHERE ProjectId IN (SELECT ProjectId FROM UserProjects WHERE UserId = ${auth.id})`;
      tickets = await sql`SELECT Id as id, Title as title FROM Tickets WHERE ProjectId IN (SELECT ProjectId FROM UserProjects WHERE UserId = ${auth.id}) OR TaskId IN (SELECT Id FROM Tasks WHERE ProjectId IN (SELECT ProjectId FROM UserProjects WHERE UserId = ${auth.id}))`;
      milestones = await sql`SELECT Id as id, Title as title FROM Milestones WHERE ProjectId IN (SELECT ProjectId FROM UserProjects WHERE UserId = ${auth.id})`;
      systems = await sql`SELECT Id as id, Name as name FROM Systems WHERE Id IN (SELECT SystemId FROM ProjectSystems WHERE ProjectId IN (SELECT ProjectId FROM UserProjects WHERE UserId = ${auth.id}))`;
    }
    
    // Globals
    const users = await sql`SELECT Id as id, DisplayName as name FROM Users`;
    const groups = await sql`SELECT Id as id, Name as name FROM Groups`;
    const departments = await sql`SELECT Id as id, Name as name FROM Departments`;
    
    res.json({
      projects: projects,
      tasks: tasks,
      tickets: tickets,
      users: users,
      milestones: milestones,
      systems: systems,
      groups: groups,
      departments: departments
    });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// USERS & AUTH
app.get('/api/users', async (req, res) => {
  try {
    const result = await sql`SELECT Id, DisplayName, Email, Role, Status, Description, CreatedAt FROM Users ORDER BY CreatedAt DESC`;
    res.json(result);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await sql`SELECT Id, DisplayName, Email, Role, PasswordHash, RequiresPasswordChange FROM Users WHERE Email = ${email}`;
    if (result.length === 0) return res.status(401).json({ error: 'Invalid email or password' });
    
    const user = result[0];
    
    // Fallback for existing users without password setup (or if password not provided and it's a legacy login)
    // To enforce new flow, we demand password matching.
    if (!user.PasswordHash) {
      // If they don't have a password yet, we let them login but force them to set one.
      return res.json({ id: user.Id, displayName: user.DisplayName, email: user.Email, role: user.Role, requiresPasswordChange: true });
    }

    const isValid = await bcrypt.compare(password, user.PasswordHash);
    if (!isValid) return res.status(401).json({ error: 'Invalid email or password' });

    res.json({ 
      id: user.Id, 
      displayName: user.DisplayName, 
      email: user.Email, 
      role: user.Role, 
      requiresPasswordChange: user.RequiresPasswordChange 
    });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.post('/api/auth/change-password', async (req, res) => {
  try {
    const { userId, newPassword } = req.body;
    const hash = await bcrypt.hash(newPassword, 10);
    const result = await sql`
      UPDATE Users 
      SET PasswordHash = ${hash}, RequiresPasswordChange = 0
      RETURNING * 
      WHERE Id = ${userId}
    `;
    if (result.length === 0) return res.status(404).json({ error: 'User not found' });
    const user = result[0];
    res.json({ id: user.Id, displayName: user.DisplayName, email: user.Email, role: user.Role, requiresPasswordChange: false });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.post('/api/users', async (req, res) => {
  try {
    const { displayName, email, role, status, description } = req.body;
    
    // Generate default password: Password123!
    const defaultPassword = 'Password123!';
    const hash = await bcrypt.hash(defaultPassword, 10);

    const result = await sql`
      INSERT INTO Users (DisplayName, Email, Role, Status, Description, PasswordHash, RequiresPasswordChange) 
      RETURNING *
      VALUES (${displayName}, ${email}, ${role || 'Member'}, ${status || 'Active'}, ${description || ''}, ${hash}, 1)
    `;
    io.emit('db_updated');
    res.json(result[0]);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.patch('/api/users/:id', async (req, res) => {
  try {
    const { displayName, email, role, status, description } = req.body;
    const result = await sql`
      UPDATE Users SET DisplayName = ${displayName}, Email = ${email}, Role = ${role}, Status = ${status}, Description = ${description}
      RETURNING * WHERE Id = ${req.params.id}
    `;
    io.emit('db_updated');
    res.json(result[0]);
  } catch (err) { res.status(500).send(err.message); }
});

// CRUD FOR ENTITIES
// Projects
app.get('/api/projects', async (req, res) => {
  try {
    const auth = await getUserAuth(req);
    let result;
    if (auth.role === 'Admin') {
      result = await sql`SELECT * FROM Projects ORDER BY CreatedAt DESC`;
    } else {
      result = await sql`SELECT * FROM Projects WHERE Id IN (SELECT ProjectId FROM UserProjects WHERE UserId = ${auth.id}) ORDER BY CreatedAt DESC`;
    }
    // Fetch project systems
    const systemsRes = await sql`SELECT ProjectId, SystemId FROM ProjectSystems`;
    
    const projects = result.map(p => ({
      ...p,
      systemIds: systemsRes.filter(ps => ps.ProjectId === p.Id).map(ps => ps.SystemId)
    }));
    res.json(projects);
  } catch (err) { res.status(500).send(err.message); }
});

app.post('/api/projects', async (req, res) => {
  try {
    const { name, description, systemIds } = req.body;
    const result = await sql`
      INSERT INTO Projects (Name, Description) 
      RETURNING *
      VALUES (${name}, ${description})
    `;
    const newProject = result[0];
    
    if (systemIds && systemIds.length > 0) {
      for (let sysId of systemIds) {
        await sql`INSERT INTO ProjectSystems (ProjectId, SystemId) VALUES (${newProject.Id}, ${sysId})`;
      }
    }
    newProject.systemIds = systemIds || [];
    io.emit('db_updated');
    res.json(newProject);
  } catch (err) { res.status(500).send(err.message); }
});

app.patch('/api/projects/:id', async (req, res) => {
  try {
    const { name, description, systemIds } = req.body;
    const pId = req.params.id;
    const result = await sql`
      UPDATE Projects SET Name = ${name}, Description = ${description}
      RETURNING * WHERE Id = ${pId}
    `;
    await sql`DELETE FROM ProjectSystems WHERE ProjectId = ${pId}`;
    if (systemIds && systemIds.length > 0) {
      for (let sysId of systemIds) {
        await sql`INSERT INTO ProjectSystems (ProjectId, SystemId) VALUES (${pId}, ${sysId})`;
      }
    }
    const updated = result[0];
    updated.systemIds = systemIds || [];
    io.emit('db_updated');
    res.json(updated);
  } catch (err) { res.status(500).send(err.message); }
});

app.delete('/api/projects/:id', async (req, res) => {
  try {
    const pId = req.params.id;
    await sql`DELETE FROM ProjectSystems WHERE ProjectId = ${pId}`;
    // delete tickets, tasks, milestones associated
    await sql`DELETE FROM Tickets WHERE ProjectId = ${pId}`;
    await sql`DELETE FROM Tasks WHERE ProjectId = ${pId}`;
    await sql`DELETE FROM Milestones WHERE ProjectId = ${pId}`;
    await sql`DELETE FROM Projects WHERE Id = ${pId}`;
    io.emit('db_updated');
    res.json({ success: true });
  } catch (err) { res.status(500).send(err.message); }
});

// Systems
app.get('/api/systems', async (req, res) => {
  try {
    const result = await sql`SELECT * FROM Systems ORDER BY CreatedAt DESC`;
    res.json(result);
  } catch (err) { res.status(500).send(err.message); }
});

app.post('/api/systems', async (req, res) => {
  try {
    const { name, description, status } = req.body;
    const result = await sql`
      INSERT INTO Systems (Name, Description, Status) 
      RETURNING * VALUES (${name}, ${description}, ${status || 'Active'})
    `;
    io.emit('db_updated');
    res.json(result[0]);
  } catch (err) { res.status(500).send(err.message); }
});

app.patch('/api/systems/:id', async (req, res) => {
  try {
    const { name, description, status } = req.body;
    const result = await sql`
      UPDATE Systems SET Name=${name}, Description=${description}, Status=${status}
      RETURNING * WHERE Id=${req.params.id}
    `;
    io.emit('db_updated');
    res.json(result[0]);
  } catch (err) { res.status(500).send(err.message); }
});

app.delete('/api/systems/:id', async (req, res) => {
  try {
    await sql`DELETE FROM ProjectSystems WHERE SystemId=${req.params.id}`;
    await sql`DELETE FROM Tickets WHERE SystemId=${req.params.id}`;
    await sql`DELETE FROM Systems WHERE Id=${req.params.id}`;
    io.emit('db_updated');
    res.json({ success: true });
  } catch (err) { res.status(500).send(err.message); }
});

// Milestones
app.get('/api/milestones', async (req, res) => {
  try {
    const result = await sql`SELECT * FROM Milestones ORDER BY TargetDate ASC`;
    res.json(result);
  } catch (err) { res.status(500).send(err.message); }
});

app.post('/api/milestones', async (req, res) => {
  try {
    const { title, projectId, type, targetDate } = req.body;
    const result = await sql`
      INSERT INTO Milestones (Title, ProjectId, Type, TargetDate) 
      RETURNING * VALUES (${title}, ${projectId}, ${type}, ${targetDate})
    `;
    io.emit('db_updated');
    res.json(result[0]);
  } catch (err) { res.status(500).send(err.message); }
});

app.patch('/api/milestones/:id', async (req, res) => {
  try {
    const { title, projectId, type, targetDate } = req.body;
    const result = await sql`
      UPDATE Milestones SET Title=${title}, ProjectId=${projectId}, Type=${type}, TargetDate=${targetDate}
      RETURNING * WHERE Id=${req.params.id}
    `;
    io.emit('db_updated');
    res.json(result[0]);
  } catch (err) { res.status(500).send(err.message); }
});

app.delete('/api/milestones/:id', async (req, res) => {
  try {
    await sql`UPDATE Tasks SET MilestoneId=NULL WHERE MilestoneId=${req.params.id}`;
    await sql`DELETE FROM Milestones WHERE Id=${req.params.id}`;
    io.emit('db_updated');
    res.json({ success: true });
  } catch (err) { res.status(500).send(err.message); }
});

// Groups
app.get('/api/groups', async (req, res) => {
  try {
    const result = await sql`SELECT * FROM Groups ORDER BY CreatedAt DESC`;
    res.json(result);
  } catch (err) { res.status(500).send(err.message); }
});

app.post('/api/groups', async (req, res) => {
  try {
    const { name, description } = req.body;
    const result = await sql`
      INSERT INTO Groups (Name, Description) 
      RETURNING * VALUES (${name}, ${description})
    `;
    io.emit('db_updated');
    res.json(result[0]);
  } catch (err) { res.status(500).send(err.message); }
});

app.patch('/api/groups/:id', async (req, res) => {
  try {
    const { name, description } = req.body;
    const result = await sql`
      UPDATE Groups SET Name=${name}, Description=${description}
      RETURNING * WHERE Id=${req.params.id}
    `;
    io.emit('db_updated');
    res.json(result[0]);
  } catch (err) { res.status(500).send(err.message); }
});

app.delete('/api/groups/:id', async (req, res) => {
  try {
    await sql`DELETE FROM UserGroups WHERE GroupId=${req.params.id}`;
    await sql`DELETE FROM Groups WHERE Id=${req.params.id}`;
    io.emit('db_updated');
    res.json({ success: true });
  } catch (err) { res.status(500).send(err.message); }
});

// Tasks
app.get('/api/tasks', async (req, res) => {
  try {
    const result = await sql`SELECT * FROM Tasks ORDER BY CreatedAt DESC`;
    res.json(result);
  } catch (err) { res.status(500).send(err.message); }
});

app.post('/api/tasks', async (req, res) => {
  try {
    const { title, projectId, assigneeId, status, startDate, dueDate, description, milestoneId, attachmentUrl } = req.body;
    const result = await sql`
      INSERT INTO Tasks (Title, ProjectId, AssigneeId, Status, StartDate, DueDate, Description, MilestoneId, AttachmentUrl) 
      RETURNING *
      VALUES (${title}, ${projectId}, ${assigneeId}, ${status || 'Todo'}, ${startDate || null}, ${dueDate || null}, ${description || null}, ${milestoneId || null}, ${attachmentUrl || null})
    `;
    io.emit('db_updated');
    res.json(result[0]);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.patch('/api/tasks/:id', async (req, res) => {
  try {
    const { title, projectId, assigneeId, status, startDate, dueDate, description, milestoneId, attachmentUrl } = req.body;
    const result = await sql`
      UPDATE Tasks SET Title=${title}, ProjectId=${projectId}, AssigneeId=${assigneeId}, Status=${status}, StartDate=${startDate}, DueDate=${dueDate}, Description=${description}, MilestoneId=${milestoneId}, AttachmentUrl=${attachmentUrl}
      RETURNING * WHERE Id=${req.params.id}
    `;
    io.emit('db_updated');
    res.json(result[0]);
  } catch (err) { res.status(500).send(err.message); }
});

app.patch('/api/tasks/:id/status', async (req, res) => {
  try {
    const taskId = req.params.id;
    const { status } = req.body;
    const result = await sql`
      UPDATE Tasks SET Status = ${status} RETURNING * WHERE Id = ${taskId}
    `;
    io.emit('db_updated');
    res.json(result[0]);
  } catch (err) { res.status(500).send(err.message); }
});

app.delete('/api/tasks/:id', async (req, res) => {
  try {
    await sql`DELETE FROM Comments WHERE TaskId=${req.params.id}`;
    await sql`DELETE FROM Tickets WHERE TaskId=${req.params.id}`; // If tickets linked to tasks
    await sql`DELETE FROM Tasks WHERE Id=${req.params.id}`;
    io.emit('db_updated');
    res.json({ success: true });
  } catch (err) { res.status(500).send(err.message); }
});

// Tickets
app.get('/api/tickets', async (req, res) => {
  try {
    const result = await sql`SELECT * FROM Tickets ORDER BY CreatedAt DESC`;
    res.json(result);
  } catch (err) { res.status(500).send(err.message); }
});

app.post('/api/tickets', async (req, res) => {
  try {
    const { title, taskId, assigneeId, status, startDate, dueDate, systemId, projectId } = req.body;
    const result = await sql`
      INSERT INTO Tickets (Title, TaskId, AssigneeId, Status, StartDate, DueDate, SystemId, ProjectId) 
      RETURNING *
      VALUES (${title}, ${taskId}, ${assigneeId}, ${status || 'Open'}, ${startDate || null}, ${dueDate || null}, ${systemId || null}, ${projectId || null})
    `;
    io.emit('db_updated');
    res.json(result[0]);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.patch('/api/tickets/:id', async (req, res) => {
  try {
    const { title, taskId, assigneeId, status, startDate, dueDate, systemId, projectId } = req.body;
    const result = await sql`
      UPDATE Tickets SET Title=${title}, TaskId=${taskId}, AssigneeId=${assigneeId}, Status=${status}, StartDate=${startDate}, DueDate=${dueDate}, SystemId=${systemId}, ProjectId=${projectId}
      RETURNING * WHERE Id=${req.params.id}
    `;
    io.emit('db_updated');
    res.json(result[0]);
  } catch (err) { res.status(500).send(err.message); }
});

app.delete('/api/tickets/:id', async (req, res) => {
  try {
    await sql`DELETE FROM Comments WHERE IssueId=${req.params.id}`;
    await sql`DELETE FROM Tickets WHERE Id=${req.params.id}`;
    io.emit('db_updated');
    res.json({ success: true });
  } catch (err) { res.status(500).send(err.message); }
});

// PROJECT DETAILS (Tasks, Tickets, Comments)
app.get('/api/projects/:id/details', async (req, res) => {
  try {
    const projectId = req.params.id;
    const tasksResult = await sql`
      SELECT t.*, u.DisplayName as AssigneeName 
      FROM Tasks t 
      LEFT JOIN Users u ON t.AssigneeId = u.Id 
      WHERE t.ProjectId = ${projectId}
      ORDER BY t.CreatedAt DESC
    `;
    
    // Tickets mapped via ProjectId or TaskId
    const ticketsResult = await sql`
      SELECT tk.*, u.DisplayName as AssigneeName 
      FROM Tickets tk
      LEFT JOIN Users u ON tk.AssigneeId = u.Id
      WHERE tk.ProjectId = ${projectId} OR tk.TaskId IN (SELECT Id FROM Tasks WHERE ProjectId = ${projectId})
      ORDER BY tk.CreatedAt ASC
    `;
    
    const commentsResult = await sql`
      SELECT c.*, u.DisplayName as AuthorName 
      FROM Comments c
      JOIN Users u ON c.AuthorId = u.Id
      WHERE c.TaskId IN (SELECT Id FROM Tasks WHERE ProjectId = ${projectId})
         OR c.IssueId IN (SELECT Id FROM Tickets WHERE ProjectId = ${projectId} OR TaskId IN (SELECT Id FROM Tasks WHERE ProjectId = ${projectId}))
      ORDER BY c.CreatedAt ASC
    `;
    
    const now = new Date();
    const comments = commentsResult;
    
    // Process Tickets
    const tickets = ticketsResult.map(i => {
      let currentStatus = i.Status;
      if (i.DueDate && new Date(i.DueDate) < now && currentStatus.toLowerCase() !== 'done' && currentStatus.toLowerCase() !== 'closed') {
        currentStatus = 'Overdue';
      }
      return { 
        ...i, 
        Status: currentStatus,
        comments: comments.filter(c => c.IssueId === i.Id)
      };
    });

    // Process Tasks and nest tickets
    const tasks = tasksResult.map(t => {
      let currentStatus = t.Status;
      if (t.DueDate && new Date(t.DueDate) < now && currentStatus.toLowerCase() !== 'done') {
        currentStatus = 'Overdue';
      }
      return { 
        ...t, 
        Status: currentStatus,
        tickets: tickets.filter(tk => tk.TaskId === t.Id),
        comments: comments.filter(c => c.TaskId === t.Id)
      };
    });
    
    res.json({ tasks, tickets });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// DASHBOARD STATS
app.get('/api/dashboard', async (req, res) => {
  try {
    const auth = await getUserAuth(req);
    let projectsRes, tasksRes, ticketsRes, milestonesRes;
    
    if (auth.role === 'Admin') {
      projectsRes = await sql`SELECT Id, Name FROM Projects`;
      tasksRes = await sql`SELECT Id, ProjectId, Status, DueDate FROM Tasks`;
      ticketsRes = await sql`SELECT Id, Status, DueDate, ProjectId FROM Tickets`;
      milestonesRes = await sql`SELECT * FROM Milestones`;
    } else {
      projectsRes = await sql`SELECT Id, Name FROM Projects WHERE Id IN (SELECT ProjectId FROM UserProjects WHERE UserId = ${auth.id})`;
      tasksRes = await sql`SELECT Id, ProjectId, Status, DueDate FROM Tasks WHERE ProjectId IN (SELECT ProjectId FROM UserProjects WHERE UserId = ${auth.id})`;
      ticketsRes = await sql`SELECT Id, Status, DueDate, ProjectId FROM Tickets WHERE ProjectId IN (SELECT ProjectId FROM UserProjects WHERE UserId = ${auth.id}) OR TaskId IN (SELECT Id FROM Tasks WHERE ProjectId IN (SELECT ProjectId FROM UserProjects WHERE UserId = ${auth.id}))`;
      milestonesRes = await sql`SELECT * FROM Milestones WHERE ProjectId IN (SELECT ProjectId FROM UserProjects WHERE UserId = ${auth.id})`;
    }
    
    const projects = projectsRes;
    const tasks = tasksRes;
    const tickets = ticketsRes;
    const milestones = milestonesRes;
    
    const now = new Date();
    
    const stats = {
      totalProjects: projects.length,
      totalTasks: tasks.length,
      totalTickets: tickets.length,
      projectStats: projects.map(p => {
        const pTasks = tasks.filter(t => t.ProjectId === p.Id).map(t => {
          let s = t.Status;
          if (t.DueDate && new Date(t.DueDate) < now && s.toLowerCase() !== 'done') s = 'Overdue';
          return s;
        });
        
        const pTickets = tickets.filter(i => i.ProjectId === p.Id).map(i => {
          let s = i.Status;
          if (i.DueDate && new Date(i.DueDate) < now && s.toLowerCase() !== 'done' && s.toLowerCase() !== 'closed') s = 'Overdue';
          return s;
        });

        return {
          id: p.Id,
          name: p.Name,
          milestones: milestones.filter(m => m.ProjectId === p.Id),
          taskStats: {
            total: pTasks.length,
            done: pTasks.filter(s => s.toLowerCase() === 'done').length,
            overdue: pTasks.filter(s => s.toLowerCase() === 'overdue').length,
            ongoing: pTasks.filter(s => s.toLowerCase() === 'ongoing').length,
            new: pTasks.filter(s => s.toLowerCase() === 'new' || s.toLowerCase() === 'todo').length
          },
          ticketStats: {
            total: pTickets.length,
            done: pTickets.filter(s => s.toLowerCase() === 'done' || s.toLowerCase() === 'closed').length,
            overdue: pTickets.filter(s => s.toLowerCase() === 'overdue').length,
            ongoing: pTickets.filter(s => s.toLowerCase() === 'ongoing' || s.toLowerCase() === 'open').length,
            new: pTickets.filter(s => s.toLowerCase() === 'new').length
          }
        };
      })
    };
    
    res.json(stats);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Socket.io
io.on('connection', (socket) => {
  socket.on('new_feed', async (data) => {
    try {
      const { content, parsedTags, authorId, parentId } = data;
      const result = await sql`
        INSERT INTO Feed (Content, ParsedTags, AuthorId, ParentId) 
        RETURNING * 
        VALUES (${content}, ${JSON.stringify(parsedTags)}, ${authorId || 1}, ${parentId || null})
      `;
      io.emit('feed_added', result[0]);
    } catch (err) {
      console.error('Error inserting feed:', err);
    }
  });
});

const PORT = process.env.PORT || 3001;

if (process.env.NODE_ENV !== 'production') {
  server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}
export default app;

