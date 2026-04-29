import { useEffect, useMemo, useRef, useState } from 'react';
import type { ChangeEvent, DragEvent, FormEvent } from 'react';
import {
    fetchGalleryList,
    fetchGalleryItem,
    uploadGalleryImage,
    deleteGalleryImage,
    updateGalleryImage,
    type GalleryListItem
} from '../utils/apiClient';
import './Admin.css';

// 미리 정의된 슬롯 키 — 페이지에서 사용하는 위치
const SLOT_PRESETS: { value: string; label: string; usage: string }[] = [
    { value: 'episode_card_consulting', label: '메인 · 컨설팅 카드 사진', usage: '"지난 회차" 컨설팅 카드 하단 이미지' },
    { value: 'episode_card_mentor', label: '메인 · 멘토 카드 사진', usage: '"지난 회차" 멘토 카드 하단 이미지' },
    { value: 'expert_kim_daesik', label: '메인 · 강사(김대식 교수) 프로필', usage: '전문가 카드 원형 프로필' },
    { value: 'expert_lee_kyungjin', label: '2회차 · 전문가 강사(이경진 사무국장) 프로필', usage: 'Episode2 상세 페이지 전문가 카드' },
    { value: 'consultant_lee_sangyeon', label: '메인 · 컨설턴트(이상연 소장) 프로필', usage: 'Pipeline STEP 01 컨설턴트 카드' },
    { value: 'episode1_photo_1', label: '1회차 갤러리 사진 1', usage: '메인 4장 그리드 + 1회차 상세 페이지' },
    { value: 'episode1_photo_2', label: '1회차 갤러리 사진 2', usage: '메인 4장 그리드 + 1회차 상세 페이지' },
    { value: 'episode1_photo_3', label: '1회차 갤러리 사진 3', usage: '메인 4장 그리드 + 1회차 상세 페이지' },
    { value: 'episode1_photo_4', label: '1회차 갤러리 사진 4', usage: '메인 4장 그리드 + 1회차 상세 페이지' },
];

const MAX_DIMENSION = 1200;
const JPEG_QUALITY = 0.85;

// 클라이언트 측 리사이즈 + JPEG 압축 → base64 data URL
const resizeImageFile = (file: File): Promise<{ dataUrl: string; mimeType: string; width: number; height: number; sizeBytes: number }> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onerror = () => reject(new Error('파일 읽기 실패'));
        reader.onload = () => {
            const img = new Image();
            img.onerror = () => reject(new Error('이미지 디코딩 실패'));
            img.onload = () => {
                let { width, height } = img;
                const ratio = Math.min(1, MAX_DIMENSION / Math.max(width, height));
                width = Math.round(width * ratio);
                height = Math.round(height * ratio);

                const canvas = document.createElement('canvas');
                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                if (!ctx) return reject(new Error('Canvas 미지원'));
                ctx.drawImage(img, 0, 0, width, height);
                // PNG 투명 보존 필요한 경우 png로, 그 외 jpeg로 압축
                const useJpeg = file.type !== 'image/png';
                const mimeType = useJpeg ? 'image/jpeg' : 'image/png';
                const dataUrl = canvas.toDataURL(mimeType, useJpeg ? JPEG_QUALITY : undefined);
                const sizeBytes = Math.round((dataUrl.length - dataUrl.indexOf(',') - 1) * 0.75);
                resolve({ dataUrl, mimeType, width, height, sizeBytes });
            };
            img.src = reader.result as string;
        };
        reader.readAsDataURL(file);
    });
};

const formatBytes = (bytes: number | null): string => {
    if (!bytes) return '-';
    if (bytes < 1024) return `${bytes}B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)}KB`;
    return `${(bytes / 1024 / 1024).toFixed(2)}MB`;
};

