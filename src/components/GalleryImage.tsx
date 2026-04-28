import type { CSSProperties } from 'react';
import { useGallerySlot } from '../utils/useGallerySlot';

interface Props {
    slot: string;
    fallback: string;
    alt?: string;
    style?: CSSProperties;
    className?: string;
    /** background-image 모드(div + backgroundImage) */
    asBackground?: boolean;
    /** 갤러리/fallback 모두 없을 때 표시할 대체 텍스트(이름 등) */
    placeholderLabel?: string;
}

/**
 * 관리자 갤러리에서 슬롯 키로 이미지를 가져옵니다.
 * 슬롯에 등록된 이미지가 있으면 그것을, 없으면 fallback 정적 이미지를 사용합니다.
 */
const GalleryImage = ({ slot, fallback, alt = '', style, className, asBackground, placeholderLabel }: Props) => {
    const dynamic = useGallerySlot(slot);
    const src = dynamic?.dataUrl || fallback;

    if (asBackground) {
        return (
            <div
                role="img"
                aria-label={alt}
                className={className}
                style={{
                    ...style,
                    backgroundImage: `url(${src})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    display: placeholderLabel ? 'flex' : undefined,
                    alignItems: placeholderLabel ? 'center' : undefined,
                    justifyContent: placeholderLabel ? 'center' : undefined
                }}
            >
                {placeholderLabel && !dynamic && (
                    <span style={{
                        color: 'rgba(255,255,255,0.65)',
                        fontSize: '1.2rem',
                        fontWeight: 700,
                        letterSpacing: '0.02em',
                        textShadow: '0 1px 4px rgba(0,0,0,0.4)'
                    }}>
                        {placeholderLabel}
                    </span>
                )}
            </div>
        );
    }

    return <img src={src} alt={alt} style={style} className={className} />;
};

export default GalleryImage;
