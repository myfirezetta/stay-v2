import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { createClient } from '@supabase/supabase-js';
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
    cb(null, path.join(__dirname, 'uploads'))
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, uniqueSuffix + path.extname(file.originalname))
  }
});
const upload = multer({ storage: storage });

app.post('/api/upload', upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).send('No file uploaded.');
  res.json({ url: `/uploads/${req.file.filename}` });
});

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PATCH', 'DELETE']
  }
});

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://tsavzxmdqgccftrddeph.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_aw4lQy8u_x-Ac7vDUnLHfA_MU4i3VUA';
const supabase = createClient(supabaseUrl, supabaseKey);

async function getUserAuth(req) {
  const userId = req.headers['x-user-id'];
  if (!userId) return { id: 1, role: 'Admin' }; // Fallback
  
  const { data, error } = await supabase.from('Users').select('Id, Role').eq('Id', userId);
  if (data && data.length > 0) {
    return { id: data[0].Id, role: data[0].Role };
  }
  return { id: parseInt(userId), role: 'Member' };
}

// FEED
app.get('/api/feed', async (req, res) => {
  try {
    const auth = await getUserAuth(req);
    const { data: allItems, error } = await supabase.from('Feed').select('*').order('CreatedAt', { ascending: true });
    if (error) throw error;
    
    let filteredItems = allItems;
    
    // Filter for Members
    if (auth.role !== 'Admin') {
      const { data: upData } = await supabase.from('UserProjects').select('ProjectId').eq('UserId', auth.id);
      const allowedProjectIds = (upData || []).map(r => r.ProjectId);
      
      const { data: tasksData } = await supabase.from('Tasks').select('Id').in('ProjectId', allowedProjectIds.length ? allowedProjectIds : [0]);
      const allowedTaskIds = (tasksData || []).map(r => r.Id);

      const { data: ticketsData1 } = await supabase.from('Tickets').select('Id').in('ProjectId', allowedProjectIds.length ? allowedProjectIds : [0]);
      const { data: ticketsData2 } = await supabase.from('Tickets').select('Id').in('TaskId', allowedTaskIds.length ? allowedTaskIds : [0]);
      const allowedTicketIds = [...(ticketsData1 || []).map(r=>r.Id), ...(ticketsData2 || []).map(r=>r.Id)];
      
      filteredItems = allItems.filter(item => {
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

    const posts = filteredItems.filter(i => !i.ParentId).sort((a, b) => new Date(b.CreatedAt) - new Date(a.CreatedAt));
    const replies = filteredItems.filter(i => i.ParentId);
    
    const formattedPosts = posts.map(post => ({
      ...post,
      replies: replies.filter(r => r.ParentId === post.Id).sort((a, b) => new Date(a.CreatedAt) - new Date(b.CreatedAt))
    }));
    
    res.json(formattedPosts);
  } catch (err) { res.status(500).send(err.message); }
});

app.patch('/api/feed/:id', async (req, res) => {
  try {
    const { content, parsedTags } = req.body;
    const { data, error } = await supabase.from('Feed').update({ Content: content, ParsedTags: JSON.stringify(parsedTags) }).eq('Id', req.params.id).select();
    if (error) throw error;
    if (!data || data.length === 0) return res.status(404).send('Feed not found');
    io.emit('feed_updated', data[0]);
    res.json(data[0]);
  } catch (err) { res.status(500).send(err.message); }
});

app.delete('/api/feed/:id', async (req, res) => {
  try {
    const { data, error } = await supabase.from('Feed').delete().eq('Id', req.params.id).select();
    if (error) throw error;
    if (!data || data.length === 0) return res.status(404).send('Feed not found');
    io.emit('feed_deleted', req.params.id);
    res.json({ success: true });
  } catch (err) { res.status(500).send(err.message); }
});

// LOOKUP
app.get('/api/lookup', async (req, res) => {
  try {
    const auth = await getUserAuth(req);
    let projects, tasks, tickets, milestones, systems;
    
    if (auth.role === 'Admin') {
      const p = await supabase.from('Projects').select('Id, Name'); projects = p.data;
      const t = await supabase.from('Tasks').select('Id, Title'); tasks = t.data;
      const tk = await supabase.from('Tickets').select('Id, Title'); tickets = tk.data;
      const m = await supabase.from('Milestones').select('Id, Title'); milestones = m.data;
      const s = await supabase.from('Systems').select('Id, Name'); systems = s.data;
    } else {
      const { data: up } = await supabase.from('UserProjects').select('ProjectId').eq('UserId', auth.id);
      const pIds = (up || []).map(r => r.ProjectId);
      
      const p = await supabase.from('Projects').select('Id, Name').in('Id', pIds.length ? pIds : [0]); projects = p.data;
      const t = await supabase.from('Tasks').select('Id, Title').in('ProjectId', pIds.length ? pIds : [0]); tasks = t.data;
      const tIds = (tasks || []).map(r => r.Id);
      
      const tk1 = await supabase.from('Tickets').select('Id, Title').in('ProjectId', pIds.length ? pIds : [0]);
      const tk2 = await supabase.from('Tickets').select('Id, Title').in('TaskId', tIds.length ? tIds : [0]);
      tickets = [...(tk1.data || []), ...(tk2.data || [])];
      
      const m = await supabase.from('Milestones').select('Id, Title').in('ProjectId', pIds.length ? pIds : [0]); milestones = m.data;
      
      const { data: ps } = await supabase.from('ProjectSystems').select('SystemId').in('ProjectId', pIds.length ? pIds : [0]);
      const sysIds = (ps || []).map(r => r.SystemId);
      const s = await supabase.from('Systems').select('Id, Name').in('Id', sysIds.length ? sysIds : [0]); systems = s.data;
    }
    
    const { data: users } = await supabase.from('Users').select('Id, DisplayName');
    const { data: groups } = await supabase.from('Groups').select('Id, Name');
    const { data: departments } = await supabase.from('Departments').select('Id, Name');
    
    res.json({
      projects: projects?.map(i => ({id: i.Id, name: i.Name})) || [],
      tasks: tasks?.map(i => ({id: i.Id, title: i.Title})) || [],
      tickets: tickets?.map(i => ({id: i.Id, title: i.Title})) || [],
      users: users?.map(i => ({id: i.Id, name: i.DisplayName})) || [],
      milestones: milestones?.map(i => ({id: i.Id, title: i.Title})) || [],
      systems: systems?.map(i => ({id: i.Id, name: i.Name})) || [],
      groups: groups?.map(i => ({id: i.Id, name: i.Name})) || [],
      departments: departments?.map(i => ({id: i.Id, name: i.Name})) || []
    });
  } catch (err) { res.status(500).send(err.message); }
});

// USERS & AUTH
app.get('/api/users', async (req, res) => {
  try {
    const { data, error } = await supabase.from('Users').select('Id, DisplayName, Email, Role, Status, Description, CreatedAt').order('CreatedAt', { ascending: false });
    if (error) throw error;
    res.json(data);
  } catch (err) { res.status(500).send(err.message); }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const { data, error } = await supabase.from('Users').select('Id, DisplayName, Email, Role, PasswordHash, RequiresPasswordChange').ilike('DisplayName', username);
    if (error) throw error;
    if (!data || data.length === 0) return res.status(401).json({ error: 'Invalid username or password' });
    
    const user = data[0];
    if (!user.PasswordHash) return res.json({ id: user.Id, displayName: user.DisplayName, email: user.Email, role: user.Role, requiresPasswordChange: true });

    const isValid = await bcrypt.compare(password, user.PasswordHash);
    if (!isValid) return res.status(401).json({ error: 'Invalid username or password' });

    res.json({ id: user.Id, displayName: user.DisplayName, email: user.Email, role: user.Role, requiresPasswordChange: user.RequiresPasswordChange });
  } catch (err) { res.status(500).send(err.message); }
});

app.post('/api/auth/change-password', async (req, res) => {
  try {
    const { userId, newPassword } = req.body;
    const hash = await bcrypt.hash(newPassword, 10);
    const { data, error } = await supabase.from('Users').update({ PasswordHash: hash, RequiresPasswordChange: 0 }).eq('Id', userId).select();
    if (error) throw error;
    if (!data || data.length === 0) return res.status(404).json({ error: 'User not found' });
    res.json({ id: data[0].Id, displayName: data[0].DisplayName, email: data[0].Email, role: data[0].Role, requiresPasswordChange: false });
  } catch (err) { res.status(500).send(err.message); }
});

app.post('/api/users', async (req, res) => {
  try {
    const { displayName, email, role, status, description } = req.body;
    const hash = await bcrypt.hash('Password123!', 10);
    const { data, error } = await supabase.from('Users').insert({ DisplayName: displayName, Email: email, Role: role || 'Member', Status: status || 'Active', Description: description || '', PasswordHash: hash, RequiresPasswordChange: 1 }).select();
    if (error) throw error;
    io.emit('db_updated');
    res.json(data[0]);
  } catch (err) { res.status(500).send(err.message); }
});

app.patch('/api/users/:id', async (req, res) => {
  try {
    const { displayName, email, role, status, description } = req.body;
    const { data, error } = await supabase.from('Users').update({ DisplayName: displayName, Email: email, Role: role, Status: status, Description: description }).eq('Id', req.params.id).select();
    if (error) throw error;
    io.emit('db_updated');
    res.json(data[0]);
  } catch (err) { res.status(500).send(err.message); }
});

// Projects
app.get('/api/projects', async (req, res) => {
  try {
    const auth = await getUserAuth(req);
    let result;
    if (auth.role === 'Admin') {
      const { data, error } = await supabase.from('Projects').select('*').order('CreatedAt', { ascending: false });
      if (error) throw error; result = data;
    } else {
      const { data: up } = await supabase.from('UserProjects').select('ProjectId').eq('UserId', auth.id);
      const pIds = (up || []).map(r => r.ProjectId);
      const { data, error } = await supabase.from('Projects').select('*').in('Id', pIds.length ? pIds : [0]).order('CreatedAt', { ascending: false });
      if (error) throw error; result = data;
    }
    const { data: systemsRes } = await supabase.from('ProjectSystems').select('ProjectId, SystemId');
    const projects = result.map(p => ({
      ...p,
      systemIds: (systemsRes || []).filter(ps => ps.ProjectId === p.Id).map(ps => ps.SystemId)
    }));
    res.json(projects);
  } catch (err) { res.status(500).send(err.message); }
});

app.post('/api/projects', async (req, res) => {
  try {
    const { name, description, systemIds } = req.body;
    const { data, error } = await supabase.from('Projects').insert({ Name: name, Description: description }).select();
    if (error) throw error;
    const newProject = data[0];
    
    if (systemIds && systemIds.length > 0) {
      const inserts = systemIds.map(sysId => ({ ProjectId: newProject.Id, SystemId: sysId }));
      await supabase.from('ProjectSystems').insert(inserts);
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
    const { data, error } = await supabase.from('Projects').update({ Name: name, Description: description }).eq('Id', pId).select();
    if (error) throw error;
    
    await supabase.from('ProjectSystems').delete().eq('ProjectId', pId);
    if (systemIds && systemIds.length > 0) {
      const inserts = systemIds.map(sysId => ({ ProjectId: pId, SystemId: sysId }));
      await supabase.from('ProjectSystems').insert(inserts);
    }
    const updated = data[0];
    updated.systemIds = systemIds || [];
    io.emit('db_updated');
    res.json(updated);
  } catch (err) { res.status(500).send(err.message); }
});

app.delete('/api/projects/:id', async (req, res) => {
  try {
    const pId = req.params.id;
    await supabase.from('ProjectSystems').delete().eq('ProjectId', pId);
    await supabase.from('Tickets').delete().eq('ProjectId', pId);
    await supabase.from('Tasks').delete().eq('ProjectId', pId);
    await supabase.from('Milestones').delete().eq('ProjectId', pId);
    await supabase.from('Projects').delete().eq('Id', pId);
    io.emit('db_updated');
    res.json({ success: true });
  } catch (err) { res.status(500).send(err.message); }
});

// Systems
app.get('/api/systems', async (req, res) => {
  try {
    const { data, error } = await supabase.from('Systems').select('*').order('CreatedAt', { ascending: false });
    if (error) throw error;
    res.json(data);
  } catch (err) { res.status(500).send(err.message); }
});

app.post('/api/systems', async (req, res) => {
  try {
    const { name, description, status } = req.body;
    const { data, error } = await supabase.from('Systems').insert({ Name: name, Description: description, Status: status || 'Active' }).select();
    if (error) throw error;
    io.emit('db_updated');
    res.json(data[0]);
  } catch (err) { res.status(500).send(err.message); }
});

app.patch('/api/systems/:id', async (req, res) => {
  try {
    const { name, description, status } = req.body;
    const { data, error } = await supabase.from('Systems').update({ Name: name, Description: description, Status: status }).eq('Id', req.params.id).select();
    if (error) throw error;
    io.emit('db_updated');
    res.json(data[0]);
  } catch (err) { res.status(500).send(err.message); }
});

app.delete('/api/systems/:id', async (req, res) => {
  try {
    await supabase.from('ProjectSystems').delete().eq('SystemId', req.params.id);
    await supabase.from('Tickets').delete().eq('SystemId', req.params.id);
    await supabase.from('Systems').delete().eq('Id', req.params.id);
    io.emit('db_updated');
    res.json({ success: true });
  } catch (err) { res.status(500).send(err.message); }
});

// Milestones
app.get('/api/milestones', async (req, res) => {
  try {
    const { data, error } = await supabase.from('Milestones').select('*').order('TargetDate', { ascending: true });
    if (error) throw error;
    res.json(data);
  } catch (err) { res.status(500).send(err.message); }
});

app.post('/api/milestones', async (req, res) => {
  try {
    const { title, projectId, type, targetDate } = req.body;
    const { data, error } = await supabase.from('Milestones').insert({ Title: title, ProjectId: projectId, Type: type, TargetDate: targetDate }).select();
    if (error) throw error;
    io.emit('db_updated');
    res.json(data[0]);
  } catch (err) { res.status(500).send(err.message); }
});

app.patch('/api/milestones/:id', async (req, res) => {
  try {
    const { title, projectId, type, targetDate } = req.body;
    const { data, error } = await supabase.from('Milestones').update({ Title: title, ProjectId: projectId, Type: type, TargetDate: targetDate }).eq('Id', req.params.id).select();
    if (error) throw error;
    io.emit('db_updated');
    res.json(data[0]);
  } catch (err) { res.status(500).send(err.message); }
});

app.delete('/api/milestones/:id', async (req, res) => {
  try {
    await supabase.from('Tasks').update({ MilestoneId: null }).eq('MilestoneId', req.params.id);
    await supabase.from('Milestones').delete().eq('Id', req.params.id);
    io.emit('db_updated');
    res.json({ success: true });
  } catch (err) { res.status(500).send(err.message); }
});

// Groups
app.get('/api/groups', async (req, res) => {
  try {
    const { data, error } = await supabase.from('Groups').select('*').order('CreatedAt', { ascending: false });
    if (error) throw error;
    res.json(data);
  } catch (err) { res.status(500).send(err.message); }
});

app.post('/api/groups', async (req, res) => {
  try {
    const { name, description } = req.body;
    const { data, error } = await supabase.from('Groups').insert({ Name: name, Description: description }).select();
    if (error) throw error;
    io.emit('db_updated');
    res.json(data[0]);
  } catch (err) { res.status(500).send(err.message); }
});

app.patch('/api/groups/:id', async (req, res) => {
  try {
    const { name, description } = req.body;
    const { data, error } = await supabase.from('Groups').update({ Name: name, Description: description }).eq('Id', req.params.id).select();
    if (error) throw error;
    io.emit('db_updated');
    res.json(data[0]);
  } catch (err) { res.status(500).send(err.message); }
});

app.delete('/api/groups/:id', async (req, res) => {
  try {
    await supabase.from('UserGroups').delete().eq('GroupId', req.params.id);
    await supabase.from('Groups').delete().eq('Id', req.params.id);
    io.emit('db_updated');
    res.json({ success: true });
  } catch (err) { res.status(500).send(err.message); }
});

// Departments
app.get('/api/departments', async (req, res) => {
  try {
    const { data, error } = await supabase.from('Departments').select('*').order('CreatedAt', { ascending: false });
    if (error) throw error;
    res.json(data);
  } catch (err) { res.status(500).send(err.message); }
});

app.post('/api/departments', async (req, res) => {
  try {
    const { name, description } = req.body;
    const { data, error } = await supabase.from('Departments').insert({ Name: name, Description: description }).select();
    if (error) throw error;
    io.emit('db_updated');
    res.json(data[0]);
  } catch (err) { res.status(500).send(err.message); }
});

app.patch('/api/departments/:id', async (req, res) => {
  try {
    const { name, description } = req.body;
    const { data, error } = await supabase.from('Departments').update({ Name: name, Description: description }).eq('Id', req.params.id).select();
    if (error) throw error;
    io.emit('db_updated');
    res.json(data[0]);
  } catch (err) { res.status(500).send(err.message); }
});

app.delete('/api/departments/:id', async (req, res) => {
  try {
    await supabase.from('Departments').delete().eq('Id', req.params.id);
    io.emit('db_updated');
    res.json({ success: true });
  } catch (err) { res.status(500).send(err.message); }
});

// Tasks
app.get('/api/tasks', async (req, res) => {
  try {
    const { data, error } = await supabase.from('Tasks').select('*').order('CreatedAt', { ascending: false });
    if (error) throw error;
    res.json(data);
  } catch (err) { res.status(500).send(err.message); }
});

app.post('/api/tasks', async (req, res) => {
  try {
    const { title, projectId, assigneeId, status, startDate, dueDate, description, milestoneId, attachmentUrl } = req.body;
    const { data, error } = await supabase.from('Tasks').insert({ Title: title, ProjectId: projectId, AssigneeId: assigneeId, Status: status || 'Todo', StartDate: startDate || null, DueDate: dueDate || null, Description: description || null, MilestoneId: milestoneId || null, AttachmentUrl: attachmentUrl || null }).select();
    if (error) throw error;
    io.emit('db_updated');
    res.json(data[0]);
  } catch (err) { res.status(500).send(err.message); }
});

app.patch('/api/tasks/:id', async (req, res) => {
  try {
    const { title, projectId, assigneeId, status, startDate, dueDate, doneDate, description, milestoneId, attachmentUrl } = req.body;
    const { data, error } = await supabase.from('Tasks').update({ Title: title, ProjectId: projectId, AssigneeId: assigneeId, Status: status, StartDate: startDate, DueDate: dueDate, DoneDate: doneDate, Description: description, MilestoneId: milestoneId, AttachmentUrl: attachmentUrl }).eq('Id', req.params.id).select();
    if (error) throw error;
    io.emit('db_updated');
    res.json(data[0]);
  } catch (err) { res.status(500).send(err.message); }
});

app.patch('/api/tasks/:id/status', async (req, res) => {
  try {
    const { status, startDate, doneDate } = req.body;
    let updatePayload = { Status: status };
    if (startDate) updatePayload.StartDate = startDate;
    if (doneDate) updatePayload.DoneDate = doneDate;

    const { data, error } = await supabase.from('Tasks').update(updatePayload).eq('Id', req.params.id).select();
    if (error) throw error;
    io.emit('db_updated');
    res.json(data[0]);
  } catch (err) { res.status(500).send(err.message); }
});

app.delete('/api/tasks/:id', async (req, res) => {
  try {
    await supabase.from('Comments').delete().eq('TaskId', req.params.id);
    await supabase.from('Tickets').delete().eq('TaskId', req.params.id);
    await supabase.from('Tasks').delete().eq('Id', req.params.id);
    io.emit('db_updated');
    res.json({ success: true });
  } catch (err) { res.status(500).send(err.message); }
});

// Tickets
app.get('/api/tickets', async (req, res) => {
  try {
    const { data, error } = await supabase.from('Tickets').select('*').order('CreatedAt', { ascending: false });
    if (error) throw error;
    res.json(data);
  } catch (err) { res.status(500).send(err.message); }
});

app.post('/api/tickets', async (req, res) => {
  try {
    const { title, taskId, assigneeId, status, startDate, dueDate, systemId, projectId, description, attachmentUrl } = req.body;
    const { data, error } = await supabase.from('Tickets').insert({ Title: title, TaskId: taskId, AssigneeId: assigneeId, Status: status || 'Open', StartDate: startDate || null, DueDate: dueDate || null, SystemId: systemId || null, ProjectId: projectId || null, Description: description || null, AttachmentUrl: attachmentUrl || null }).select();
    if (error) throw error;
    io.emit('db_updated');
    res.json(data[0]);
  } catch (err) { res.status(500).send(err.message); }
});

app.patch('/api/tickets/:id', async (req, res) => {
  try {
    const { title, taskId, assigneeId, status, startDate, dueDate, doneDate, systemId, projectId, description, attachmentUrl } = req.body;
    const { data, error } = await supabase.from('Tickets').update({ Title: title, TaskId: taskId, AssigneeId: assigneeId, Status: status, StartDate: startDate, DueDate: dueDate, DoneDate: doneDate, SystemId: systemId, ProjectId: projectId, Description: description, AttachmentUrl: attachmentUrl }).eq('Id', req.params.id).select();
    if (error) throw error;
    io.emit('db_updated');
    res.json(data[0]);
  } catch (err) { res.status(500).send(err.message); }
});

app.delete('/api/tickets/:id', async (req, res) => {
  try {
    await supabase.from('Comments').delete().eq('IssueId', req.params.id);
    await supabase.from('Tickets').delete().eq('Id', req.params.id);
    io.emit('db_updated');
    res.json({ success: true });
  } catch (err) { res.status(500).send(err.message); }
});

// PROJECT DETAILS
app.get('/api/projects/:id/details', async (req, res) => {
  try {
    const projectId = req.params.id;
    const { data: users } = await supabase.from('Users').select('Id, DisplayName');
    
    const { data: tasksResult } = await supabase.from('Tasks').select('*').eq('ProjectId', projectId).order('CreatedAt', { ascending: false });
    const tasksData = tasksResult || [];
    const tIds = tasksData.map(t => t.Id);
    
    let ticketsData = [];
    if (tIds.length > 0) {
      const { data: tk1 } = await supabase.from('Tickets').select('*').eq('ProjectId', projectId);
      const { data: tk2 } = await supabase.from('Tickets').select('*').in('TaskId', tIds);
      
      const tkMap = new Map();
      [...(tk1 || []), ...(tk2 || [])].forEach(tk => tkMap.set(tk.Id, tk));
      ticketsData = Array.from(tkMap.values()).sort((a,b) => new Date(a.CreatedAt) - new Date(b.CreatedAt));
    } else {
      const { data } = await supabase.from('Tickets').select('*').eq('ProjectId', projectId).order('CreatedAt', { ascending: true });
      ticketsData = data || [];
    }
    
    let commentsData = [];
    if (tIds.length > 0 || ticketsData.length > 0) {
      const tkIds = ticketsData.map(tk => tk.Id);
      
      let q = supabase.from('Comments').select('*');
      if (tIds.length > 0 && tkIds.length > 0) {
        q = q.or(`TaskId.in.(${tIds.join(',')}),IssueId.in.(${tkIds.join(',')})`);
      } else if (tIds.length > 0) {
        q = q.in('TaskId', tIds);
      } else if (tkIds.length > 0) {
        q = q.in('IssueId', tkIds);
      }
      const { data } = await q.order('CreatedAt', { ascending: true });
      commentsData = data || [];
    }

    const getUserName = (id) => {
      const u = (users || []).find(x => x.Id === id);
      return u ? u.DisplayName : null;
    };

    const now = new Date();
    const comments = commentsData.map(c => ({...c, AuthorName: getUserName(c.AuthorId)}));
    
    const tickets = ticketsData.map(i => {
      let currentStatus = i.Status;
      if (i.DueDate && new Date(i.DueDate) < now && currentStatus.toLowerCase() !== 'done' && currentStatus.toLowerCase() !== 'closed') {
        currentStatus = 'Overdue';
      }
      return { 
        ...i, 
        AssigneeName: getUserName(i.AssigneeId),
        Status: currentStatus,
        comments: comments.filter(c => c.IssueId === i.Id)
      };
    });

    const tasks = tasksData.map(t => {
      let currentStatus = t.Status;
      if (t.DueDate && new Date(t.DueDate) < now && currentStatus.toLowerCase() !== 'done') {
        currentStatus = 'Overdue';
      }
      return { 
        ...t, 
        AssigneeName: getUserName(t.AssigneeId),
        Status: currentStatus,
        tickets: tickets.filter(tk => tk.TaskId === t.Id),
        comments: comments.filter(c => c.TaskId === t.Id)
      };
    });
    
    res.json({ tasks, tickets });
  } catch (err) { res.status(500).send(err.message); }
});

// DASHBOARD STATS
app.get('/api/dashboard', async (req, res) => {
  try {
    const auth = await getUserAuth(req);
    let projects = [], tasks = [], tickets = [], milestones = [];
    
    if (auth.role === 'Admin') {
      const { data: p } = await supabase.from('Projects').select('Id, Name'); projects = p || [];
      const { data: t } = await supabase.from('Tasks').select('Id, ProjectId, Status, DueDate'); tasks = t || [];
      const { data: tk } = await supabase.from('Tickets').select('Id, Status, DueDate, ProjectId, TaskId'); tickets = tk || [];
      const { data: m } = await supabase.from('Milestones').select('*'); milestones = m || [];
    } else {
      const { data: up } = await supabase.from('UserProjects').select('ProjectId').eq('UserId', auth.id);
      const pIds = (up || []).map(r => r.ProjectId);
      
      const { data: p } = await supabase.from('Projects').select('Id, Name').in('Id', pIds.length ? pIds : [0]); projects = p || [];
      const { data: t } = await supabase.from('Tasks').select('Id, ProjectId, Status, DueDate').in('ProjectId', pIds.length ? pIds : [0]); tasks = t || [];
      
      const tIds = tasks.map(x => x.Id);
      const { data: tk1 } = await supabase.from('Tickets').select('Id, Status, DueDate, ProjectId, TaskId').in('ProjectId', pIds.length ? pIds : [0]);
      const { data: tk2 } = await supabase.from('Tickets').select('Id, Status, DueDate, ProjectId, TaskId').in('TaskId', tIds.length ? tIds : [0]);
      
      const tkMap = new Map();
      [...(tk1 || []), ...(tk2 || [])].forEach(tk => tkMap.set(tk.Id, tk));
      tickets = Array.from(tkMap.values());
      
      const { data: m } = await supabase.from('Milestones').select('*').in('ProjectId', pIds.length ? pIds : [0]); milestones = m || [];
    }
    
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
        
        const pTickets = tickets.filter(i => i.ProjectId === p.Id || (i.TaskId && tasks.find(ts => ts.Id === i.TaskId && ts.ProjectId === p.Id))).map(i => {
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
  } catch (err) { res.status(500).send(err.message); }
});

app.post('/api/feed', async (req, res) => {
  try {
    const { content, parsedTags, authorId, parentId } = req.body;
    
    // Process "new task" or "new issue"
    const lowerContent = content.toLowerCase();
    const isNewTask = lowerContent.includes('new task');
    const isNewIssue = lowerContent.includes('new issue');
    
    let assignedUserId = null;
    let projectId = null;
    let taskId = null;
    let ticketId = null;
    
    const { data: users } = await supabase.from('Users').select('Id, DisplayName');
    const { data: projects } = await supabase.from('Projects').select('Id, Name');
    const { data: tasks } = await supabase.from('Tasks').select('Id, Title, ProjectId');
    const { data: tickets } = await supabase.from('Tickets').select('Id, Title');

    const clean = (str) => (str || '').replace(/\s+/g, '').toLowerCase();

    const resolvedTags = [];
    for (let tag of parsedTags || []) {
      const val = clean(tag.value);
      if (tag.symbol === '@') {
        const user = users?.find(u => clean(u.DisplayName) === val);
        if (user) { assignedUserId = user.Id; resolvedTags.push({ type: 'user', id: user.Id }); }
      } else if (tag.symbol === '#') {
        const proj = projects?.find(p => clean(p.Name) === val);
        if (proj) { projectId = proj.Id; resolvedTags.push({ type: 'project', id: proj.Id }); }
        
        const tsk = tasks?.find(t => clean(t.Title) === val);
        if (tsk) { taskId = tsk.Id; resolvedTags.push({ type: 'task', id: tsk.Id }); }
      } else if (tag.symbol === '!') {
        const tkt = tickets?.find(t => clean(t.Title) === val);
        if (tkt) { ticketId = tkt.Id; resolvedTags.push({ type: 'ticket', id: tkt.Id }); }
      }
    }

    const titleMatch = content.match(/(?:new task|new issue)[\s:]*([^#@!*&]+)/i);
    let title = titleMatch ? titleMatch[1].trim() : 'Auto-created item';
    if (title.length > 100) title = title.substring(0, 100) + '...';

    if (isNewTask && projectId) {
      const dup = tasks?.find(t => t.ProjectId === projectId && t.Title.toLowerCase() === title.toLowerCase());
      if (!dup) {
        const { data: newTask } = await supabase.from('Tasks').insert({
          Title: title,
          ProjectId: projectId,
          AssigneeId: assignedUserId,
          Status: 'New',
          Description: content
        }).select();
        if (newTask && newTask.length > 0) {
          taskId = newTask[0].Id;
          resolvedTags.push({ type: 'task', id: taskId });
          io.emit('db_updated');
        }
      }
    } else if (isNewIssue && (taskId || projectId)) {
      const dup = tickets?.find(t => t.Title.toLowerCase() === title.toLowerCase());
      if (!dup) {
        const { data: newTicket } = await supabase.from('Tickets').insert({
          Title: title,
          TaskId: taskId || null,
          ProjectId: projectId || null,
          AssigneeId: assignedUserId,
          Status: 'New'
        }).select();
        if (newTicket && newTicket.length > 0) {
          ticketId = newTicket[0].Id;
          resolvedTags.push({ type: 'ticket', id: ticketId });
          io.emit('db_updated');
        }
      }
    } else if (assignedUserId) {
      if (taskId && !isNewTask) {
        await supabase.from('Tasks').update({ AssigneeId: assignedUserId }).eq('Id', taskId);
        io.emit('db_updated');
      } else if (ticketId && !isNewIssue) {
        await supabase.from('Tickets').update({ AssigneeId: assignedUserId }).eq('Id', ticketId);
        io.emit('db_updated');
      }
    }

    const { data: resData, error } = await supabase.from('Feed').insert({
      Content: content,
      ParsedTags: JSON.stringify(resolvedTags),
      AuthorId: authorId || 1,
      ParentId: parentId || null
    }).select();
    
    if (error) throw error;
    if (resData && resData.length > 0) {
      io.emit('feed_added', resData[0]);
      res.json(resData[0]);
    } else {
      res.status(500).send('Failed to create feed');
    }
  } catch (err) {
    res.status(500).send(err.message);
  }
});

io.on('connection', (socket) => {
  // socket handlers if any remain
});

const PORT = process.env.PORT || 3001;

if (process.env.NODE_ENV !== 'production') {
  server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}
export default app;
