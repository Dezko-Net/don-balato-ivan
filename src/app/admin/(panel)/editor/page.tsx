'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { getSectionConfigAsync, saveSectionConfigAsync, type SectionConfig, type SectionSettings } from '@/lib/section-config';
import { getServices, getAppwriteConfig } from '@/lib/appwrite';
import { Image as ImageIcon, Save, RefreshCw } from 'lucide-react';

const FF = '"DM Sans","Proxima Nova",-apple-system,BlinkMacSystemFont,sans-serif';

// Default images currently live on the site (from body-clean.html and HomePage.tsx)
const DEFAULT_HERO1_DESKTOP = 'https://firebasestorage.googleapis.com/v0/b/geminai-449212.firebasestorage.app/o/KEVINCOCO%2Fx.jpeg?alt=media&token=0ad04776-0001-40f0-a7c3-a811c5cce0e7';
const DEFAULT_HERO1_MOBILE = 'https://storage.googleapis.com/geminai-449212.firebasestorage.app/IADESIGN/2026/06/1781404655085-pegada-1781404653623.png?GoogleAccessId=imagen%40geminai-449212.iam.gserviceaccount.com&Expires=16730334000&Signature=AoMmXhZykJXHuRUbi6kN90211xsIcYZjusKCSZK4ebs2iyXidYeEJWJCvJyaynUTEUcC1VHJo%2FhCnE6cvrTGAGa9IhLOt6sOrpI%2Fr4XuRwVMVeNaanueVgoLg1yRj29zWHhEfXcZ5KbWtT2tJ%2FS6hlyU0z62ichXNvys%2FSn2%2FI%2Bj4OBgMN03lPZT7daOc8RzERbDU19piSeu0Zyy5wvTWWuIa4ySVI7IlmxcbzMQPd3KVX8x7ehOVU67U32C1msMyudocbczpbUFSZiShuu5FqDfCfn4Yrcztl%2Fv9f%2FSIf1PTwAWTc3SrWpsl7%2FZzdCY%2BD3i60ByaI%2Bn3Vwok3AE0Q%3D%3D';
const DEFAULT_HERO2_DESKTOP = 'https://storage.googleapis.com/asistoraerp.firebasestorage.app/IADESIGN/2026/06/1781758588825-pegada-1781758586654.png?GoogleAccessId=firebase-adminsdk-fbsvc%40asistoraerp.iam.gserviceaccount.com&Expires=16730334000&Signature=XuK0ff%2FaOBtzwSnfof24jryXdgHqvpnnFpt41fhV7HXSqq%2FsLtXBdxn1EeoICl6hOqGuAI8p2OEjm1v%2BItCsAfedWAJL9DdZAOgD9ax0YS7GUFnwGi%2Blugbq%2F52eS4Xf3M0PY9il9TikeU6BMNgqRoOVc5wsYcgUHLHI5bHkn3vMSaZty9kBmi%2BZlhXir7eM%2F5RGBD9yBJWDQsw19lA3qp8fEo5p8Wn%2FbrGMv9NXIELdqG2%2Bv0HvURo1zJsNcD%2B0TCsoLGVkuK7ojYLl6f8hB6yCLdAFH2LgICS%2B800QecmCHs3kJQeOG%2FlXlpvF9T11vamgc24ZptjcwlmmVzwyTw%3D%3D';
const DEFAULT_HERO2_MOBILE = 'https://storage.googleapis.com/asistoraerp.firebasestorage.app/IADESIGN/2026/06/1781758310444-pegada-1781758308350.png?GoogleAccessId=firebase-adminsdk-fbsvc%40asistoraerp.iam.gserviceaccount.com&Expires=16730334000&Signature=GjfIQEBUtw%2F4U6GjdNN4ECU4wcqITqFei2LBBSdASIQyNI%2FRs2M0%2BH%2Fd8OTLaGhjmG%2B6eWQfFTXBoCdmhkyo%2Fd1H9kvIeAlzmDkUY%2BPzS35yTsjelnVXlTvt77zKpsUQfYYR9u5eYIDN%2FfdSEFY98Wb5rlPJOFt2FXneYQqnqfyJA8OhSGnHYKmfxfymlsZakUv6GmiiZGewHQ%2FbTABTHHz4cSgI5rlEISwoPGnDzEsait9CHZoszRscjCeocczr34Vbnd15CJsxrDl%2BaDIijdHSC7JPvAdt14rW6kxp6q1QAbNfxxdUmeIawwAP4tPI2a7EAg8Vna5RIr171OqYtg%3D%3D';

