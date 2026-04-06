import { useState, useEffect } from 'react';
import axios from 'axios';
import { FaTrash, FaCheckCircle, FaTimesCircle, FaKey, FaUserShield } from 'react-icons/fa';

export default function MemberAccountsTab() {
  const [accounts, setAccounts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    const token = localStorage.getItem('token');
    try {
      const { data } = await axios.get('/api/member-auth/accounts', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAccounts(data);
    } catch (err) {
      console.error('Error fetching accounts:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (id: number, currentStatus: boolean) => {
    const token = localStorage.getItem('token');
    try {
      await axios.put(`/api/member-auth/accounts/${id}/status`, { isActive: !currentStatus }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchAccounts();
    } catch (err) {
      alert('Failed to update status');
    }
  };

  const handleResetPassword = async (id: number) => {
    const newPassword = prompt('Enter temporary password for this member:');
    if (!newPassword) return;

    const token = localStorage.getItem('token');
    try {
      await axios.put(`/api/member-auth/accounts/${id}/password`, { newPassword }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Password reset. Member will be prompted to change it on next login.');
    } catch (err) {
      alert('Failed to reset password');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure? This deletes the login account but KEEPS the public member record.')) return;

    const token = localStorage.getItem('token');
    try {
      await axios.delete(`/api/member-auth/accounts/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchAccounts();
    } catch (err) {
      alert('Failed to delete account');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between bg-white/5 p-6 rounded-lg border border-white/5">
        <div>
          <h2 className="font-display text-2xl text-white font-light tracking-widest leading-normal mb-1">Portal Accounts</h2>
          <p className="text-white/40 text-[10px] uppercase tracking-widest">Manage member login credentials and access</p>
        </div>
        <div className="w-12 h-12 bg-gold-500/10 rounded-full flex items-center justify-center text-gold-500">
           <FaUserShield />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-10 h-10 border-2 border-gold-500/20 border-t-gold-500 rounded-full animate-spin" />
        </div>
      ) : (
        <div className="glass overflow-hidden rounded-xl border border-white/5">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/5">
                <th className="p-5 font-body text-gold-500/40 text-[10px] uppercase tracking-widest font-bold">Username</th>
                <th className="p-5 font-body text-gold-500/40 text-[10px] uppercase tracking-widest font-bold">Status</th>
                <th className="p-5 font-body text-gold-500/40 text-[10px] uppercase tracking-widest font-bold">Last Login</th>
                <th className="p-5 font-body text-gold-500/40 text-[10px] uppercase tracking-widest font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {accounts.map((acc) => (
                <tr key={acc.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="p-5">
                    <p className="text-white font-medium">{acc.username}</p>
                    <p className="text-white/20 text-[10px]">ID: {acc.id}</p>
                  </td>
                  <td className="p-5">
                    <span className={`inline-flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold ${acc.isActive ? 'text-emerald-400' : 'text-red-400/60'}`}>
                      {acc.isActive ? <FaCheckCircle /> : <FaTimesCircle />}
                      {acc.isActive ? 'Active' : 'Deactivated'}
                    </span>
                  </td>
                  <td className="p-5 text-white/40 text-xs">
                    {acc.lastLogin ? new Date(acc.lastLogin).toLocaleString() : 'Never'}
                  </td>
                  <td className="p-5 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => handleToggleStatus(acc.id, acc.isActive)}
                        className={`p-2 rounded hover:bg-white/5 transition-colors ${acc.isActive ? 'text-red-400/40 hover:text-red-400' : 'text-emerald-400/40 hover:text-emerald-400'}`}
                        title={acc.isActive ? 'Deactivate' : 'Activate'}
                      >
                        {acc.isActive ? <FaTimesCircle /> : <FaCheckCircle />}
                      </button>
                      <button
                        onClick={() => handleResetPassword(acc.id)}
                        className="p-2 text-white/20 hover:text-gold-400 transition-colors"
                        title="Reset Password"
                      >
                        <FaKey />
                      </button>
                      <button
                        onClick={() => handleDelete(acc.id)}
                        className="p-2 text-white/10 hover:text-red-500 transition-colors"
                        title="Delete Account"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {accounts.length === 0 && (
            <div className="p-20 text-center text-white/20 uppercase tracking-widest text-xs">
              No portal accounts created yet.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
