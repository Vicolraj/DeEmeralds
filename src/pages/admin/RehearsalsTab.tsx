import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getRehearsals, createRehearsal, updateRehearsal, deleteRehearsal } from '../../lib/api';
import type { Rehearsal } from '../../lib/types';
import { FaPlus, FaEdit, FaTrash, FaTimes, FaCalendarAlt } from 'react-icons/fa';

export default function RehearsalsTab() {
  const [rehearsals, setRehearsals] = useState<Rehearsal[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRehearsal, setEditingRehearsal] = useState<Rehearsal | null>(null);

  // Form State
  const [day, setDay] = useState('');
  const [time, setTime] = useState('');
  const [location, setLocation] = useState('');

  useEffect(() => {
    fetchRehearsals();
  }, []);

  const fetchRehearsals = async () => {
    try {
      const data = await getRehearsals();
      setRehearsals(data);
    } catch (err) {
      console.error('Error fetching rehearsals:', err);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setDay('');
    setTime('');
    setLocation('');
    setEditingRehearsal(null);
  };

  const openAddModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const openEditModal = (rehearsal: Rehearsal) => {
    setEditingRehearsal(rehearsal);
    setDay(rehearsal.day);
    setTime(rehearsal.time);
    setLocation(rehearsal.location);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      day,
      time,
      location,
      displayOrder: editingRehearsal ? editingRehearsal.displayOrder : rehearsals.length,
    };

    try {
      if (editingRehearsal) {
        await updateRehearsal(editingRehearsal.id, data);
      } else {
        await createRehearsal(data);
      }
      setIsModalOpen(false);
      fetchRehearsals();
    } catch (err) {
      alert('Failed to save rehearsal.');
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Delete this rehearsal schedule?')) {
      try {
        await deleteRehearsal(id);
        fetchRehearsals();
      } catch (err) {
        alert('Failed to delete rehearsal.');
      }
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center bg-white/5 p-6 rounded-lg border border-white/5">
        <h2 className="font-display text-2xl text-white font-light tracking-widest leading-normal mb-0">Rehearsal Schedule Management</h2>
        <button
          onClick={openAddModal}
          className="flex items-center gap-2 bg-gold-500 text-emerald-950 px-6 py-3 rounded-sm font-body uppercase text-xs tracking-widest font-bold hover:bg-gold-400 transition-colors"
        >
          <FaPlus /> Add Rehearsal
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-10 h-10 border-2 border-gold-500/30 border-t-gold-500 rounded-full animate-spin" />
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {rehearsals.map((r) => (
            <div key={r.id} className="glass p-6 rounded-lg flex items-center justify-between group">
              <div className="flex items-center gap-6">
                  <div className="w-12 h-12 rounded-full bg-gold-500/10 flex items-center justify-center">
                    <FaCalendarAlt className="text-gold-500" />
                  </div>
                  <div>
                    <h3 className="font-display text-xl text-white font-medium leading-normal mb-1">{r.day}</h3>
                    <p className="font-body text-white/50 text-sm whitespace-pre-wrap">{r.location}</p>
                  </div>
              </div>
              <div className="flex items-center gap-10">
                <p className="font-body text-gold-400 font-medium tracking-widest uppercase text-sm">{r.time}</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => openEditModal(r)}
                    className="p-2 text-white/40 hover:text-gold-400 transition-colors"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDelete(r.id)}
                    className="p-2 text-white/20 hover:text-red-400 transition-colors"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 sm:p-12">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/90 backdrop-blur-sm"
              onClick={() => setIsModalOpen(false)}
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-lg glass-strong border border-white/10 rounded-xl overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-6 border-b border-white/5">
                <h3 className="font-display text-2xl text-white font-light leading-normal mb-0">
                  {editingRehearsal ? 'Edit Rehearsal' : 'Add Rehearsal'}
                </h3>
                <button onClick={() => setIsModalOpen(false)} className="text-white/40 hover:text-white transition-colors">
                  <FaTimes />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-8 space-y-6">
                <div>
                  <label className="block font-body text-gold-500/60 text-xs uppercase tracking-widest mb-2">Day of Week</label>
                  <input
                    type="text"
                    className="w-full bg-white/5 border border-white/10 p-3 text-white focus:border-gold-500/50 outline-none transition-colors rounded-sm"
                    value={day}
                    onChange={(e) => setDay(e.target.value)}
                    placeholder="E.g. Thursday"
                    required
                  />
                </div>
                <div>
                  <label className="block font-body text-gold-500/60 text-xs uppercase tracking-widest mb-2">Time Slot</label>
                  <input
                    type="text"
                    className="w-full bg-white/5 border border-white/10 p-3 text-white focus:border-gold-500/50 outline-none transition-colors rounded-sm"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    placeholder="E.g. 5:00 PM — 7:00 PM"
                    required
                  />
                </div>
                <div>
                  <label className="block font-body text-gold-500/60 text-xs uppercase tracking-widest mb-2">Location</label>
                  <textarea
                    rows={3}
                    className="w-full bg-white/5 border border-white/10 p-3 text-white focus:border-gold-500/50 outline-none transition-colors rounded-sm resize-none"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="E.g. De Emeralds Secretariat"
                    required
                  />
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    className="w-full bg-gold-500 text-emerald-950 py-3 font-body font-bold uppercase tracking-[.2em] text-sm hover:bg-gold-400 transition-all duration-300"
                  >
                    {editingRehearsal ? 'Update Rehearsal' : 'Add Rehearsal'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
