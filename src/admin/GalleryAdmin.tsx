import { mockGallery } from './mockData';

const GalleryAdmin = () => {
    return (
        <div className="admin-card">
            <div className="admin-header">
                <h3>갤러리 콘텐츠 관리 ({mockGallery.length}개)</h3>
                <button className="login-btn" style={{ width: 'auto', padding: '8px 16px' }}>+ 새 콘텐츠 업로드</button>
            </div>

            <table className="admin-table">
                <thead>
                    <tr>
                        <th>콘텐츠 제목</th>
                        <th>타입</th>
                        <th>등록일</th>
                        <th>상태</th>
                        <th>관리</th>
                    </tr>
                </thead>
                <tbody>
                    {mockGallery.map(item => (
                        <tr key={item.id}>
                            <td style={{ fontWeight: '600' }}>{item.title}</td>
                            <td><span className="field-tag-small" style={{ background: item.type === '유튜브' ? '#fee2e2' : '#f1f5f9', color: item.type === '유튜브' ? '#ef4444' : '#475569' }}>{item.type}</span></td>
                            <td style={{ fontSize: '0.85rem' }}>{item.date}</td>
                            <td>
                                <span className={`badge ${item.status === '게시됨' ? 'Selected' : 'Waitlist'}`}>
                                    {item.status}
                                </span>
                            </td>
                            <td>
                                <select
                                    defaultValue={item.status}
                                    style={{ padding: '4px', borderRadius: '4px', marginRight: '5px' }}
                                >
                                    <option value="게시됨">게시됨</option>
                                    <option value="비공개">비공개</option>
                                </select>
                                <button style={{ padding: '4px 8px', border: '1px solid #fee2e2', color: '#ef4444', borderRadius: '4px', background: 'white', cursor: 'pointer' }}>삭제</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default GalleryAdmin;