export default function HeroBannerEditorPage() {
  const [sections, setSections] = useState<SectionConfig[]>([]);
  const [heroSection, setHeroSection] = useState<SectionConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedFlash, setSavedFlash] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    getSectionConfigAsync().then(cfg => {
      setSections(cfg);
      const hero = cfg.find(s => s.id === 'tpl1_hero') || null;
      setHeroSection(hero);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const updateSettings = useCallback((patch: Partial<SectionSettings>) => {
    setHeroSection(prev => {
      if (!prev) return prev;
      return { ...prev, settings: { ...prev.settings, ...patch } };
    });
    setHasChanges(true);
  }, []);

  const handleSave = async () => {
    if (!heroSection) return;
    setSaving(true);
    try {
      const updated = sections.map(s => s.id === 'tpl1_hero' ? heroSection : s);
      await saveSectionConfigAsync(updated);
      setSections(updated);
      setHasChanges(false);
      setSavedFlash(true);
      setTimeout(() => setSavedFlash(false), 2000);
    } catch (err) {
      alert('Error al guardar: ' + (err as any)?.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 400 }}>
        <RefreshCw size={24} className="animate-spin" style={{ color: '#6366f1' }} />
      </div>
    );
  }

  if (!heroSection) {
    return (
      <div style={{ padding: 40, textAlign: 'center', color: '#6b7280' }}>
        <p style={{ fontSize: 16, fontWeight: 700 }}>No se encontró la sección del Hero Banner.</p>
      </div>
    );
  }

  const s = heroSection.settings || {};

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '24px 20px', fontFamily: FF }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 900, color: '#111827', margin: 0 }}>Editor de Hero Banner</h1>
          <p style={{ fontSize: 13, color: '#9ca3af', margin: '4px 0 0' }}>Personaliza el banner principal de la página de inicio</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving || !hasChanges}
          style={{
            padding: '10px 20px', borderRadius: 12, border: 'none',
            background: savedFlash ? '#10b981' : (hasChanges ? '#5850ec' : '#e5e7eb'),
            color: savedFlash || hasChanges ? '#fff' : '#9ca3af',
            fontSize: 13, fontWeight: 800, cursor: hasChanges && !saving ? 'pointer' : 'not-allowed',
            display: 'flex', alignItems: 'center', gap: 8, fontFamily: FF,
            transition: 'all 0.2s',
          }}
        >
          {saving ? <><RefreshCw size={15} className="animate-spin" /> Guardando...</> : savedFlash ? <><Save size={15} /> Guardado ✓</> : <><Save size={15} /> Guardar cambios</>}
        </button>
      </div>

      {/* ── HERO BANNER 1 ── */}
      <SectionCard title="Hero Banner 1 — Imagen Principal" icon={<ImageIcon size={16} />}>
        <p style={{ fontSize: 12, color: '#6b7280', margin: '0 0 12px', lineHeight: 1.5 }}>
          Este es el banner principal que se muestra al entrar a la página de inicio. Las imágenes se muestran según el dispositivo del usuario.
        </p>

        {/* Current state preview */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 12, marginBottom: 12 }}>
          <CurrentImagePreview
            label="Desktop (actual)"
            url={s.tpl23Hero1DesktopImg || DEFAULT_HERO1_DESKTOP}
            variant="desktop"
          />
          <CurrentImagePreview
            label="Móvil (actual)"
            url={s.tpl23Hero1MobileImg || DEFAULT_HERO1_MOBILE}
            variant="mobile"
          />
        </div>

        <div style={{ height: 8 }} />
        <ImageUploadField label="Reemplazar imagen Desktop (1440×600 recomendado)" value={s.tpl23Hero1DesktopImg || ''} onChange={v => updateSettings({ tpl23Hero1DesktopImg: v })} />
        <ImageUploadField label="Reemplazar imagen Móvil (9×16 recomendado)" value={s.tpl23Hero1MobileImg || ''} onChange={v => updateSettings({ tpl23Hero1MobileImg: v })} />
        <div style={{ height: 10 }} />
        <TextField label="Texto del título (ej: Poderosamente Bella)" value={s.tpl23Hero1Title || ''} onChange={v => updateSettings({ tpl23Hero1Title: v })} placeholder="Poderosamente Bella" />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 8 }}>
          <TextField label="Texto del botón" value={s.tpl23Hero1BtnText || ''} onChange={v => updateSettings({ tpl23Hero1BtnText: v })} placeholder="Tienda" />
          <TextField label="Link del botón" value={s.tpl23Hero1BtnLink || ''} onChange={v => updateSettings({ tpl23Hero1BtnLink: v })} placeholder="/productos" />
        </div>
      </SectionCard>

      {/* ── HERO BANNER 2 (KENIA) ── */}
      <SectionCard title="Hero Banner 2 — Kenia (Slide automático)" icon={<ImageIcon size={16} />}>
        <p style={{ fontSize: 12, color: '#6b7280', margin: '0 0 12px', lineHeight: 1.5 }}>
          Este banner rota automáticamente con el Hero Banner 1 cada 5 segundos. Si dejas las imágenes vacías, se usarán las imágenes por defecto de Kenia.
        </p>

        {/* Current state preview */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 12, marginBottom: 12 }}>
          <CurrentImagePreview
            label="Desktop (actual)"
            url={s.tpl23Hero2DesktopImg || DEFAULT_HERO2_DESKTOP}
            variant="desktop"
          />
          <CurrentImagePreview
            label="Móvil (actual)"
            url={s.tpl23Hero2MobileImg || DEFAULT_HERO2_MOBILE}
            variant="mobile"
          />
        </div>

        <div style={{ height: 8 }} />
        <ImageUploadField label="Reemplazar imagen Desktop (Kenia)" value={s.tpl23Hero2DesktopImg || ''} onChange={v => updateSettings({ tpl23Hero2DesktopImg: v })} />
        <ImageUploadField label="Reemplazar imagen Móvil (Kenia)" value={s.tpl23Hero2MobileImg || ''} onChange={v => updateSettings({ tpl23Hero2MobileImg: v })} />
      </SectionCard>

      {/* ── PORTADA DEL CATÁLOGO ── */}
      <SectionCard title="Portada del Catálogo (/productos)" icon={<ImageIcon size={16} />}>
        <ImageUploadField label="Imagen de portada" value={s.catalogCoverImage || ''} onChange={v => updateSettings({ catalogCoverImage: v })} />
        <TextField label="Título" value={s.catalogCoverTitle || ''} onChange={v => updateSettings({ catalogCoverTitle: v })} placeholder="Productos" />
        <TextField label="Subtítulo" value={s.catalogCoverSubtitle || ''} onChange={v => updateSettings({ catalogCoverSubtitle: v })} placeholder="Descubrí nuestra selección" />
        <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 13, color: '#374151', marginTop: 10, marginBottom: 8 }}>
          <input type="checkbox" checked={s.catalogCoverOverlayEnabled !== false} onChange={e => updateSettings({ catalogCoverOverlayEnabled: e.target.checked })} style={{ width: 16, height: 16, accentColor: '#5850ec' }} />
          Overlay en portada
        </label>
        {s.catalogCoverOverlayEnabled !== false && (
          <>
            <RangeField label="Opacidad" value={s.catalogCoverOverlayOpacity ?? 40} onChange={v => updateSettings({ catalogCoverOverlayOpacity: v })} min={0} max={100} unit="%" />
            <ColorField label="Color overlay" value={s.catalogCoverOverlayColor || '#000000'} onChange={v => updateSettings({ catalogCoverOverlayColor: v })} />
          </>
        )}
      </SectionCard>

      {/* Bottom save button */}
      <div style={{ marginTop: 20, marginBottom: 40, display: 'flex', justifyContent: 'center' }}>
        <button
          onClick={handleSave}
          disabled={saving || !hasChanges}
          style={{
            padding: '12px 32px', borderRadius: 14, border: 'none',
            background: savedFlash ? '#10b981' : (hasChanges ? '#5850ec' : '#e5e7eb'),
            color: savedFlash || hasChanges ? '#fff' : '#9ca3af',
            fontSize: 14, fontWeight: 800, cursor: hasChanges && !saving ? 'pointer' : 'not-allowed',
            display: 'flex', alignItems: 'center', gap: 8, fontFamily: FF,
            boxShadow: hasChanges ? '0 6px 20px rgba(88,80,236,0.3)' : 'none',
            transition: 'all 0.2s',
          }}
        >
          {saving ? <><RefreshCw size={16} className="animate-spin" /> Guardando...</> : savedFlash ? <><Save size={16} /> ¡Guardado con éxito! ✓</> : <><Save size={16} /> Guardar todos los cambios</>}
        </button>
      </div>
    </div>
  );
}

