'use client';

import { useRef, useState } from 'react';
import { ID } from 'appwrite';
import {
  Camera, Loader2, X, Search, Check,
} from 'lucide-react';
import { getServices, getAppwriteConfig, MEDIA_BUCKET_ID } from '@/lib/appwrite';

interface Props {
  imageUrls: string[];
  onChange: (urls: string[]) => void;
  compact?: boolean;
}

export default function ProductPhotoUploader({ imageUrls, onChange, compact = false }: Props) {
  const [uploading, setUploading] = useState(false);
  const [searching, setSearching] = useState(false);
  const [similarImages, setSimilarImages] = useState<{ url: string; score?: number }[]>([]);
  const [bestGuess, setBestGuess] = useState<string[]>([]);
  const [showSimilar, setShowSimilar] = useState(false);
  const [selectedFromAI, setSelectedFromAI] = useState<string[]>([]);
  const [importing, setImporting] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const aiInputRef = useRef<HTMLInputElement>(null);
  const [aiRefUrl, setAiRefUrl] = useState<string | null>(null);
  const [brokenUrls, setBrokenUrls] = useState<Set<string>>(new Set());

  const uploadToAppwrite = async (file: File): Promise<string> => {
    const { storage } = getServices();
    const { endpoint, projectId } = getAppwriteConfig();
    const fileId = ID.unique();
    await storage.createFile(MEDIA_BUCKET_ID, fileId, file);
    return `${endpoint}/storage/buckets/${MEDIA_BUCKET_ID}/files/${fileId}/view?project=${projectId}`;
  };

  const handleFiles = async (files: FileList) => {
    const remaining = 3 - imageUrls.length;
    const toUpload = Array.from(files).slice(0, remaining);
    if (toUpload.length === 0) return;
    setUploading(true);
    try {
      const newUrls: string[] = [];
      for (const file of toUpload) {
        newUrls.push(await uploadToAppwrite(file));
      }
      onChange([...imageUrls, ...newUrls].slice(0, 3));
    } catch (e: any) {
      alert('Error al subir imagen: ' + e.message);
    } finally {
      setUploading(false);
    }
  };

  const removeAt = (idx: number) => {
    onChange(imageUrls.filter((_, i) => i !== idx));
  };

  const handleAiRefFile = async (files: FileList) => {
    const file = files[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadToAppwrite(file);
      setAiRefUrl(url);
      doSearch(url);
    } catch (e: any) {
      alert('Error al subir imagen: ' + e.message);
    } finally {
      setUploading(false);
    }
  };

  const doSearch = async (refUrl: string) => {
    setSearching(true);
    setShowSimilar(true);
    setSimilarImages([]);
    setBestGuess([]);
    setSelectedFromAI([]);
    setBrokenUrls(new Set());
    try {
      const res = await fetch('/api/vision-similar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageUrl: refUrl }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setSimilarImages(data.images || []);
      setBestGuess(data.bestGuess || []);
    } catch (e: any) {
      alert('Error al buscar: ' + e.message);
      setShowSimilar(false);
    } finally {
      setSearching(false);
    }
  };

  const toggleSelectAI = (url: string) => {
    setSelectedFromAI(prev => {
      if (prev.includes(url)) return prev.filter(u => u !== url);
      if (prev.length >= 3) return prev;
      return [...prev, url];
    });
  };

  const confirmAISelection = async () => {
    if (selectedFromAI.length === 0) {
      setShowSimilar(false);
      return;
    }
    setImporting(true);
    try {
      const newUrls: string[] = [];
      for (const url of selectedFromAI) {
        const res = await fetch(`/api/vision-similar?url=${encodeURIComponent(url)}`);
        if (!res.ok) continue;
        const blob = await res.blob();
        const file = new File([blob], `ai-${Date.now()}-${Math.random()}.jpg`, { type: blob.type || 'image/jpeg' });
        newUrls.push(await uploadToAppwrite(file));
      }
      if (newUrls.length === 0) {
        alert('No se pudieron importar las imágenes');
        return;
      }
      if (aiRefUrl && newUrls.length >= 3) {
        onChange(newUrls.slice(0, 3));
      } else if (aiRefUrl) {
        const combined = [aiRefUrl, ...newUrls].slice(0, 3);
        onChange(combined);
      } else {
        onChange(newUrls.slice(0, 3));
      }
      setShowSimilar(false);
      setAiRefUrl(null);
      setSelectedFromAI([]);
    } catch (e: any) {
      alert('Error al importar: ' + e.message);
    } finally {
      setImporting(false);
    }
  };

  const btnHeight = compact ? 'h-28' : 'h-36';

  return (
    <div className="space-y-3">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={e => { if (e.target.files?.length) handleFiles(e.target.files); e.target.value = ''; }}
      />
      <input
        ref={aiInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={e => { if (e.target.files?.length) handleAiRefFile(e.target.files); e.target.value = ''; }}
      />

      {imageUrls.length > 0 && (
        <div className="grid grid-cols-3 gap-2">
          {imageUrls.map((url, i) => (
            <div key={i} className="relative aspect-square rounded-xl overflow-hidden border border-gray-200">
              <img src={url} alt={`Foto ${i + 1}`} className="absolute inset-0 w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => removeAt(i)}
                className="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/60 text-white flex items-center justify-center active:scale-90 transition"
              >
                <X className="w-3.5 h-3.5" />
              </button>
              <span className="absolute bottom-1 left-1 text-[9px] font-semibold bg-black/55 text-white px-1.5 py-0.5 rounded-full">
                {i + 1}
              </span>
            </div>
          ))}
        </div>
      )}

      {imageUrls.length < 3 && (
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className={`${btnHeight} rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 flex flex-col items-center justify-center gap-1.5 transition active:scale-[0.98] hover:border-gray-400 disabled:opacity-50`}
          >
            {uploading ? (
              <>
                <Loader2 className="w-7 h-7 text-gray-400 animate-spin" />
                <span className="text-[11px] text-gray-500 font-medium">Subiendo...</span>
              </>
            ) : (
              <>
                <Camera className="w-7 h-7 text-gray-400" />
                <span className="text-xs font-semibold text-gray-600">Añadir fotos</span>
                <span className="text-[10px] text-gray-400">Manual, máx 3</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => aiInputRef.current?.click()}
            disabled={uploading || searching}
            className={`${btnHeight} rounded-2xl border-2 border-dashed border-indigo-300 bg-indigo-50/50 flex flex-col items-center justify-center gap-1.5 transition active:scale-[0.98] hover:border-indigo-400 disabled:opacity-50`}
          >
            {searching ? (
              <>
                <Loader2 className="w-7 h-7 text-indigo-400 animate-spin" />
                <span className="text-[11px] text-indigo-500 font-medium">Buscando...</span>
              </>
            ) : (
              <>
                <Search className="w-7 h-7 text-indigo-400" />
                <span className="text-xs font-semibold text-indigo-600">Buscar con IA</span>
                <span className="text-[10px] text-indigo-400">1 ref → 20 opciones</span>
              </>
            )}
          </button>
        </div>
      )}

      {showSimilar && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end" onClick={() => !importing && setShowSimilar(false)}>
          <div className="absolute inset-0 bg-black/40" />
          <div
            className="relative bg-white rounded-t-3xl max-h-[80vh] overflow-y-auto p-4 space-y-3"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between sticky top-0 bg-white pb-2 border-b border-gray-100 z-10">
              <div>
                <p className="text-sm font-bold text-gray-900">Fotos similares ({similarImages.length})</p>
                {bestGuess.length > 0 && (
                  <p className="text-[11px] text-gray-500">Google: {bestGuess.join(' · ')}</p>
                )}
              </div>
              <button onClick={() => !importing && setShowSimilar(false)} className="p-2 rounded-full hover:bg-gray-100">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {aiRefUrl && (
              <div className="flex items-center gap-2 bg-indigo-50 rounded-xl p-2">
                <img src={aiRefUrl} alt="Referencia" className="w-12 h-12 rounded-lg object-cover" />
                <div className="flex-1">
                  <p className="text-[11px] font-semibold text-indigo-700">Foto de referencia</p>
                  <p className="text-[10px] text-indigo-400">Se mantiene si eliges 1-2 · Se reemplaza si eliges 3</p>
                </div>
              </div>
            )}

            {searching ? (
              <div className="flex flex-col items-center justify-center py-12 gap-2">
                <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
                <span className="text-sm text-gray-500">Buscando en Google...</span>
              </div>
            ) : similarImages.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 gap-2">
                <Search className="w-8 h-8 text-gray-300" />
                <span className="text-sm text-gray-400">No se encontraron imágenes similares</span>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-3 gap-2">
                  {similarImages.filter(img => !brokenUrls.has(img.url)).map((img, i) => {
                    const isSelected = selectedFromAI.includes(img.url);
                    const selectedIdx = selectedFromAI.indexOf(img.url);
                    return (
                      <button
                        key={i}
                        type="button"
                        onClick={() => toggleSelectAI(img.url)}
                        disabled={importing}
                        className={`relative aspect-square rounded-xl overflow-hidden border-2 transition active:scale-95 disabled:opacity-50 ${
                          isSelected ? 'border-indigo-600 ring-2 ring-indigo-300' : 'border-transparent'
                        }`}
                      >
                        <img
                          src={`/api/vision-similar?url=${encodeURIComponent(img.url)}`}
                          alt={`Similar ${i + 1}`}
                          className="absolute inset-0 w-full h-full object-cover"
                          loading="lazy"
                          onError={() => setBrokenUrls(prev => new Set(prev).add(img.url))}
                        />
                        {isSelected && (
                          <div className="absolute top-1 right-1 w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-lg">
                            <span className="text-[10px] font-bold">{selectedIdx + 1}</span>
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>

                <div className="sticky bottom-0 bg-white pt-3 border-t border-gray-100">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-gray-700">
                      {selectedFromAI.length === 0
                        ? 'Toca para seleccionar (máx 3)'
                        : `${selectedFromAI.length} seleccionada${selectedFromAI.length > 1 ? 's' : ''}`}
                    </span>
                    {selectedFromAI.length > 0 && (
                      <button
                        type="button"
                        onClick={() => setSelectedFromAI([])}
                        className="text-[11px] text-gray-500 font-medium"
                      >
                        Limpiar
                      </button>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={confirmAISelection}
                    disabled={selectedFromAI.length === 0 || importing}
                    className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-indigo-600 text-white text-sm font-bold shadow-lg active:scale-[0.98] transition disabled:opacity-50"
                  >
                    {importing ? (
                      <><Loader2 className="w-4 h-4 animate-spin" /> Importando...</>
                    ) : (
                      <><Check className="w-4 h-4" /> Importar {selectedFromAI.length} foto{selectedFromAI.length > 1 ? 's' : ''}</>
                    )}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
