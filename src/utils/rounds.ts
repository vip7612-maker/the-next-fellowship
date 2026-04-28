/**
 * 회차 경계: 각 회차는 endsBefore(YYYY-MM-DD) 자정 직전까지의 신청을 받는다.
 * 회차 행사일 다음날부터는 자동으로 다음 회차로 카운트 업.
 *
 * 새 회차가 추가될 때 이 배열에만 한 줄 추가하면, 신규 신청 INSERT(api/applicants.ts)와
 * 관리자 대시보드 탭이 자동으로 새 회차로 전환된다.
 */
export const ROUND_BOUNDARIES: { round: number; endsBefore: string; label?: string }[] = [
    { round: 1, endsBefore: '2026-04-06', label: '1회차 · Semiconductor X Marketing' },
    { round: 2, endsBefore: '2026-05-18', label: '2회차 · AI 융합' },
];

/** 다음 회차 번호 (마지막 경계 +1). */
export const NEXT_ROUND = ROUND_BOUNDARIES.length + 1;

/** 주어진 날짜(YYYY-MM-DD)에 해당하는 회차. */
export const roundForDate = (dateStr: string): number => {
    for (const b of ROUND_BOUNDARIES) {
        if (dateStr < b.endsBefore) return b.round;
    }
    return NEXT_ROUND;
};

/** 지금 시점의 진행 중 회차. */
export const currentRound = (): number => {
    const today = new Date().toISOString().split('T')[0];
    return roundForDate(today);
};