/* ─── UI Components ─── */

function CurrentImagePreview({ label, url, variant }: { label: string; url: string; variant?: 'desktop' | 'mobile' }) {
  if (!url) return null;
  const shortUrl = url.length > 60 ? url.slice(0, 57) + '...' : url;
  const isMobile = variant === 'mobile';
  return (
    <div style={{ border: '1px solid #e5e7eb', borderRadius: 10, overflow: 'hidden', background: '#f9fafb' }}>
      <div style={{ padding: '8px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, borderBottom: '1px solid #f3f4f6' }}>
        <span style={{ fontSize: 11, fontWeight: 700, color: '#6b7280', flexShrink: 0 }}>{label}</span>
        <a href={url} target="_blank" rel="noopener" style={{ fontSize: 10, color: '#5850ec', textDecoration: 'none', fontFamily: 'monospace', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={url}>
          {shortUrl} ↗
        </a>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', padding: 12, background: '#f3f4f6' }}>
        {isMobile ? (
          <div style={{ position: 'relative', width: 120, height: 213, borderRadius: 8, overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
            <img src={url} alt={label} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
          </div>
        ) : (
          <div style={{ position: 'relative', width: '100%', maxWidth: 480, aspectRatio: '21 / 9', borderRadius: 8, overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
            <img src={url} alt={label} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
          </div>
        )}
      </div>
    </div>
  );
}

function SectionCard({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #f3f4f6', boxShadow: '0 1px 3px rgba(0,0,0,0.04)', marginBottom: 16, overflow: 'hidden' }}>
      <div style={{ padding: '14px 18px', borderBottom: '1px solid #f9fafb', display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ color: '#5850ec', display: 'flex' }}>{icon}</span>
        <h3 style={{ fontSize: 14, fontWeight: 800, color: '#111827', margin: 0, fontFamily: FF }}>{title}</h3>
      </div>
      <div style={{ padding: '16px 18px' }}>
        {children}
      </div>
    </div>
  );
}

function TextField({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <div style={{ marginBottom: 10 }}>
      <label style={{ fontSize: 11, fontWeight: 600, color: '#6b7280', display: 'block', marginBottom: 4 }}>{label}</label>
      <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        style={{ width: '100%', padding: '8px 12px', fontSize: 13, border: '1px solid #e5e7eb', borderRadius: 8, outline: 'none', fontFamily: FF, boxSizing: 'border-box' }}
        onFocus={e => e.target.style.borderColor = '#a78bfa'}
        onBlur={e => e.target.style.borderColor = '#e5e7eb'}
      />
    </div>
  );
}

function ColorField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label style={{ fontSize: 11, fontWeight: 600, color: '#6b7280', display: 'block', marginBottom: 4 }}>{label}</label>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <input type="color" value={value || '#000000'} onChange={e => onChange(e.target.value)}
          style={{ width: 40, height: 36, border: '1px solid #e5e7eb', borderRadius: 8, cursor: 'pointer', padding: 2, background: '#fff' }}
        />
        <input value={value} onChange={e => onChange(e.target.value)} placeholder="#000000"
          style={{ flex: 1, padding: '8px 12px', fontSize: 13, border: '1px solid #e5e7eb', borderRadius: 8, outline: 'none', fontFamily: 'monospace', boxSizing: 'border-box' }}
        />
      </div>
    </div>
  );
}

function RangeField({ label, value, onChange, min, max, step, unit }: { label: string; value: number; onChange: (v: number) => void; min: number; max: number; step?: number; unit: string }) {
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
        <label style={{ fontSize: 11, fontWeight: 600, color: '#6b7280' }}>{label}</label>
        <span style={{ fontSize: 11, fontWeight: 700, color: '#5850ec' }}>{value}{unit}</span>
      </div>
      <input type="range" value={value} onChange={e => onChange(Number(e.target.value))} min={min} max={max} step={step || 1}
        style={{ width: '100%', accentColor: '#5850ec', cursor: 'pointer' }}
      />
    </div>
  );
}

function ImageUploadField({ label, value, onChange }: { label: string; value: string; onChange: (url: string) => void }) {
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const { storage } = getServices();
      const { projectId, endpoint } = getAppwriteConfig();
      const { ID } = await import('appwrite');
      const res = await storage.createFile('67f41e05000d0adb6f12', ID.unique(), file);
      const url = `${endpoint}/storage/buckets/67f41e05000d0adb6f12/files/${res.$id}/view?project=${projectId}`;
      onChange(url);
    } catch (err) {
      alert('Error al subir imagen: ' + (err as any)?.message);
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  }

  return (
    <div style={{ marginBottom: 10 }}>
      <label style={{ fontSize: 11, fontWeight: 600, color: '#6b7280', display: 'flex', alignItems: 'center', gap: 4, marginBottom: 4 }}>
        <ImageIcon size={13} /> {label}
      </label>
      <div style={{ display: 'flex', gap: 6 }}>
        <input value={value} onChange={e => onChange(e.target.value)} placeholder="https://... o sube desde PC"
          style={{ flex: 1, padding: '8px 10px', fontSize: 12, border: '1px solid #e5e7eb', borderRadius: 8, outline: 'none', fontFamily: FF, boxSizing: 'border-box' }}
          onFocus={e => e.target.style.borderColor = '#a78bfa'}
          onBlur={e => e.target.style.borderColor = '#e5e7eb'}
        />
        <button onClick={() => inputRef.current?.click()} disabled={uploading}
          style={{ padding: '0 12px', fontSize: 11, background: '#5850ec', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', whiteSpace: 'nowrap', opacity: uploading ? 0.6 : 1, fontFamily: FF }}>
          {uploading ? 'Subiendo...' : '📁 PC'}
        </button>
        <input ref={inputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFile} />
      </div>
      {value && (
        <div style={{ marginTop: 6, position: 'relative', display: 'inline-block' }}>
          <img src={value} alt="" style={{ height: 50, width: 'auto', borderRadius: 6, border: '1px solid #e5e7eb', objectFit: 'contain' }} />
          <button onClick={() => onChange('')} style={{ position: 'absolute', top: -6, right: -6, width: 18, height: 18, background: '#ef4444', border: 'none', borderRadius: '50%', color: '#fff', fontSize: 10, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
        </div>
      )}
    </div>
  );
}
