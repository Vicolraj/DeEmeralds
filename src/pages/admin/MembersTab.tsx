import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import imageCompression from 'browser-image-compression';
import { getMembers, createMember, updateMember, deleteMember } from '../../lib/api';
import { uploadToCloudinary } from '../../lib/cloudinary';
import { VOICE_ROLES } from '../../lib/constants';
import type { Member, VoiceRole } from '../../lib/types';
import { FaPlus, FaEdit, FaTrash, FaTimes, FaCamera, FaArrowUp, FaArrowDown } from 'react-icons/fa';

export default function MembersTab() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [isReordering, setIsReordering] = useState(false);

  // Form State
  const [firstName, setFirstName] = useState('');
  const [middleName, setMiddleName] = useState('');
  const [lastName, setLastName] = useState('');
  const [role, setRole] = useState<VoiceRole>(VOICE_ROLES[0] as VoiceRole);
  const [customRole, setCustomRole] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [photoPublicId, setPhotoPublicId] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadPercent, setUploadPercent] = useState(0);

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      // In Admin, we want to see ALL members including those without accounts
      const data = await getMembers(true); 
      // Ensure all members have a valid displayOrder for consistent sorting
      const fullyOrdered = data.map((m, idx) => ({
        ...m,
        displayOrder: typeof m.displayOrder === 'number' ? m.displayOrder : idx
      })).sort((a, b) => a.displayOrder - b.displayOrder);
      setMembers(fullyOrdered);
    } catch (err) {
      console.error('Error fetching members:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleMove = async (index: number, direction: 'up' | 'down') => {
    if (isReordering) return;
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= members.length) return;

    setIsReordering(true);
    const updatedMembers = [...members];
    // Swap displayOrder with safety checks
    const current = { ...updatedMembers[index] };
    const neighbor = { ...updatedMembers[newIndex] };
    
    const tempOrder = current.displayOrder;
    current.displayOrder = neighbor.displayOrder;
    neighbor.displayOrder = tempOrder;

    // Optimistic UI update — updated order property must be included in array
    updatedMembers[index] = neighbor;
    updatedMembers[newIndex] = current;
    
    // Sort and set state
    setMembers([...updatedMembers].sort((a, b) => a.displayOrder - b.displayOrder));

    try {
      // Persist both changes
      await Promise.all([
        updateMember(current.id, { displayOrder: current.displayOrder }),
        updateMember(neighbor.id, { displayOrder: neighbor.displayOrder })
      ]);
    } catch (err) {
      alert('Failed to save new order.');
      fetchMembers(); // Revert on failure
    } finally {
      setIsReordering(false);
    }
  };

  const resetForm = () => {
    setFirstName('');
    setMiddleName('');
    setLastName('');
    setRole(VOICE_ROLES[0] as VoiceRole);
    setCustomRole('');
    setPhotoUrl('');
    setPhotoPublicId('');
    setEditingMember(null);
    setUploadPercent(0);
  };

  const openAddModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const openEditModal = (member: Member) => {
    setEditingMember(member);
    setFirstName(member.firstName);
    setMiddleName(member.middleName || '');
    setLastName(member.lastName);
    
    // If role is not in VOICE_ROLES list, treat it as custom "Other"
    const knownRoles = VOICE_ROLES as readonly string[];
    if (knownRoles.includes(member.role)) {
      setRole(member.role as VoiceRole);
      setCustomRole('');
    } else {
      setRole('Other' as VoiceRole);
      setCustomRole(member.role);
    }

    setPhotoUrl(member.photoUrl || '');
    setPhotoPublicId(member.photoPublicId || '');
    setIsModalOpen(true);
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadPercent(0);

    try {
      // ── Compression Opts (WhatsApp-Style < 90KB) ──
      const options = {
        maxSizeMB: 0.09, // 90KB
        maxWidthOrHeight: 1024,
        useWebWorker: true,
        initialQuality: 0.7,
      };

      const compressedFile = await imageCompression(file, options);
      console.log(`Original: ${file.size / 1024}KB, Compressed: ${compressedFile.size / 1024}KB`);

      const result = await uploadToCloudinary(compressedFile, (p) => setUploadPercent(p));
      setPhotoUrl(result.url);
      setPhotoPublicId(result.publicId);
    } catch (err: any) {
      const msg = err?.message || 'Photo upload failed.';
      alert(msg);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      firstName,
      middleName: middleName || null,
      lastName,
      role: role === 'Other' ? (customRole.trim() || 'Other') : role,
      photoUrl: photoUrl || null,
      photoPublicId: photoPublicId || null,
      // Assign next displayOrder for new members
      displayOrder: editingMember ? editingMember.displayOrder : Math.max(0, ...members.map(m => m.displayOrder || 0)) + 1,
    };

    try {
      if (editingMember) {
        await updateMember(editingMember.id, data);
      } else {
        await createMember(data);
      }
      setIsModalOpen(false);
      fetchMembers();
    } catch (err) {
      alert('Failed to save member.');
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this member?')) {
      try {
        await deleteMember(id);
        fetchMembers();
      } catch (err) {
        alert('Failed to delete member.');
      }
    }
  };

  return (
    <div className="space-y-8">
      {/* Search and Add row */}
      <div className="flex justify-between items-center bg-white/5 p-6 rounded-lg border border-white/5">
        <h2 className="font-display text-2xl text-white font-light tracking-widest leading-normal mb-0">Member Directory</h2>
        <button
          onClick={openAddModal}
          className="flex items-center gap-2 bg-gold-500 text-emerald-950 px-6 py-3 rounded-sm font-body uppercase text-xs tracking-widest font-bold hover:bg-gold-400 transition-colors"
        >
          <FaPlus /> Add New Member
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-10 h-10 border-2 border-gold-500/30 border-t-gold-500 rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {members.map((member, index) => (
            <div key={member.id} className="glass p-4 rounded-lg flex items-center gap-4 group">
              {/* Reordering Buttons */}
              <div className="flex flex-col gap-1 border-r border-white/5 pr-2 mr-1">
                <button
                  onClick={() => handleMove(index, 'up')}
                  disabled={index === 0 || isReordering}
                  className="p-1.5 text-white/20 hover:text-gold-500 disabled:opacity-0 transition-all rounded hover:bg-white/5"
                  title="Move Up"
                >
                  <FaArrowUp className="text-xs" />
                </button>
                <button
                  onClick={() => handleMove(index, 'down')}
                  disabled={index === members.length - 1 || isReordering}
                  className="p-1.5 text-white/20 hover:text-gold-500 disabled:opacity-0 transition-all rounded hover:bg-white/5"
                  title="Move Down"
                >
                  <FaArrowDown className="text-xs" />
                </button>
              </div>

              <div className="w-16 h-20 rounded bg-emerald-900/50 overflow-hidden flex-shrink-0">
                {member.photoUrl ? (
                  <img src={member.photoUrl} alt="" className="w-full h-full object-cover object-top" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gold-500/30 text-xl font-display">
                    {member.firstName[0]}
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-display text-lg text-white font-medium truncate leading-normal">
                  {member.firstName} {member.lastName}
                </p>
                <p className="font-body text-gold-500/60 text-xs uppercase tracking-widest truncate">
                  {member.role}
                </p>
              </div>
              <div className="flex flex-col gap-2 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                <button
                   onClick={() => openEditModal(member)}
                   className="p-2 text-white/40 hover:text-gold-400 transition-colors"
                >
                  <FaEdit />
                </button>
                <button
                  onClick={() => handleDelete(member.id)}
                  className="p-2 text-white/20 hover:text-red-400 transition-colors"
                >
                  <FaTrash />
                </button>
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
              className="relative w-full max-w-2xl glass-strong border border-white/10 rounded-xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-6 border-b border-white/5">
                <h3 className="font-display text-2xl text-white font-light leading-normal mb-0">
                  {editingMember ? 'Edit Member' : 'Add New Member'}
                </h3>
                <button onClick={() => setIsModalOpen(false)} className="text-white/40 hover:text-white transition-colors">
                  <FaTimes />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-8 space-y-8">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <div>
                    <label className="block font-body text-gold-500/60 text-xs uppercase tracking-widest mb-2">First Name</label>
                    <input
                      type="text"
                      className="w-full bg-white/5 border border-white/10 p-3 text-white focus:border-gold-500/50 outline-none transition-colors rounded-sm"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="block font-body text-gold-500/60 text-xs uppercase tracking-widest mb-2">Middle Name</label>
                    <input
                      type="text"
                      className="w-full bg-white/5 border border-white/10 p-3 text-white focus:border-gold-500/50 outline-none transition-colors rounded-sm"
                      value={middleName}
                      onChange={(e) => setMiddleName(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block font-body text-gold-500/60 text-xs uppercase tracking-widest mb-2">Last Name</label>
                    <input
                      type="text"
                      className="w-full bg-white/5 border border-white/10 p-3 text-white focus:border-gold-500/50 outline-none transition-colors rounded-sm"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  <div>
                    <label className="block font-body text-gold-500/60 text-xs uppercase tracking-widest mb-2">Voice Role / Position</label>
                    <select
                      className="w-full bg-emerald-900 border border-white/10 p-3 text-white focus:border-gold-500/50 outline-none transition-colors rounded-sm"
                      value={role}
                      onChange={(e) => setRole(e.target.value as VoiceRole)}
                      required
                    >
                      {VOICE_ROLES.map((r) => (
                        <option key={r} value={r}>{r}</option>
                      ))}
                    </select>
                    {/* Custom role input — only visible when 'Other' is selected */}
                    {role === 'Other' && (
                        <input
                            type="text"
                            className="w-full mt-3 bg-white/5 border border-gold-500/30 p-3 text-white placeholder-white/30 focus:border-gold-500/50 outline-none transition-colors rounded-sm"
                            placeholder="Type custom role (e.g. Percussionist)"
                            value={customRole}
                            onChange={(e) => setCustomRole(e.target.value)}
                            autoFocus
                        />
                    )}
                  </div>

                  <div>
                    <label className="block font-body text-gold-500/60 text-xs uppercase tracking-widest mb-2">Photo</label>
                    <div className="flex items-center gap-4">
                        <label className="flex-1 glass border border-dashed border-white/20 p-4 rounded cursor-pointer hover:bg-white/5 transition-all text-center">
                            <span className="flex items-center justify-center gap-2 text-white/50 text-xs font-body tracking-wider uppercase">
                                <FaCamera /> {uploading ? `Uploading ${uploadPercent}%` : (photoUrl ? 'Replace Photo' : 'Upload Photo')}
                            </span>
                            <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} disabled={uploading} />
                        </label>
                        {photoUrl && (
                            <img src={photoUrl} className="w-12 h-12 rounded object-cover border border-white/10" alt="Preview" />
                        )}
                    </div>
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    className="w-full bg-gold-500 text-emerald-950 py-3 font-body font-bold uppercase tracking-[.2em] text-sm hover:bg-gold-400 transition-all duration-300"
                  >
                    {editingMember ? 'Update Member' : 'Save Member'}
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
