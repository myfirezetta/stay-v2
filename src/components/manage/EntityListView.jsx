import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Plus, CheckCircle, Clock, Check, Edit2, Trash2 } from 'lucide-react';
import { EntityCreateModal } from './EntityCreateModal';

export function EntityListView({ entityType, currentUser }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);

  const openEditModal = (item) => {
    setEditItem(item);
    setIsCreateModalOpen(true);
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/${entityType.toLowerCase()}`, {
        headers: currentUser ? { 'X-User-Id': currentUser.id.toString() } : {}
      });
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch (err) {
      console.error("Failed to load entities", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [entityType]);

  const deleteItem = async (id) => {
    if (!window.confirm(`Are you sure you want to delete this ${entityType.slice(0, -1)}?`)) return;
    try {
      await fetch(`/api/${entityType.toLowerCase()}/${id}`, {
        method: 'DELETE',
        headers: currentUser ? { 'X-User-Id': currentUser.id.toString() } : {}
      });
      fetchData(); // refresh list
    } catch (e) {
      console.error(e);
    }
  };

  const markAsDone = async (id, isTicket) => {
    const endpoint = isTicket ? `/api/tickets/${id}` : `/api/tasks/${id}/status`;
    try {
      if (isTicket) {
        const item = data.find(d => d.Id === id);
        await fetch(`${endpoint}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            ...(currentUser ? { 'X-User-Id': currentUser.id.toString() } : {})
          },
          body: JSON.stringify({ ...item, status: 'Done' })
        });
      } else {
        await fetch(`${endpoint}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            ...(currentUser ? { 'X-User-Id': currentUser.id.toString() } : {})
          },
          body: JSON.stringify({ status: 'Done' })
        });
      }
      fetchData(); // refresh list
    } catch (e) {
      console.error(e);
    }
  };

  const getSmartStatus = (item) => {
    if (item.Status && item.Status.toLowerCase() === 'done') return 'Done';
    
    const now = new Date();
    
    if (item.DueDate && new Date(item.DueDate) < now) {
      return 'Overdue';
    }
    
    if (item.StartDate) {
      return 'Ongoing';
    }
    
    return 'New';
  };

  const getStatusBadge = (status) => {
    switch (status.toLowerCase()) {
      case 'done':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400">Done</span>;
      case 'overdue':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400">Overdue</span>;
      case 'ongoing':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400">Ongoing</span>;
      case 'new':
      default:
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">New</span>;
    }
  };

  const renderTableHeaders = () => {
    if (['Tasks', 'Tickets'].includes(entityType)) {
      return (
        <tr>
          <th className="px-6 py-4 text-left text-xs font-bold text-zinc-500 uppercase tracking-wider">Title</th>
          <th className="px-6 py-4 text-left text-xs font-bold text-zinc-500 uppercase tracking-wider">Status</th>
          <th className="px-6 py-4 text-left text-xs font-bold text-zinc-500 uppercase tracking-wider">Start Date</th>
          <th className="px-6 py-4 text-left text-xs font-bold text-zinc-500 uppercase tracking-wider">Due Date</th>
          <th className="px-6 py-4 text-right text-xs font-bold text-zinc-500 uppercase tracking-wider">Actions</th>
        </tr>
      );
    }
    if (entityType === 'Projects') {
      return (
        <tr>
          <th className="px-6 py-4 text-left text-xs font-bold text-zinc-500 uppercase tracking-wider">Name</th>
          <th className="px-6 py-4 text-left text-xs font-bold text-zinc-500 uppercase tracking-wider">Description</th>
          <th className="px-6 py-4 text-left text-xs font-bold text-zinc-500 uppercase tracking-wider">Created</th>
          <th className="px-6 py-4 text-right text-xs font-bold text-zinc-500 uppercase tracking-wider">Actions</th>
        </tr>
      );
    }
    // Default fallback
    return (
      <tr>
        <th className="px-6 py-4 text-left text-xs font-bold text-zinc-500 uppercase tracking-wider">Name</th>
        <th className="px-6 py-4 text-left text-xs font-bold text-zinc-500 uppercase tracking-wider">Details</th>
        <th className="px-6 py-4 text-right text-xs font-bold text-zinc-500 uppercase tracking-wider">Actions</th>
      </tr>
    );
  };

  const renderTableRow = (item) => {
    if (['Tasks', 'Tickets'].includes(entityType)) {
      const smartStatus = getSmartStatus(item);
      const isTicket = entityType === 'Tickets';
      return (
        <tr key={item.Id} className="border-b border-zinc-100 dark:border-zinc-800/50 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors">
          <td className="px-6 py-4 font-semibold text-zinc-900 dark:text-zinc-100">{item.Title}</td>
          <td className="px-6 py-4">{getStatusBadge(smartStatus)}</td>
          <td className="px-6 py-4 text-sm text-zinc-500">{item.StartDate ? new Date(item.StartDate).toLocaleDateString() : '-'}</td>
          <td className="px-6 py-4 text-sm text-zinc-500">{item.DueDate ? new Date(item.DueDate).toLocaleDateString() : '-'}</td>
          <td className="px-6 py-4 text-right flex items-center justify-end gap-2">
            <button 
              onClick={() => openEditModal(item)}
              title="Edit"
              className="p-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
            >
              <Edit2 size={16} />
            </button>
            <button 
              onClick={() => deleteItem(item.Id)}
              title="Delete"
              className="p-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-red-100 dark:hover:bg-red-500/20 hover:text-red-700 dark:hover:text-red-400 transition-colors"
            >
              <Trash2 size={16} />
            </button>
            {smartStatus !== 'Done' && (
              <button 
                onClick={() => markAsDone(item.Id, isTicket)}
                title="Mark Done"
                className="p-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-emerald-100 dark:hover:bg-emerald-500/20 hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors"
              >
                <Check size={16} />
              </button>
            )}
          </td>
        </tr>
      );
    }

    if (entityType === 'Projects') {
      return (
        <tr key={item.Id} className="border-b border-zinc-100 dark:border-zinc-800/50 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors">
          <td className="px-6 py-4 font-semibold text-zinc-900 dark:text-zinc-100">{item.Name}</td>
          <td className="px-6 py-4 text-sm text-zinc-500 max-w-md truncate">{item.Description}</td>
          <td className="px-6 py-4 text-sm text-zinc-500">{new Date(item.CreatedAt).toLocaleDateString()}</td>
          <td className="px-6 py-4 text-right flex items-center justify-end gap-2">
            <button 
              onClick={() => openEditModal(item)}
              title="Edit"
              className="p-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
            >
              <Edit2 size={16} />
            </button>
            <button 
              onClick={() => deleteItem(item.Id)}
              title="Delete"
              className="p-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-red-100 dark:hover:bg-red-500/20 hover:text-red-700 dark:hover:text-red-400 transition-colors"
            >
              <Trash2 size={16} />
            </button>
          </td>
        </tr>
      );
    }

    // Default fallback
    return (
      <tr key={item.Id || Math.random()} className="border-b border-zinc-100 dark:border-zinc-800/50 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors">
        <td className="px-6 py-4 font-semibold text-zinc-900 dark:text-zinc-100">{item.Name || item.DisplayName || item.Title}</td>
        <td className="px-6 py-4 text-sm text-zinc-500">{item.Description || item.Email || '-'}</td>
        <td className="px-6 py-4 text-right flex items-center justify-end gap-2">
          <button 
            onClick={() => openEditModal(item)}
            title="Edit"
            className="p-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
          >
            <Edit2 size={16} />
          </button>
          <button 
            onClick={() => deleteItem(item.Id)}
            title="Delete"
            className="p-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-red-100 dark:hover:bg-red-500/20 hover:text-red-700 dark:hover:text-red-400 transition-colors"
          >
            <Trash2 size={16} />
          </button>
        </td>
      </tr>
    );
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 md:p-8 flex-1 w-full"
    >
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50">Manage {entityType}</h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">View and organize all {entityType.toLowerCase()} in the system.</p>
        </div>
        <button 
          onClick={() => {
            setEditItem(null);
            setIsCreateModalOpen(true);
          }}
          className="px-5 py-2.5 rounded-full font-bold text-sm text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 transition-colors flex items-center gap-2"
        >
          <Plus size={18} />
          Create New
        </button>
      </div>

      <div className="bg-white/50 dark:bg-zinc-950/50 backdrop-blur-xl border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse">
            <thead className="bg-zinc-50 dark:bg-zinc-900/50 border-b border-zinc-200 dark:border-zinc-800">
              {renderTableHeaders()}
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-zinc-500">
                    <div className="animate-pulse flex flex-col items-center gap-2">
                      <div className="w-6 h-6 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin"></div>
                      <span>Loading {entityType}...</span>
                    </div>
                  </td>
                </tr>
              ) : data.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-zinc-500 flex flex-col items-center">
                    <div className="w-12 h-12 rounded-full bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center mb-3">
                      <Clock className="text-zinc-400" size={24} />
                    </div>
                    <p className="font-medium">No {entityType.toLowerCase()} found.</p>
                  </td>
                </tr>
              ) : (
                data.map(renderTableRow)
              )}
            </tbody>
          </table>
        </div>
      </div>

      <EntityCreateModal 
        isOpen={isCreateModalOpen} 
        entityType={entityType} 
        editItem={editItem}
        onClose={() => {
          setIsCreateModalOpen(false);
          setEditItem(null);
          fetchData(); // Refresh after creating/editing
        }} 
        currentUser={currentUser}
      />
    </motion.div>
  );
}
