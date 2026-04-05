import React, { useState } from 'react';
import type { Applicant } from '../utils/apiClient';
import { sendSms } from '../utils/apiClient';

interface SmsModalProps {
    applicants: Applicant[];
    onClose: () => void;
}

export const SmsModal: React.FC<SmsModalProps> = ({ applicants, onClose }) => {
    const [message, setMessage] = useState('');
    const [isSending, setIsSending] = useState(false);
    const [resultMsg, setResultMsg] = useState('');

    const targetCount = applicants.length;

    // 바이트 수 계산 (간단하게 영문/숫자/기호는 1바이트, 한글 및 기타는 2바이트)
    const getByteLength = (str: string) => {
        let b = 0;
        for (let i = 0; i < str.length; i++) {
            const charCode = str.charCodeAt(i);
            if (charCode <= 0x00007F) {
                b += 1;
            } else {
                b += 2;
            }
        }
        return b;
    };

    const byteLen = getByteLength(message);
    const isLms = byteLen > 90;

    const handleSend = async () => {
        if (!message.trim()) {
            alert('메시지 내용을 입력해주세요.');
            return;
        }

        if (targetCount === 0) {
            alert('발송 대상이 없습니다.');
            return;
        }

        if (!confirm(`총 ${targetCount}명에게 문자를 발송하시겠습니까?\n(${isLms ? 'LMS 장문문자' : 'SMS 단문문자'})`)) {
            return;
        }

        setIsSending(true);
        setResultMsg('');

        try {
            // 여러 사람에게 보낼 메시지 배열 생성
            // Solapi SDK requires 'to' (수신번호 010... 포맷) and 'text'
            const messages = applicants.map(app => ({
                to: app.phone.replace(/[^0-9]/g, ''), // 숫자만 남기기
                text: message.replace(/{이름}/g, app.name), // 치환 기능
            })).filter(m => m.to.length >= 10); // 유효한 번호만

            if (messages.length === 0) {
                throw new Error('유효한 수신 번호가 없습니다.');
            }

            const response = await sendSms(messages);
            setResultMsg(`성공적으로 ${response.count}건이 발송되었습니다!`);
            setTimeout(() => {
                onClose();
            }, 2000);
        } catch (error: any) {
            console.error(error);
            setResultMsg(`발송 실패: ${error.message}`);
        } finally {
            setIsSending(false);
        }
    };

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050,
            display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px'
        }} onClick={onClose}>
            <div style={{
                background: 'white', padding: '30px', borderRadius: '12px',
                maxWidth: '500px', width: '100%', boxShadow: '0 10px 25px rgba(0,0,0,0.2)'
            }} onClick={e => e.stopPropagation()}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid #e2e8f0', paddingBottom: '15px' }}>
                    <h3 style={{ margin: 0, fontSize: '1.4rem', color: '#0f172a' }}>단체 문자(SMS) 발송</h3>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#64748b' }}>&times;</button>
                </div>

                <div style={{ marginBottom: '20px' }}>
                    <div style={{ marginBottom: '8px', fontWeight: 'bold', color: '#334155' }}>발송 대상</div>
                    <div style={{ padding: '10px', background: '#f8fafc', borderRadius: '6px', fontSize: '0.95rem', color: '#0f172a' }}>
                        현재 필터링된 인원: <strong>{targetCount}명</strong>
                    </div>
                </div>

                <div style={{ marginBottom: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <span style={{ fontWeight: 'bold', color: '#334155' }}>메시지 내용</span>
                        <span style={{ fontSize: '0.85rem', color: isLms ? '#ef4444' : '#3b82f6', fontWeight: 'bold' }}>
                            {byteLen} Byte ({isLms ? 'LMS' : 'SMS'})
                        </span>
                    </div>
                    <textarea
                        value={message}
                        onChange={e => setMessage(e.target.value)}
                        placeholder="{이름}을 입력하면 수신자의 식별된 이름으로 자동 치환됩니다.\n예: {이름}님, 면접 안내드립니다."
                        style={{
                            width: '100%', height: '150px', padding: '12px', borderRadius: '6px',
                            border: '1px solid #cbd5e1', resize: 'none', fontSize: '0.95rem',
                            fontFamily: 'inherit'
                        }}
                    />
                    <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '5px' }}>
                        * 90바이트 초과 시 자동으로 장문(LMS)문자로 전환되어 요금이 추가 부과됩니다.
                    </div>
                </div>

                {resultMsg && (
                    <div style={{ marginBottom: '20px', padding: '10px', borderRadius: '6px', background: resultMsg.includes('실패') ? '#fee2e2' : '#dcfce7', color: resultMsg.includes('실패') ? '#b91c1c' : '#15803d', fontSize: '0.9rem', fontWeight: 'bold' }}>
                        {resultMsg}
                    </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                    <button onClick={onClose} disabled={isSending} style={{ padding: '10px 20px', borderRadius: '6px', border: '1px solid #cbd5e1', background: 'white', cursor: 'pointer', color: '#334155', fontWeight: '500' }}>
                        취소
                    </button>
                    <button onClick={handleSend} disabled={isSending || targetCount === 0} style={{ padding: '10px 20px', borderRadius: '6px', border: 'none', background: '#3b82f6', color: 'white', cursor: isSending || targetCount === 0 ? 'not-allowed' : 'pointer', fontWeight: 'bold', opacity: isSending || targetCount === 0 ? 0.7 : 1 }}>
                        {isSending ? '발송 중...' : '발송하기'}
                    </button>
                </div>
            </div>
        </div>
    );
};