const GalleryAdmin = () => {
    const [items, setItems] = useState<GalleryListItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // 업로드 폼 상태
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [pickedFile, setPickedFile] = useState<{ dataUrl: string; mimeType: string; width: number; height: number; sizeBytes: number } | null>(null);
    const [pickedFileName, setPickedFileName] = useState<string>('');
    const [pickError, setPickError] = useState<string | null>(null);
    const [uploadForm, setUploadForm] = useState({
        slot: '',
        slotCustom: '',
        title: '',
        description: ''
    });
    const [uploading, setUploading] = useState(false);
    const [isDragOver, setIsDragOver] = useState(false);

    // 썸네일 + 미리보기 캐시
    const [thumbCache, setThumbCache] = useState<Record<string, string>>({});
    const [thumbLoading, setThumbLoading] = useState<Record<string, boolean>>({});
    const [previewItemId, setPreviewItemId] = useState<string | null>(null);
    const [previewDataUrl, setPreviewDataUrl] = useState<string | null>(null);

    const load = async () => {
        setLoading(true);
        setError(null);
        try {
            const list = await fetchGalleryList();
            setItems(list);
        } catch (err) {
            setError(err instanceof Error ? err.message : '데이터 로드 실패');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        load();
    }, []);

    // 새로 추가된 이미지의 썸네일을 비동기로 일괄 로드
    useEffect(() => {
        const toLoad = items.filter((it) => !thumbCache[it.id] && !thumbLoading[it.id]);
        if (toLoad.length === 0) return;

        // 동시에 너무 많이 호출하지 않도록 4개씩 슬라이스
        const batch = toLoad.slice(0, 4);
        setThumbLoading((prev) => {
            const next = { ...prev };
            batch.forEach((it) => { next[it.id] = true; });
            return next;
        });
        batch.forEach(async (it) => {
            try {
                const full = await fetchGalleryItem(it.id);
                setThumbCache((prev) => ({ ...prev, [it.id]: full.dataUrl }));
            } catch {
                // 실패 시 placeholder 유지
            } finally {
                setThumbLoading((prev) => {
                    const next = { ...prev };
                    delete next[it.id];
                    return next;
                });
            }
        });
    }, [items, thumbCache, thumbLoading]);

    const processFile = async (file: File) => {
        setPickError(null);
        if (!file.type.startsWith('image/')) {
            setPickError('이미지 파일만 업로드할 수 있습니다.');
            return;
        }
        try {
            const result = await resizeImageFile(file);
            setPickedFile(result);
            setPickedFileName(file.name);
            if (!uploadForm.title) {
                setUploadForm((prev) => ({ ...prev, title: file.name.replace(/\.[^/.]+$/, '') }));
            }
        } catch (err) {
            setPickError(err instanceof Error ? err.message : '이미지 처리 실패');
        }
    };

    const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        await processFile(file);
    };

    const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        if (!isDragOver) setIsDragOver(true);
    };

    const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragOver(false);
    };

    const handleDrop = async (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragOver(false);
        const file = e.dataTransfer.files?.[0];
        if (!file) return;
        await processFile(file);
    };

    const handleDropzoneClick = () => {
        fileInputRef.current?.click();
    };

    const handleDropzoneKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            fileInputRef.current?.click();
        }
    };

    const clearPickedFile = () => {
        setPickedFile(null);
        setPickedFileName('');
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleUpload = async (e: FormEvent) => {
        e.preventDefault();
        if (!pickedFile) {
            alert('이미지 파일을 먼저 선택해주세요.');
            return;
        }
        if (!uploadForm.title.trim()) {
            alert('제목을 입력해주세요.');
            return;
        }
        const slot = uploadForm.slot === '__custom__'
            ? uploadForm.slotCustom.trim()
            : uploadForm.slot.trim();

        setUploading(true);
        try {
            await uploadGalleryImage({
                slot: slot || undefined,
                title: uploadForm.title.trim(),
                description: uploadForm.description.trim(),
                dataUrl: pickedFile.dataUrl,
                mimeType: pickedFile.mimeType,
                sizeBytes: pickedFile.sizeBytes,
                width: pickedFile.width,
                height: pickedFile.height
            });
            clearPickedFile();
            setUploadForm({ slot: '', slotCustom: '', title: '', description: '' });
            await load();
        } catch (err) {
            alert(err instanceof Error ? err.message : '업로드 실패');
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (item: GalleryListItem) => {
        if (!confirm(`"${item.title}" 이미지를 삭제하시겠습니까?`)) return;
        try {
            await deleteGalleryImage(item.id);
            await load();
        } catch (err) {
            alert(err instanceof Error ? err.message : '삭제 실패');
        }
    };

    const handleToggleActive = async (item: GalleryListItem) => {
        try {
            await updateGalleryImage(item.id, { isActive: Number(item.isActive) !== 1 });
            await load();
        } catch (err) {
            alert(err instanceof Error ? err.message : '상태 변경 실패');
        }
    };

    const handleUpdateSlot = async (item: GalleryListItem, newSlot: string) => {
        try {
            await updateGalleryImage(item.id, { slot: newSlot || null });
            await load();
        } catch (err) {
            alert(err instanceof Error ? err.message : '슬롯 변경 실패');
        }
    };

    const openPreview = async (id: string) => {
        setPreviewItemId(id);
        setPreviewDataUrl(null);
        try {
            const full = await fetchGalleryItem(id);
            setPreviewDataUrl(full.dataUrl);
        } catch (err) {
            alert(err instanceof Error ? err.message : '미리보기 로드 실패');
            setPreviewItemId(null);
        }
    };

    // 슬롯 → 점유 이미지 ID (활성 여부와 무관하게 점유로 간주)
    const slotOwnerMap = useMemo(() => {
        const map: Record<string, string> = {};
        items.forEach((it) => {
            if (it.slot) {
                // 같은 슬롯이 여러 행에 있으면 가장 최근 것이 owner
                if (!map[it.slot]) map[it.slot] = it.id;
            }
        });
        return map;
    }, [items]);

    const slotsInUse = useMemo(() => new Set(Object.keys(slotOwnerMap)), [slotOwnerMap]);

    return (
        <div className="admin-content">
            <div className="admin-header">
                <h2 className="admin-title">갤러리 관리</h2>
                <button className="export-btn" onClick={load}>새로고침</button>
            </div>

            {/* 업로드 카드 */}
            <div className="admin-card" style={{ marginBottom: 24 }}>
                <h3 style={{ marginTop: 0, marginBottom: 16 }}>＋ 새 이미지 업로드</h3>
                <form onSubmit={handleUpload} style={{ display: 'grid', gap: 14 }}>
                    <div>
                        <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>이미지 파일 *</label>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            style={{ display: 'none' }}
                        />

                        {pickedFile ? (
                            <div
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                                onDrop={handleDrop}
                                style={{
                                    border: `2px ${isDragOver ? 'solid' : 'dashed'} ${isDragOver ? '#2b5b3a' : 'var(--admin-border)'}`,
                                    background: isDragOver ? '#eaf1ec' : '#fafbfc',
                                    borderRadius: 12,
                                    padding: 16,
                                    display: 'flex',
                                    gap: 16,
                                    alignItems: 'center',
                                    transition: 'all 0.15s ease'
                                }}
                            >
                                <img
                                    src={pickedFile.dataUrl}
                                    alt="미리보기"
                                    style={{ width: 110, height: 110, objectFit: 'cover', borderRadius: 8, border: '1px solid var(--admin-border)', flexShrink: 0 }}
                                />
                                <div style={{ flex: 1, minWidth: 0, fontSize: 13, color: '#555' }}>
                                    <div style={{ fontWeight: 600, color: '#1a1a1a', marginBottom: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                        {pickedFileName || '선택한 이미지'}
                                    </div>
                                    <div style={{ fontSize: 12, color: '#666' }}>
                                        {pickedFile.width}×{pickedFile.height} · {formatBytes(pickedFile.sizeBytes)} · {pickedFile.mimeType}
                                    </div>
                                    <div style={{ fontSize: 11, color: '#888', marginTop: 4 }}>
                                        다른 파일을 드래그하여 교체하거나, 아래 버튼으로 변경할 수 있습니다.
                                    </div>
                                    <div style={{ marginTop: 10, display: 'flex', gap: 8 }}>
                                        <button type="button" className="export-btn" onClick={handleDropzoneClick} style={{ fontSize: 12, padding: '6px 12px' }}>
                                            파일 변경
                                        </button>
                                        <button type="button" className="export-btn" onClick={clearPickedFile} style={{ fontSize: 12, padding: '6px 12px', background: '#fdecec', color: '#8a2727' }}>
                                            제거
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div
                                role="button"
                                tabIndex={0}
                                onClick={handleDropzoneClick}
                                onKeyDown={handleDropzoneKeyDown}
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                                onDrop={handleDrop}
                                style={{
                                    border: `2px dashed ${isDragOver ? '#2b5b3a' : 'var(--admin-border)'}`,
                                    background: isDragOver ? '#eaf1ec' : '#fafbfc',
                                    borderRadius: 12,
                                    padding: '36px 20px',
                                    textAlign: 'center',
                                    cursor: 'pointer',
                                    transition: 'all 0.15s ease',
                                    outline: 'none'
                                }}
                            >
                                <div style={{ fontSize: 40, marginBottom: 8, opacity: isDragOver ? 1 : 0.6 }}>
                                    {isDragOver ? '⤵️' : '📤'}
                                </div>
                                <div style={{ fontSize: 15, fontWeight: 600, color: isDragOver ? '#2b5b3a' : '#1a1a1a', marginBottom: 4 }}>
                                    {isDragOver ? '여기에 놓아주세요' : '이미지를 끌어다 놓거나 클릭해서 선택'}
                                </div>
                                <div style={{ fontSize: 12, color: '#888' }}>
                                    JPG / PNG / WebP · 큰 이미지는 자동으로 1200px로 리사이즈됩니다
                                </div>
                            </div>
                        )}

                        {pickError && <div style={{ color: '#b14a3a', fontSize: 12, marginTop: 8 }}>{pickError}</div>}
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                        <div>
                            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>슬롯 (사용 위치)</label>
                            <select
                                value={uploadForm.slot}
                                onChange={(e) => setUploadForm({ ...uploadForm, slot: e.target.value })}
                                style={inputStyle}
                            >
                                <option value="">(슬롯 없음 — 자료실 전용)</option>
                                {SLOT_PRESETS.map((s) => {
                                    const taken = slotsInUse.has(s.value);
                                    return (
                                        <option key={s.value} value={s.value} disabled={taken}>
                                            {s.label}{taken ? ' · 사용 중 (선택 불가)' : ''}
                                        </option>
                                    );
                                })}
                                <option value="__custom__">＋ 직접 입력</option>
                            </select>
                            {uploadForm.slot === '__custom__' && (
                                <input
                                    type="text"
                                    placeholder="custom_slot_key"
                                    value={uploadForm.slotCustom}
                                    onChange={(e) => setUploadForm({ ...uploadForm, slotCustom: e.target.value })}
                                    style={{ ...inputStyle, marginTop: 8 }}
                                />
                            )}
                            {uploadForm.slot && uploadForm.slot !== '__custom__' && (
                                <div style={{ fontSize: 11, color: '#666', marginTop: 6 }}>
                                    {SLOT_PRESETS.find((s) => s.value === uploadForm.slot)?.usage}
                                </div>
                            )}
                            {uploadForm.slot && uploadForm.slot !== '__custom__' && slotsInUse.has(uploadForm.slot) && (
                                <div style={{ fontSize: 11, color: '#b14a3a', marginTop: 6 }}>
                                    ⚠ 이 슬롯은 이미 사용 중입니다. 다른 슬롯을 고르거나, 기존 이미지를 먼저 삭제/슬롯 해제 후 업로드해 주세요.
                                </div>
                            )}
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>제목 *</label>
                            <input
                                type="text"
                                value={uploadForm.title}
                                onChange={(e) => setUploadForm({ ...uploadForm, title: e.target.value })}
                                style={inputStyle}
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>설명 (선택)</label>
                        <input
                            type="text"
                            value={uploadForm.description}
                            onChange={(e) => setUploadForm({ ...uploadForm, description: e.target.value })}
                            style={inputStyle}
                        />
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={uploading || !pickedFile}
                            className="export-btn"
                            style={{ background: '#2b5b3a', color: '#fff', padding: '10px 20px' }}
                        >
                            {uploading ? '업로드 중…' : '업로드'}
                        </button>
                    </div>
                </form>
            </div>

            {/* 갤러리 그리드 */}
            <div className="admin-card">
                <h3 style={{ marginTop: 0, marginBottom: 16 }}>등록된 이미지 ({items.length}개)</h3>
                {loading ? (
                    <div className="loading-state">불러오는 중…</div>
                ) : error ? (
                    <div className="error-state">{error}</div>
                ) : items.length === 0 ? (
                    <div className="empty-state" style={{ padding: 30, textAlign: 'center' }}>아직 등록된 이미지가 없습니다.</div>
                ) : (
                    <div
                        style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
                            gridAutoRows: '1fr',
                            gap: 18,
                            alignItems: 'stretch'
                        }}
                    >
                        {items.map((item) => {
                            const thumb = thumbCache[item.id];
                            const isThumbLoading = thumbLoading[item.id];
                            const isActive = Number(item.isActive) === 1;
                            const slotLabel = SLOT_PRESETS.find((s) => s.value === item.slot)?.label
                                || (item.slot ? `${item.slot} (커스텀)` : null);

                            return (
                                <div
                                    key={item.id}
                                    style={{
                                        border: '1px solid var(--admin-border)',
                                        borderRadius: 12,
                                        overflow: 'hidden',
                                        background: '#fff',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        height: '100%',
                                        opacity: isActive ? 1 : 0.55,
                                        transition: 'transform 0.15s ease, box-shadow 0.15s ease'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.transform = 'translateY(-2px)';
                                        e.currentTarget.style.boxShadow = '0 8px 22px -10px rgba(0,0,0,0.25)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.transform = '';
                                        e.currentTarget.style.boxShadow = '';
                                    }}
                                >
                                    {/* 썸네일 (고정 높이) */}
                                    <button
                                        type="button"
                                        onClick={() => openPreview(item.id)}
                                        title="클릭해서 큰 이미지 보기"
                                        style={{
                                            position: 'relative',
                                            width: '100%',
                                            height: 180,
                                            flexShrink: 0,
                                            background: '#f1f5f9',
                                            border: 'none',
                                            cursor: 'pointer',
                                            padding: 0,
                                            display: 'block',
                                            overflow: 'hidden'
                                        }}
                                    >
                                        {thumb ? (
                                            <img
                                                src={thumb}
                                                alt={item.title}
                                                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                                            />
                                        ) : (
                                            <div style={{
                                                width: '100%', height: '100%',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                color: '#94a3b8', fontSize: 13
                                            }}>
                                                {isThumbLoading ? '로딩 중…' : '미리보기 준비 중…'}
                                            </div>
                                        )}

                                        {/* 활성/비활성 배지 */}
                                        <span style={{
                                            position: 'absolute',
                                            top: 8,
                                            left: 8,
                                            fontSize: 11,
                                            fontWeight: 700,
                                            padding: '3px 8px',
                                            borderRadius: 999,
                                            background: isActive ? 'rgba(43, 91, 58, 0.92)' : 'rgba(138, 39, 39, 0.85)',
                                            color: '#fff',
                                            letterSpacing: '0.04em'
                                        }}>
                                            {isActive ? '활성' : '비활성'}
                                        </span>

                                        {/* 슬롯 배지 */}
                                        {slotLabel && (
                                            <span style={{
                                                position: 'absolute',
                                                top: 8,
                                                right: 8,
                                                fontSize: 10,
                                                fontWeight: 600,
                                                padding: '3px 8px',
                                                borderRadius: 6,
                                                background: 'rgba(255, 255, 255, 0.92)',
                                                color: '#2b5b3a',
                                                maxWidth: '70%',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap'
                                            }}>
                                                🔗 {slotLabel}
                                            </span>
                                        )}
                                    </button>

                                    {/* 본문 (고정 구조) */}
                                    <div style={{ padding: 12, display: 'flex', flexDirection: 'column', gap: 8, flex: 1, minWidth: 0 }}>
                                        <div style={{ minWidth: 0 }}>
                                            <div style={{ fontSize: 14, fontWeight: 700, color: '#1a1a1a', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={item.title}>
                                                {item.title}
                                            </div>
                                            <div style={{ fontSize: 12, color: '#666', marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', minHeight: '1.2em' }} title={item.description || ''}>
                                                {item.description || ' '}
                                            </div>
                                            <div style={{ fontSize: 11, color: '#888', marginTop: 4 }}>
                                                {item.width && item.height ? `${item.width}×${item.height} · ` : ''}{formatBytes(item.sizeBytes)}
                                            </div>
                                        </div>

                                        {/* 슬롯 변경 — 다른 이미지가 점유한 슬롯은 비활성 */}
                                        <select
                                            value={item.slot || ''}
                                            onChange={(e) => handleUpdateSlot(item, e.target.value)}
                                            style={{ ...inputStyle, padding: '6px 8px', fontSize: 12 }}
                                            title="슬롯 변경"
                                        >
                                            <option value="">슬롯: (없음)</option>
                                            {SLOT_PRESETS.map((s) => {
                                                const owner = slotOwnerMap[s.value];
                                                const takenByOther = !!owner && owner !== item.id;
                                                return (
                                                    <option key={s.value} value={s.value} disabled={takenByOther}>
                                                        {s.label}{takenByOther ? ' · 사용 중' : ''}
                                                    </option>
                                                );
                                            })}
                                            {item.slot && !SLOT_PRESETS.some((s) => s.value === item.slot) && (
                                                <option value={item.slot}>{item.slot} (커스텀)</option>
                                            )}
                                        </select>

                                        {/* 액션 */}
                                        <div style={{ display: 'flex', gap: 6, marginTop: 'auto' }}>
                                            <button
                                                onClick={() => handleToggleActive(item)}
                                                className="export-btn"
                                                style={{
                                                    flex: 1,
                                                    fontSize: 12,
                                                    padding: '6px 8px',
                                                    background: isActive ? '#eaf1ec' : '#fdecec',
                                                    color: isActive ? '#2b5b3a' : '#8a2727'
                                                }}
                                            >
                                                {isActive ? '⏸ 비활성' : '▶ 활성'}
                                            </button>
                                            <button
                                                onClick={() => handleDelete(item)}
                                                className="export-btn"
                                                style={{ flex: 1, fontSize: 12, padding: '6px 8px', background: '#fdecec', color: '#8a2727' }}
                                            >
                                                🗑 삭제
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* 미리보기 모달 */}
            {previewItemId && (
                <div
                    onClick={() => { setPreviewItemId(null); setPreviewDataUrl(null); }}
                    style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 20 }}
                >
                    <div onClick={(e) => e.stopPropagation()} style={{ background: '#fff', borderRadius: 10, padding: 16, maxWidth: '90vw', maxHeight: '90vh', display: 'flex', flexDirection: 'column' }}>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 8 }}>
                            <button className="export-btn" onClick={() => { setPreviewItemId(null); setPreviewDataUrl(null); }}>닫기</button>
                        </div>
                        {previewDataUrl ? (
                            <img src={previewDataUrl} alt="미리보기" style={{ maxWidth: '85vw', maxHeight: '75vh', objectFit: 'contain', borderRadius: 6 }} />
                        ) : (
                            <div style={{ padding: 60, color: '#666' }}>로딩 중…</div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

const inputStyle: React.CSSProperties = {
    border: '1px solid var(--admin-border)',
    borderRadius: 8,
    padding: '10px 12px',
    fontSize: 14,
    fontFamily: 'inherit',
    color: 'var(--admin-text)',
    background: '#fff',
    width: '100%'
};

export default GalleryAdmin;
