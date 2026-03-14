/**
 * 전화번호를 010-XXXX-XXXX 형식으로 포맷합니다.
 * - "1089401421" → "010-8940-1421"
 * - "010-8940-1421" → "010-8940-1421" (이미 포맷된 경우 유지)
 * - "01089401421" → "010-8940-1421"
 */
export function formatPhone(phone: string | number | undefined | null): string {
  if (!phone) return '';
  
  // 숫자만 추출
  const digits = String(phone).replace(/\D/g, '');
  
  // 10자리 (앞의 0이 빠진 경우): 1089401421 → 01089401421
  let normalized = digits;
  if (normalized.length === 10 && !normalized.startsWith('0')) {
    normalized = '0' + normalized;
  }
  
  // 11자리 (010XXXXXXXX)
  if (normalized.length === 11 && normalized.startsWith('010')) {
    return `${normalized.slice(0, 3)}-${normalized.slice(3, 7)}-${normalized.slice(7)}`;
  }
  
  // 12자리 이상 (오타로 자릿수 초과한 경우, ex: "10448226858")
  if (normalized.length >= 10) {
    if (!normalized.startsWith('0')) {
      normalized = '0' + normalized;
    }
    if (normalized.length === 11) {
      return `${normalized.slice(0, 3)}-${normalized.slice(3, 7)}-${normalized.slice(7)}`;
    }
    // 그 외 길이는 최대한 포맷
    return `${normalized.slice(0, 3)}-${normalized.slice(3, normalized.length - 4)}-${normalized.slice(-4)}`;
  }
  
  // 포맷할 수 없는 경우 원본 반환
  return String(phone);
}

/**
 * 입력 중 자동으로 하이픈을 삽입합니다.
 * 사용법: onChange={e => setPhone(autoFormatPhone(e.target.value))}
 */
export function autoFormatPhone(value: string): string {
  const digits = value.replace(/\D/g, '');
  
  if (digits.length <= 3) {
    return digits;
  }
  if (digits.length <= 7) {
    return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  }
  return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7, 11)}`;
}
