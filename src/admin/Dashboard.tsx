import { useState, useEffect, useMemo } from 'react';
import { fetchApplicants } from '../utils/apiClient';
import type { Applicant } from '../utils/apiClient';

interface GroupedApplicant extends Applicant {
    applyCount: number;
}

// ===== 진로 키워드 추출 함수 =====
// 긴 careerReason에서 핵심 진로 키워드만 추출
const extractCareerKeyword = (raw: string): string => {
    if (!raw || raw.trim() === '') return '미기재';

    // " - " 앞부분만 추출
    const dashIdx = raw.indexOf(' - ');
    let keyword = dashIdx > 0 ? raw.substring(0, dashIdx).trim() : raw.trim();

    // "~을 희망함" 같은 패턴 처리
    if (keyword.includes('희망')) {
        const parts = keyword.split(/을\s*희망|를\s*희망/);
        if (parts[0]) keyword = parts[0].trim();
    }

    // 너무 긴 경우 (15자 초과) 첫 구분자 기준으로 자르기
    if (keyword.length > 15) {
        const parts = keyword.split(/[,/·]/);
        keyword = parts[0].trim();
    }

    // 아직도 길면 15자로 자르기
    if (keyword.length > 18) {
        keyword = keyword.substring(0, 18) + '…';
    }

    return keyword;
};

// ===== 분야별 분류 =====
type FieldCategory = '공학계열' | '의학·보건' | '인문·사회' | '교육계열' | '미디어·예술' | '자연과학' | '군사·안보' | '기타';

const categoryColors: Record<FieldCategory, string> = {
    '공학계열': '#3b82f6',
    '의학·보건': '#ef4444',
    '인문·사회': '#8b5cf6',
    '교육계열': '#22c55e',
    '미디어·예술': '#f59e0b',
    '자연과학': '#06b6d4',
    '군사·안보': '#64748b',
    '기타': '#94a3b8'
};

const categoryIcons: Record<FieldCategory, string> = {
    '공학계열': '⚙️',
    '의학·보건': '🏥',
    '인문·사회': '📚',
    '교육계열': '🎓',
    '미디어·예술': '🎬',
    '자연과학': '🔬',
    '군사·안보': '🛡️',
    '기타': '📋'
};

const classifyCareer = (careerReason: string): FieldCategory => {
    const text = careerReason.toLowerCase();

    // 공학계열
    if (/반도체|신소재|전기|전자|ai|인공지능|컴퓨터|공학|건축|항공|우주|게임.*개발|it|로봇/.test(text)) return '공학계열';

    // 의학·보건
    if (/의사|의대|간호|수의|보건|내과|약학|치의|한의/.test(text)) return '의학·보건';

    // 교육계열
    if (/교사|교육|교대|사범/.test(text)) return '교육계열';

    // 미디어·예술
    if (/방송|pd|미디어|커뮤니케이션|광고|기획|공연|영상|편집|연출|예체능/.test(text)) return '미디어·예술';

    // 인문·사회
    if (/경제|경영|외교|심리|사회|정치|행정|법|경찰|사학|역사|인문|일어|일문|문학|마케팅/.test(text)) return '인문·사회';

    // 자연과학
    if (/생명|생물|화학|식품|과학|이과|수학/.test(text)) return '자연과학';

    // 군사·안보
    if (/군|사관|조종사|공군|비행/.test(text)) return '군사·안보';

    return '기타';
};

