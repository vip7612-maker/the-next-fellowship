import { useState } from 'react';
import { setAdminToken } from '../utils/apiClient';

const AdminLogin = ({ onLogin }: { onLogin: () => void }) => {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const res = await fetch('/api/auth', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password })
            });
            if (!res.ok) {
                setError('비밀번호가 틀렸습니다.');
                return;
            }
            const { token } = await res.json();
            setAdminToken(token);
            onLogin();
        } catch {
            setError('로그인 중 오류가 발생했습니다.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="admin-login-wrap">
            <div className="login-card">
                <h2>Admin Login</h2>
                <form onSubmit={handleSubmit}>
                    <input
                        type="password"
                        placeholder="관리자 비밀번호"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    {error && <p style={{ color: '#ff6b6b', margin: '8px 0 0', fontSize: '0.9rem' }}>{error}</p>}
                    <button type="submit" className="login-btn" disabled={loading}>
                        {loading ? '로그인 중...' : '로그인'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AdminLogin;
