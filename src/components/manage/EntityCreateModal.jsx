import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Save, AlertCircle } from 'lucide-react';

export function EntityCreateModal({ isOpen, onClose, entityType, currentUser, editItem }) {
  const [formData, setFormData] = useState({});
  const [lookupData, setLookupData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      if (editItem) {
        setFormData({
          name: editItem.Name || editItem.Title || editItem.DisplayName || '',
          description: editItem.Description || '',
          email: editItem.Email || '',
          projectId: editItem.ProjectId || '',
          assigneeIds: editItem.AssigneeIds || [],
          startDate: editItem.StartDate ? editItem.StartDate.split('T')[0] : '',
          dueDate: editItem.DueDate ? editItem.DueDate.split('T')[0] : '',
          attachmentUrl: editItem.AttachmentUrl || ''
        });
      } else {
        setFormData({});
      }
      setError('');
      fetch('/api/lookup', {
        headers: currentUser ? { 'X-User-Id': currentUser.id.toString() } : {}
      })
        .then(res => res.json())
        .then(data => setLookupData(data))
        .catch(err => console.error(err));
    }
  }, [isOpen, entityType, editItem, currentUser]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const data = new FormData();
    data.append('file', file);
    
    try {
      setLoading(true);
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: data
      });
      if (!res.ok) throw new Error('Upload failed');
      const json = await res.json();
      setFormData(prev => ({ ...prev, attachmentUrl: json.url }));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    let endpoint = '';
    let payload = { ...formData };

    switch (entityType) {
      case 'Projects':
        endpoint = '/api/projects';
        break;
      case 'Tasks':
        endpoint = '/api/tasks';
        break;
      case 'Tickets':
        endpoint = '/api/tickets';
        break;
      case 'Systems':
        endpoint = '/api/systems';
        break;
      case 'Users':
        endpoint = '/api/users';
        // Map common modal fields to backend fields
        if (payload.name) { payload.displayName = payload.name; delete payload.name; }
        break;
      case 'Groups':
        endpoint = '/api/groups';
        break;
      case 'Departments':
        // Optional: Implement Departments API if needed, for now throw error
        setError('Departments API not yet implemented.');
        setLoading(false);
        return;
      default:
        setError('Unknown entity type');
        setLoading(false);
        return;
    }

    // Default titles vs names
    if (['Tasks', 'Tickets'].includes(entityType) && payload.name) {
      payload.title = payload.name;
      delete payload.name;
    }

    try {
      const isEdit = !!editItem;
      const finalEndpoint = isEdit ? `${endpoint}/${editItem.Id}` : endpoint;
      const res = await fetch(`${finalEndpoint}`, {
        method: isEdit ? 'PATCH' : 'POST',
        headers: { 
          'Content-Type': 'application/json',
          ...(currentUser ? { 'X-User-Id': currentUser.id.toString() } : {})
        },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error(`Failed to ${isEdit ? 'update' : 'create'} entity`);
      
      onClose(); // Success!
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const renderFields = () => {
    const fields = [];
    
    // Name / Title
    fields.push(
      <div key="name" className="flex flex-col gap-1.5">
        <label className="text-sm font-bold text-zinc-950 dark:text-zinc-50">{['Tasks', 'Tickets'].includes(entityType) ? 'Title' : 'Name'}</label>
        <input 
          type="text" 
          name="name" 
          value={formData.name || ''}
          required 
          onChange={handleInputChange} 
          className="w-full p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-950 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-indigo-500" 
          placeholder={`Enter ${entityType.slice(0, -1).toLowerCase()} ${['Tasks', 'Tickets'].includes(entityType) ? 'title' : 'name'}...`} 
        />
      </div>
    );

    // Description
    if (['Projects', 'Tasks', 'Systems', 'Groups', 'Users', 'Tickets'].includes(entityType)) {
      fields.push(
        <div key="desc" className="flex flex-col gap-1.5">
          <label className="text-sm font-bold text-zinc-950 dark:text-zinc-50">Description</label>
          <textarea 
            name="description" 
            value={formData.description || ''}
            rows="3" 
            onChange={handleInputChange} 
            className="w-full p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-950 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none" 
            placeholder="Add some details..." 
          />
        </div>
      );
    }

    // Specific relations via lookupData
    if (lookupData) {
      if (['Tasks', 'Tickets'].includes(entityType)) {
        fields.push(
          <div key="project" className="flex flex-col gap-1.5">
            <label className="text-sm font-bold text-zinc-950 dark:text-zinc-50">Project</label>
            <select name="projectId" value={formData.projectId || ''} onChange={handleInputChange} className="w-full p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-950 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-indigo-500">
              <option value="">Select Project...</option>
              {lookupData.projects?.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>
        );
      }

      if (['Tasks', 'Tickets'].includes(entityType)) {
        fields.push(
          <div key="assignees" className="flex flex-col gap-1.5">
            <label className="text-sm font-bold text-zinc-950 dark:text-zinc-50">Assignees</label>
            <div className="flex flex-col gap-2 max-h-40 overflow-y-auto p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
              {lookupData.users?.map(u => (
                <label key={u.id} className="flex items-center gap-2 cursor-pointer text-sm text-zinc-950 dark:text-zinc-50">
                  <input 
                    type="checkbox" 
                    checked={(formData.assigneeIds || []).includes(u.id)}
                    onChange={(e) => {
                      const current = formData.assigneeIds || [];
                      const next = e.target.checked 
                        ? [...current, u.id] 
                        : current.filter(id => id !== u.id);
                      setFormData(prev => ({ ...prev, assigneeIds: next }));
                    }}
                    className="rounded border-zinc-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  {u.name}
                </label>
              ))}
            </div>
          </div>
        );
      }
      
      if (['Tasks', 'Tickets'].includes(entityType)) {
        fields.push(
          <div key="dates" className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-bold text-zinc-950 dark:text-zinc-50">Start Date</label>
              <input type="date" name="startDate" value={formData.startDate || ''} onChange={handleInputChange} className="w-full p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-950 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-bold text-zinc-950 dark:text-zinc-50">Due Date</label>
              <input type="date" name="dueDate" value={formData.dueDate || ''} onChange={handleInputChange} className="w-full p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-950 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
          </div>
        );
      }
      
      if (['Tasks', 'Tickets'].includes(entityType)) {
        fields.push(
          <div key="attachment" className="flex flex-col gap-1.5">
            <label className="text-sm font-bold text-zinc-950 dark:text-zinc-50">Attachment (Image/Doc)</label>
            <input 
              type="file" 
              onChange={handleFileUpload} 
              className="w-full p-2 text-sm text-zinc-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 dark:file:bg-indigo-500/10 dark:file:text-indigo-400" 
            />
            {formData.attachmentUrl && (
              <a href={formData.attachmentUrl} target="_blank" rel="noreferrer" className="text-xs text-indigo-600 dark:text-indigo-400 font-medium mt-1 hover:underline truncate">
                View Attached File
              </a>
            )}
          </div>
        );
      }
    }

    // User specific
    if (entityType === 'Users') {
      fields.push(
        <div key="email" className="flex flex-col gap-1.5">
          <label className="text-sm font-bold text-zinc-950 dark:text-zinc-50">Email</label>
          <input 
            type="email" 
            name="email" 
            value={formData.email || ''}
            required 
            onChange={handleInputChange} 
            className="w-full p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-950 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-indigo-500" 
            placeholder="user@example.com" 
          />
        </div>
      );
    }

    return <div className="flex flex-col gap-5">{fields}</div>;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-zinc-950/40 backdrop-blur-md z-[60]"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-white dark:bg-zinc-950 rounded-2xl shadow-2xl z-[70] border border-zinc-200 dark:border-zinc-800 overflow-hidden flex flex-col max-h-[90vh]"
          >
            <div className="flex items-center justify-between p-5 border-b border-zinc-100 dark:border-zinc-800/50 bg-zinc-50/50 dark:bg-zinc-900/50">
              <h2 className="text-xl font-extrabold tracking-tight text-zinc-950 dark:text-zinc-50">
                {editItem ? 'Edit' : 'Create New'} {entityType.slice(0, -1)}
              </h2>
              <button onClick={onClose} className="p-2 rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors">
                <X size={18} className="text-zinc-500 dark:text-zinc-400" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
              {error && (
                <div className="p-4 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 flex items-start gap-3 text-red-600 dark:text-red-400">
                  <AlertCircle size={20} className="shrink-0 mt-0.5" />
                  <p className="text-sm font-medium">{error}</p>
                </div>
              )}
              
              {renderFields()}
              
              <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800/50 flex justify-end gap-3 mt-auto">
                <button 
                  type="button" 
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-xl font-bold text-sm text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={loading}
                  className="px-6 py-2.5 rounded-xl font-bold text-sm text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 transition-colors flex items-center gap-2 disabled:opacity-50"
                >
                  <Save size={18} />
                  {loading ? 'Saving...' : (editItem ? 'Save Changes' : 'Create')}
                </button>
              </div>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
