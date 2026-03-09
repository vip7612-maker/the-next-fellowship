import { useState } from 'react';

const AdminLogin = ({ onLogin }: { onLogin: () => void }) => {
    const [password, setPassword] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (password === 'admin1234') { // Mock password
            onLogin();
        } else {
            alert('비밀번호가 틀렸습니다.');
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
                    <button type="submit" className="login-btn">로그인</button>
                </form>
                <p style={{ marginTop: '20px', fontSize: '0.8rem', color: '#64748b', textAlign: 'center' }}>
                    * 테스트용 비밀번호: admin1234
                </p>
            </div>
        </div>
    );
};

export default AdminLogin;
