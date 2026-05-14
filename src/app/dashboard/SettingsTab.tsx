"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { updatePassword, type User } from '@/lib/auth';
import styles from './dashboard.module.css';

interface SettingsTabProps {
  user: User;
  onProfileSaved?: (next: { name: string; phone: string }) => void;
}

export default function SettingsTab({ user, onProfileSaved }: SettingsTabProps) {
  const router = useRouter();
  const [name, setName] = useState(user.name);
  const [phone, setPhone] = useState(user.phone ?? '');
  const [profileMsg, setProfileMsg] = useState<{ kind: 'ok' | 'err'; text: string } | null>(null);
  const [savingProfile, setSavingProfile] = useState(false);

  const [pwCurrent, setPwCurrent] = useState('');
  const [pwNext, setPwNext] = useState('');
  const [pwConfirm, setPwConfirm] = useState('');
  const [pwMsg, setPwMsg] = useState<{ kind: 'ok' | 'err'; text: string } | null>(null);
  const [savingPw, setSavingPw] = useState(false);

  const [delPassword, setDelPassword] = useState('');
  const [delConfirmText, setDelConfirmText] = useState('');
  const [delMsg, setDelMsg] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  const saveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileMsg(null);
    setSavingProfile(true);
    try {
      const res = await fetch('/api/auth/update-profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, phone }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save');
      setProfileMsg({ kind: 'ok', text: 'Profile updated.' });
      onProfileSaved?.({ name: data.profile.name, phone: data.profile.phone ?? '' });
      window.location.reload();
    } catch (err) {
      setProfileMsg({ kind: 'err', text: err instanceof Error ? err.message : 'Unknown error' });
    } finally {
      setSavingProfile(false);
    }
  };

  const changePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwMsg(null);
    if (pwNext.length < 8) return setPwMsg({ kind: 'err', text: 'New password must be at least 8 characters.' });
    if (pwNext !== pwConfirm) return setPwMsg({ kind: 'err', text: 'New passwords do not match.' });
    setSavingPw(true);
    try {
      // Reauth with current password first to fail fast on wrong password,
      // since Supabase's updateUser doesn't require old password on its own.
      const { createClient } = await import('@/lib/supabase/client');
      const sb = createClient();
      const { error: reauthErr } = await sb.auth.signInWithPassword({ email: user.email, password: pwCurrent });
      if (reauthErr) { setPwMsg({ kind: 'err', text: 'Current password is incorrect.' }); setSavingPw(false); return; }

      const { error } = await updatePassword(pwNext);
      if (error) { setPwMsg({ kind: 'err', text: error }); setSavingPw(false); return; }
      setPwMsg({ kind: 'ok', text: 'Password changed.' });
      setPwCurrent(''); setPwNext(''); setPwConfirm('');
    } finally {
      setSavingPw(false);
    }
  };

  const deleteAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setDelMsg(null);
    if (delConfirmText !== 'DELETE') {
      setDelMsg('Type DELETE in capital letters to confirm.');
      return;
    }
    setDeleting(true);
    try {
      const res = await fetch('/api/auth/delete-account', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: delPassword }),
      });
      const data = await res.json();
      if (!res.ok) {
        setDelMsg(data.error || 'Failed to delete account.');
        setDeleting(false);
        return;
      }
      router.push('/?deleted=1');
      router.refresh();
    } catch (err) {
      setDelMsg(err instanceof Error ? err.message : 'Unknown error');
      setDeleting(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32, maxWidth: 640 }}>
      <section style={card}>
        <h3 style={cardHead}>👤 Profile</h3>
        <p style={cardSub}>Update your name and contact number. Email cannot be changed here.</p>
        <form onSubmit={saveProfile} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <label style={lbl}>
            <span>Name</span>
            <input value={name} onChange={e => setName(e.target.value)} required style={inp} />
          </label>
          <label style={lbl}>
            <span>Email</span>
            <input value={user.email} disabled style={{ ...inp, background: '#f1f5f9', color: '#64748b' }} />
          </label>
          <label style={lbl}>
            <span>Phone</span>
            <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="e.g. 07123 456789" style={inp} />
          </label>
          {profileMsg && (
            <div style={profileMsg.kind === 'ok' ? msgOk : msgErr}>{profileMsg.text}</div>
          )}
          <button type="submit" disabled={savingProfile} style={btnPrimary}>
            {savingProfile ? 'Saving…' : 'Save Profile'}
          </button>
        </form>
      </section>

      <section style={card}>
        <h3 style={cardHead}>🔒 Change Password</h3>
        <p style={cardSub}>You&apos;ll need your current password to set a new one.</p>
        <form onSubmit={changePassword} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <label style={lbl}>
            <span>Current password</span>
            <input type="password" value={pwCurrent} onChange={e => setPwCurrent(e.target.value)} required autoComplete="current-password" style={inp} />
          </label>
          <label style={lbl}>
            <span>New password (at least 8 characters)</span>
            <input type="password" value={pwNext} onChange={e => setPwNext(e.target.value)} required minLength={8} autoComplete="new-password" style={inp} />
          </label>
          <label style={lbl}>
            <span>Confirm new password</span>
            <input type="password" value={pwConfirm} onChange={e => setPwConfirm(e.target.value)} required minLength={8} autoComplete="new-password" style={inp} />
          </label>
          {pwMsg && (
            <div style={pwMsg.kind === 'ok' ? msgOk : msgErr}>{pwMsg.text}</div>
          )}
          <button type="submit" disabled={savingPw} style={btnPrimary}>
            {savingPw ? 'Updating…' : 'Update Password'}
          </button>
        </form>
      </section>

      <section style={{ ...card, borderColor: '#fecaca', background: '#fef2f2' }}>
        <h3 style={{ ...cardHead, color: '#991b1b' }}>⚠️ Delete Account</h3>
        <p style={cardSub}>
          This permanently removes your account, your profile, and unlinks you from any orders or property listings.
          This cannot be undone.
        </p>
        {!showDelete ? (
          <button type="button" onClick={() => setShowDelete(true)} style={btnDanger}>
            Delete my account
          </button>
        ) : (
          <form onSubmit={deleteAccount} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <label style={lbl}>
              <span>Enter your password</span>
              <input type="password" value={delPassword} onChange={e => setDelPassword(e.target.value)} required style={inp} />
            </label>
            <label style={lbl}>
              <span>Type <strong style={{ color: '#991b1b' }}>DELETE</strong> to confirm</span>
              <input value={delConfirmText} onChange={e => setDelConfirmText(e.target.value)} required style={inp} />
            </label>
            {delMsg && <div style={msgErr}>{delMsg}</div>}
            <div style={{ display: 'flex', gap: 12 }}>
              <button type="button" onClick={() => setShowDelete(false)} style={btnGhost}>Cancel</button>
              <button type="submit" disabled={deleting} style={btnDanger}>
                {deleting ? 'Deleting…' : 'Delete Forever'}
              </button>
            </div>
          </form>
        )}
      </section>
    </div>
  );
}

