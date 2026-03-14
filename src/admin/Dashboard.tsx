import { useState, useEffect } from 'react';
import { getApplicants } from './mockData';
import type { Applicant } from './mockData';

interface GroupedApplicant extends Applicant {
    applyCount: number;
}

const Dashboard = () => {
    const [applicants, setApplicants] = useState<Applicant[]>([]);

    useEffect(() => {
        setApplicants(getApplicants());
    }, []);

    // Deduplicate by name+phone
    const groupedMap = applicants.reduce((acc, app) => {
        const key = `${app.name}_${app.phone}`;
        if (!acc[key]) {
            acc[key] = { ...app, applyCount: 1 };
        } else {
            acc[key].applyCount += 1;
        }
        return acc;
    }, {} as Record<string, GroupedApplicant>);
    const unique = Object.values(groupedMap);

    // ===== 1. School Stats =====
    const schoolMap: Record<string, number> = {};
    unique.forEach(app => {
        const school = app.school?.trim() || '미기재';
        schoolMap[school] = (schoolMap[school] || 0) + 1;
    });
    const schoolSorted = Object.entries(schoolMap).sort((a, b) => b[1] - a[1]);
    const maxSchool = Math.max(...Object.values(schoolMap), 1);

    // ===== 2. Gender Stats (inferred from name patterns) =====
    // Note: Korean names ending in certain characters can hint at gender, but it's unreliable.
    // We'll use school name patterns: 여자고등학교 = female, else = male
    let maleCount = 0;
    let femaleCount = 0;
    unique.forEach(app => {
        if (app.school.includes('여자') || app.school.includes('여고')) {
            femaleCount++;
        } else {
            maleCount++;
        }
    });

    // ===== 3. Career Path Stats =====
    const careerMap: Record<string, number> = {};
    unique.forEach(app => {
        // Extract the career keyword before the first " - " or "/"
        let career = app.careerReason || '미기재';
        // Try to extract just the career name
        const dashIdx = career.indexOf(' - ');
        if (dashIdx > 0) {
            career = career.substring(0, dashIdx).trim();
        }
        // Normalize common keywords
        if (career.length > 15) {
            // Try splitting by common separators
            const parts = career.split(/[-–,/]/);
            career = parts[0].trim();
        }
        careerMap[career] = (careerMap[career] || 0) + 1;
    });
    const careerSorted = Object.entries(careerMap).sort((a, b) => b[1] - a[1]);
    const maxCareer = Math.max(...Object.values(careerMap), 1);

    // Color palette for pie chart
    const pieColors = ['#3b82f6', '#ef4444', '#22c55e', '#f59e0b', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316', '#6366f1', '#06b6d4'];

    const total = unique.length;
    const femalePercent = total > 0 ? ((femaleCount / total) * 100).toFixed(1) : '0';
    const malePercent = total > 0 ? ((maleCount / total) * 100).toFixed(1) : '0';

    return (
        <div className="dashboard-page">
            <h2 style={{ marginBottom: '30px', color: '#0f172a', fontSize: '1.6rem' }}>📊 대시보드</h2>

            {/* Summary Cards */}
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
                        <div className="dash-summary-number">{careerSorted.length}</div>
                        <div className="dash-summary-label">관심 진로 수</div>
                    </div>
                </div>
            </div>

            <div className="dashboard-grid">
                {/* School Breakdown */}
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

                {/* Gender Breakdown */}
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

                {/* Career Path Breakdown */}
                <div className="admin-card dashboard-card dashboard-card-full">
                    <h4 className="dash-card-title">🎯 관심 진로별 구성</h4>
                    <div className="career-grid">
                        {careerSorted.map(([career, count], idx) => (
                            <div className="career-item" key={career}>
                                <div className="career-item-header">
                                    <span className="career-dot" style={{ background: pieColors[idx % pieColors.length] }}></span>
                                    <span className="career-name">{career}</span>
                                    <span className="career-count">{count}명</span>
                                </div>
                                <div className="career-bar-track">
                                    <div
                                        className="career-bar-fill"
                                        style={{
                                            width: `${(count / maxCareer) * 100}%`,
                                            background: pieColors[idx % pieColors.length]
                                        }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
