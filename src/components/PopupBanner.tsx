'use client';

import { useState, useEffect } from 'react';

const STORAGE_KEY = 'kc_popup_closed';

export default function PopupBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 500);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      onClick={handleClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: 'rgba(0,0,0,0.55)',
        backdropFilter: 'blur(3px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        animation: 'popupFadeIn 0.3s ease-out',
      }}
    >
      <style>{`
        @keyframes popupFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes popupScaleIn {
          0% { transform: scale(0.7) translateY(20px); opacity: 0; }
          60% { transform: scale(1.03) translateY(0); opacity: 1; }
          100% { transform: scale(1) translateY(0); opacity: 1; }
        }
      `}</style>
      <div
        onClick={e => e.stopPropagation()}
        style={{
          position: 'relative',
          maxWidth: 640,
          width: '100%',
          animation: 'popupScaleIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)'
        }}
      >
        <button
          onClick={handleClose}
          aria-label="Cerrar"
          style={{
            position: 'absolute',
            top: -14,
            right: -14,
            zIndex: 2,
            width: 36,
            height: 36,
            borderRadius: '50%',
            border: 'none',
            background: '#fff',
            color: '#333',
            fontSize: 22,
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
            lineHeight: 1,
          }}
        >
          ×
        </button>
        <a href="/productos" style={{ display: 'block', textDecoration: 'none' }}>
          <img
            src="https://storage.googleapis.com/asistoraerp.firebasestorage.app/KEVIN%26COCO/1784392562755-pegada-1784392560461.png"
            alt="Información Importante"
            style={{
              width: '100%',
              height: 'auto',
              borderRadius: 16,
              display: 'block',
              boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
            }}
          />
        </a>
      </div>
    </div>
  );
}