const card: React.CSSProperties = {
  background: '#fff',
  border: '1px solid #e2e8f0',
  borderRadius: 12,
  padding: 24,
};
const cardHead: React.CSSProperties = { margin: '0 0 6px', fontSize: 20, fontWeight: 800, color: '#0f172a' };
const cardSub: React.CSSProperties = { margin: '0 0 18px', color: '#64748b', fontSize: 14, lineHeight: 1.5 };
const lbl: React.CSSProperties = { display: 'flex', flexDirection: 'column', gap: 6, fontSize: 13, fontWeight: 700, color: '#334155' };
const inp: React.CSSProperties = {
  padding: '11px 14px', borderRadius: 8, border: '2px solid #e2e8f0',
  fontSize: 14, fontFamily: 'inherit', outline: 'none', background: '#fff',
};
const btnPrimary: React.CSSProperties = {
  alignSelf: 'flex-start', padding: '11px 22px', background: '#e11d48', color: '#fff',
  border: 'none', borderRadius: 8, fontWeight: 800, fontSize: 14, cursor: 'pointer',
};
const btnDanger: React.CSSProperties = {
  padding: '11px 22px', background: '#991b1b', color: '#fff',
  border: 'none', borderRadius: 8, fontWeight: 800, fontSize: 14, cursor: 'pointer',
};
const btnGhost: React.CSSProperties = {
  padding: '11px 22px', background: '#fff', color: '#334155',
  border: '2px solid #e2e8f0', borderRadius: 8, fontWeight: 700, fontSize: 14, cursor: 'pointer',
};
const msgOk: React.CSSProperties = { background: '#dcfce7', border: '1px solid #86efac', color: '#166534', padding: '10px 14px', borderRadius: 8, fontSize: 13, fontWeight: 600 };
const msgErr: React.CSSProperties = { background: '#fee2e2', border: '1px solid #fca5a5', color: '#991b1b', padding: '10px 14px', borderRadius: 8, fontSize: 13, fontWeight: 600 };