const Dashboard = () => {
    const [applicants, setApplicants] = useState<Applicant[]>([]);
    const [loadError, setLoadError] = useState('');
    const [activeRound, setActiveRound] = useState<number | null>(null);

    const load = async () => {
        setLoadError('');
        try {
            const data = await fetchApplicants();
            setApplicants(data);
        } catch (error) {
            console.error('대시보드 데이터 로드 실패:', error);
            setLoadError('데이터를 불러오지 못했습니다. 새로고침 해주세요.');
        }
    };

    useEffect(() => { load(); }, []);

    // 사용 가능한 회차 목록 + 최신 회차(당회차) 계산
    const { availableRounds, latestRound } = useMemo(() => {
        const roundSet = new Set<number>();
        applicants.forEach(a => roundSet.add(a.round ?? 1));
        const list = Array.from(roundSet).sort((a, b) => a - b);
        return {
            availableRounds: list.length > 0 ? list : [2],
            latestRound: list.length > 0 ? Math.max(...list) : 2,
        };
    }, [applicants]);

    // 데이터 로드 후 당회차를 기본 선택
    useEffect(() => {
        if (activeRound === null && applicants.length > 0) {
            setActiveRound(latestRound);
        }
    }, [applicants, latestRound, activeRound]);

    const currentRound = activeRound ?? latestRound;

    // 당회차 필터링 + 이름+연락처 기준 중복 제거
    const unique = useMemo(() => {
        const roundFiltered = applicants.filter(a => (a.round ?? 1) === currentRound);
        const map = roundFiltered.reduce((acc, app) => {
            const key = `${app.name}_${app.phone}`;
            if (!acc[key]) {
                acc[key] = { ...app, applyCount: 1 };
            } else {
                acc[key].applyCount += 1;
            }
            return acc;
        }, {} as Record<string, GroupedApplicant>);
        return Object.values(map);
    }, [applicants, currentRound]);

    const total = unique.length;

    // ===== 1. 학교별 통계 =====
    const { schoolSorted, maxSchool } = useMemo(() => {
        const schoolMap: Record<string, number> = {};
        unique.forEach(app => {
            const school = app.school?.trim() || '미기재';
            schoolMap[school] = (schoolMap[school] || 0) + 1;
        });
        return {
            schoolSorted: Object.entries(schoolMap).sort((a, b) => b[1] - a[1]),
            maxSchool: Math.max(...Object.values(schoolMap), 1)
        };
    }, [unique]);

    // ===== 2. 남녀 통계 (학교명 기준) =====
    const { maleCount, femaleCount, malePercent, femalePercent } = useMemo(() => {
        let male = 0;
        let female = 0;
        unique.forEach(app => {
            if (app.school.includes('여자') || app.school.includes('여고')) female++;
            else male++;
        });
        return {
            maleCount: male,
            femaleCount: female,
            malePercent: total > 0 ? ((male / total) * 100).toFixed(1) : '0',
            femalePercent: total > 0 ? ((female / total) * 100).toFixed(1) : '0'
        };
    }, [unique, total]);

    // ===== 3. 분야별 진로 통계 =====
    const { categorySorted, maxCategory } = useMemo(() => {
        const categoryMap: Record<FieldCategory, { count: number; careers: Record<string, number> }> = {
            '공학계열': { count: 0, careers: {} },
            '의학·보건': { count: 0, careers: {} },
            '인문·사회': { count: 0, careers: {} },
            '교육계열': { count: 0, careers: {} },
            '미디어·예술': { count: 0, careers: {} },
            '자연과학': { count: 0, careers: {} },
            '군사·안보': { count: 0, careers: {} },
            '기타': { count: 0, careers: {} }
        };
        unique.forEach(app => {
            const category = classifyCareer(app.careerReason);
            const keyword = extractCareerKeyword(app.careerReason);
            categoryMap[category].count += 1;
            categoryMap[category].careers[keyword] = (categoryMap[category].careers[keyword] || 0) + 1;
        });
        const sorted = (Object.entries(categoryMap) as [FieldCategory, typeof categoryMap[FieldCategory]][])
            .filter(([, data]) => data.count > 0)
            .sort((a, b) => b[1].count - a[1].count);
        return { categorySorted: sorted, maxCategory: Math.max(...sorted.map(([, d]) => d.count), 1) };
    }, [unique]);

    return (
        <div className="dashboard-page">
            <h2 style={{ marginBottom: '20px', color: '#0f172a', fontSize: '1.5rem', fontWeight: 800 }}>
                📊 대시보드
            </h2>
            {loadError && (
                <div style={{ padding: '12px 16px', marginBottom: '16px', background: '#fee2e2', border: '1px solid #fca5a5', borderRadius: '8px', color: '#dc2626', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>⚠️ {loadError}</span>
                    <button onClick={load} style={{ background: 'none', border: '1px solid #dc2626', borderRadius: '4px', color: '#dc2626', padding: '4px 10px', cursor: 'pointer', fontSize: '0.85rem' }}>다시 시도</button>
                </div>
            )}

            {/* 회차 탭 (기본: 당회차) */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
                {availableRounds.map(r => {
                    const count = applicants.filter(a => (a.round ?? 1) === r).length;
                    const isCurrent = r === latestRound;
                    return (
                        <button
                            key={r}
                            onClick={() => setActiveRound(r)}
                            style={{
                                padding: '10px 28px',
                                borderRadius: '8px',
                                border: currentRound === r ? 'none' : '1px solid var(--admin-border)',
                                background: currentRound === r ? '#3b82f6' : 'white',
                                color: currentRound === r ? 'white' : '#64748b',
                                fontWeight: currentRound === r ? 700 : 400,
                                fontSize: '1rem',
                                cursor: 'pointer',
                                transition: 'all 0.15s',
                            }}
                        >
                            {r}회차{isCurrent && ' (당회차)'}
                            <span style={{ marginLeft: '8px', fontSize: '0.8rem', opacity: 0.8 }}>
                                ({count}명)
                            </span>
                        </button>
                    );
                })}
            </div>

            {/* 요약 카드 */}
            <div className="dashboard-summary">
                <div className="dash-summary-card">
                    <div className="dash-summary-icon" style={{ background: '#eff6ff', color: '#3b82f6' }}>👥</div>
                    <div>
                        <div className="dash-summary-number">{total}</div>
                        <div className="dash-summary-label">총 신청자</div>
                    </div>
                </div>
                <div className="dash-summary-card">
                    <div className="dash-summary-icon" style={{ background: '#fef2f2', color: '#ef4444' }}>🏫</div>
                    <div>
                        <div className="dash-summary-number">{schoolSorted.length}</div>
                        <div className="dash-summary-label">참여 학교</div>
                    </div>
                </div>
                <div className="dash-summary-card">
                    <div className="dash-summary-icon" style={{ background: '#f0fdf4', color: '#22c55e' }}>🎯</div>
                    <div>
                        <div className="dash-summary-number">{categorySorted.length}</div>
                        <div className="dash-summary-label">관심 분야</div>
                    </div>
                </div>
            </div>

            <div className="dashboard-grid">
                {/* 학교별 구성 */}
                <div className="admin-card dashboard-card">
                    <h4 className="dash-card-title">🏫 학교별 구성</h4>
                    <div className="dash-bar-list">
                        {schoolSorted.map(([school, count]) => (
                            <div className="dash-bar-row" key={school}>
                                <span className="dash-bar-label">{school}</span>
                                <div className="dash-bar-track">
                                    <div
                                        className="dash-bar-fill"
                                        style={{
                                            width: `${(count / maxSchool) * 100}%`,
                                            background: 'linear-gradient(90deg, #3b82f6, #6366f1)'
                                        }}
                                    />
                                </div>
                                <span className="dash-bar-count">{count}명</span>
                                <span className="dash-bar-percent">{((count / total) * 100).toFixed(0)}%</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 남녀 구성 */}
                <div className="admin-card dashboard-card">
                    <h4 className="dash-card-title">👫 남녀 구성</h4>
                    <div className="gender-chart">
                        <div className="gender-visual">
                            <div className="gender-donut">
                                <svg viewBox="0 0 36 36" className="donut-svg">
                                    <circle
                                        cx="18" cy="18" r="15.9155"
                                        fill="none"
                                        stroke="#3b82f6"
                                        strokeWidth="3.5"
                                        strokeDasharray={`${Number(malePercent)} ${100 - Number(malePercent)}`}
                                        strokeDashoffset="25"
                                    />
                                    <circle
                                        cx="18" cy="18" r="15.9155"
                                        fill="none"
                                        stroke="#ec4899"
                                        strokeWidth="3.5"
                                        strokeDasharray={`${Number(femalePercent)} ${100 - Number(femalePercent)}`}
                                        strokeDashoffset={`${25 - Number(malePercent)}`}
                                    />
                                </svg>
                                <div className="donut-center">
                                    <div className="donut-total">{total}</div>
                                    <div className="donut-label">총원</div>
                                </div>
                            </div>
                        </div>
                        <div className="gender-legend">
                            <div className="gender-item">
                                <div className="gender-color" style={{ background: '#3b82f6' }}></div>
                                <div className="gender-info">
                                    <div className="gender-name">남학생</div>
                                    <div className="gender-stats">{maleCount}명 ({malePercent}%)</div>
                                </div>
                            </div>
                            <div className="gender-item">
                                <div className="gender-color" style={{ background: '#ec4899' }}></div>
                                <div className="gender-info">
                                    <div className="gender-name">여학생</div>
                                    <div className="gender-stats">{femaleCount}명 ({femalePercent}%)</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 분야별 진로 통계 */}
                <div className="admin-card dashboard-card dashboard-card-full">
                    <h4 className="dash-card-title">🎯 관심 분야별 구성</h4>
                    <div className="field-category-list">
                        {categorySorted.map(([category, data]) => {
                            const color = categoryColors[category];
                            const icon = categoryIcons[category];
                            const careersSorted = Object.entries(data.careers).sort((a, b) => b[1] - a[1]);
                            return (
                                <div className="field-category-item" key={category}>
                                    <div className="field-category-header">
                                        <div className="field-category-left">
                                            <span className="field-category-icon">{icon}</span>
                                            <span className="field-category-name">{category}</span>
                                        </div>
                                        <div className="field-category-right">
                                            <span className="field-category-count" style={{ color }}>{data.count}명</span>
                                            <span className="field-category-pct">{((data.count / total) * 100).toFixed(0)}%</span>
                                        </div>
                                    </div>
                                    <div className="field-category-bar-track">
                                        <div
                                            className="field-category-bar-fill"
                                            style={{ width: `${(data.count / maxCategory) * 100}%`, background: color }}
                                        />
                                    </div>
                                    <div className="field-category-careers">
                                        {careersSorted.map(([career, cnt]) => (
                                            <span className="field-career-tag" key={career} style={{ borderColor: color, color }}>
                                                {career} {cnt > 1 ? `×${cnt}` : ''}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
