'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Eye, EyeOff, AlertCircle, Loader2, ArrowLeft, Mail, Lock, ArrowRight } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { motion, AnimatePresence } from 'framer-motion';
import { getSectionConfigAsync, type SectionConfig } from '@/lib/section-config';

function LoginInner() {
  const router = useRouter();
  const params = useSearchParams();
  const { login, register, isLoggedIn, isLoading } = useAuth();

  const [tab, setTab] = useState<'login' | 'register'>(
    params.get('tab') === 'register' ? 'register' : 'login'
  );
  const [showPass, setShowPass] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const { user } = useAuth();
  const [storeName, setStoreName] = useState<string>('Don Balato Iván');
  const FALLBACK_LOGO = 'https://storage.googleapis.com/asistoraerp.firebasestorage.app/IADESIGN/2026/07/1784931333115-pegada-1784931318404.png';
  const logoUrl = FALLBACK_LOGO;

  // Cargar nombre de la tienda del theme editor
  useEffect(() => {
    getSectionConfigAsync().then(cfg => {
      const heroSec = cfg.find((s: SectionConfig) => s.id === 'tpl1_hero');
      if (heroSec?.settings) {
        const hs = heroSec.settings as Record<string, any>;
        if (hs.heroStoreName) setStoreName(hs.heroStoreName);
      }
      const footerSec = cfg.find((s: SectionConfig) => s.id === 'tpl1_footer');
      if (footerSec?.settings) {
        const fs = footerSec.settings as Record<string, any>;
        if (fs.companyName && storeName === 'Don Balato Iván') setStoreName(fs.companyName);
      }
    }).catch(() => {});
  }, []);

  const emailParam = params.get('email') || '';
  const [loginForm, setLoginForm] = useState({ email: emailParam, password: '' });
  const [regForm, setRegForm] = useState({ email: '', password: '', confirm: '' });

  const redirectTo = (() => {
    const r = params.get('redirect');
    return r && r.startsWith('/') ? r : '/cuenta';
  })();

  useEffect(() => {
    if (!isLoading && isLoggedIn) router.replace(redirectTo);
  }, [isLoggedIn, isLoading, router, redirectTo]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!loginForm.email || !loginForm.password) { setError('Completá todos los campos'); return; }
    setSubmitting(true); setError('');
    const res = await login(loginForm.email, loginForm.password);
    setSubmitting(false);
    if (res.success) router.replace(redirectTo);
    else setError(res.error || 'Error al iniciar sesión');
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    if (!regForm.email || !regForm.password) { setError('Ingresá tu correo y contraseña'); return; }
    if (regForm.password !== regForm.confirm) { setError('Las contraseñas no coinciden'); return; }
    if (regForm.password.length < 8) { setError('La contraseña debe tener al menos 8 caracteres'); return; }
    setSubmitting(true); setError('');
    // Solo pedimos correo + contraseña. El nombre y demás datos (RUT, teléfono,
    // dirección) se piden y se guardan al hacer el primer pedido. Como nombre
    // inicial usamos la parte del correo, hasta que el cliente complete el suyo.
    const placeholderName = regForm.email.split('@')[0] || 'Cliente';
    const res = await register(regForm.email, regForm.password, placeholderName);
    setSubmitting(false);
    if (res.success) {
      router.replace(redirectTo);
    }
    else setError(res.error || 'Error al registrarse');
  }

  return (
    <div className="min-h-screen font-['DM_Sans'] flex flex-col relative overflow-hidden bg-slate-50">
      {/* Premium Background */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-300 mix-blend-multiply filter blur-[100px] opacity-30 animate-pulse" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-blue-400 mix-blend-multiply filter blur-[120px] opacity-30" style={{ animation: 'pulse 8s cubic-bezier(0.4, 0, 0.6, 1) infinite' }} />
        <div className="absolute top-[20%] right-[20%] w-[30%] h-[30%] rounded-full bg-blue-200 mix-blend-multiply filter blur-[80px] opacity-40" />
      </div>

      {/* Top Navbar */}
      <nav className="relative z-10 w-full px-6 pt-6 pb-4 sm:py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center group">
          <img src={logoUrl || FALLBACK_LOGO} alt={storeName} className="h-6 sm:h-8 md:h-10 w-auto transition-transform duration-300 group-hover:scale-105" />
        </Link>
        <Link href="/" className="flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-900 transition-colors">
          <ArrowLeft size={16} />
          <span className="hidden sm:inline">Volver a la tienda</span>
        </Link>
      </nav>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center p-3 sm:p-4 relative z-10 w-full max-w-7xl mx-auto">
        <div className="w-full flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-24">
          
          {/* Left Text / Branding Area (Hidden on small screens) */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}
            className="hidden lg:flex flex-col max-w-md"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-xs font-bold tracking-wide uppercase mb-6 w-fit">
              <SparklesIcon /> Exclusivo
            </div>
            <h1 className="text-5xl font-black text-slate-900 leading-tight mb-6 tracking-tight">
              Desbloquea el acceso a <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-blue-600">ofertas premium</span>.
            </h1>
            <p className="text-lg text-slate-500 mb-8 leading-relaxed">
              Únete a nuestra comunidad para disfrutar de envíos rápidos, beneficios del programa de lealtad y atención personalizada.
            </p>
            <div className="grid grid-cols-2 gap-6">
              {[
                { label: 'Envíos Priority', desc: 'Recibe antes que nadie' },
                { label: 'Niveles VIP', desc: 'Gana puntos y sube de nivel' },
                { label: 'Ofertas Flash', desc: 'Acceso anticipado' },
                { label: 'Soporte 24/7', desc: 'Atención prioritaria' },
              ].map((b, i) => (
                <div key={i} className="flex flex-col gap-1">
                  <div className="flex items-center gap-2 text-slate-900 font-bold">
                    <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">✓</div>
                    {b.label}
                  </div>
                  <span className="text-sm text-slate-500 pl-7">{b.desc}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right Form Area */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
            className="w-full max-w-[440px] px-1 sm:px-0"
          >
            <div className="bg-white/80 backdrop-blur-xl rounded-[24px] sm:rounded-[32px] shadow-[0_8px_40px_-12px_rgba(0,0,0,0.1)] border border-white/50 overflow-hidden relative">
              
              {/* Form Header Tabs */}
              <div className="flex relative p-2 bg-slate-100/50 m-4 sm:m-6 rounded-2xl">
                <div 
                  className="absolute inset-y-2 w-[calc(50%-8px)] bg-white rounded-xl shadow-sm transition-all duration-300 ease-out"
                  style={{ left: tab === 'login' ? '8px' : 'calc(50%)' }}
                />
                {(['login', 'register'] as const).map(t => (
                  <button 
                    key={t} onClick={() => { setTab(t); setError(''); }}
                    className={`relative flex-1 py-3 text-sm font-bold z-10 transition-colors duration-200 ${tab === t ? 'text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
                  >
                    {t === 'login' ? 'Iniciar sesión' : 'Crear cuenta'}
                  </button>
                ))}
              </div>

              <div className="px-5 sm:px-8 pb-6 sm:pb-8">
                <div className="mb-8 text-center">
                  <h2 className="text-2xl font-black text-slate-900 mb-2">
                    {tab === 'login' ? '¡Hola de nuevo!' : 'Comienza tu viaje'}
                  </h2>
                  <p className="text-sm text-slate-500">
                    {tab === 'login' ? 'Ingresa tus credenciales para continuar.' : 'Completá tus datos para unirte.'}
                  </p>
                </div>

                <AnimatePresence mode="wait">
                  {error && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                      className="flex items-start gap-3 p-4 mb-6 bg-blue-50 border border-blue-100 rounded-2xl text-blue-600 text-sm font-medium"
                    >
                      <AlertCircle size={18} className="shrink-0 mt-0.5" />
                      <span>{error}</span>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="relative">
                  <AnimatePresence mode="wait">
                    {/* ── LOGIN FORM ── */}
                    {tab === 'login' && (
                      <motion.form 
                        key="login"
                        initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.2 }}
                        onSubmit={handleLogin} className="flex flex-col gap-5"
                      >
                        <InputField 
                          label="Correo electrónico" icon={<Mail size={18} />} type="email" placeholder="tu@correo.com"
                          value={loginForm.email} onChange={(e: any) => setLoginForm(f => ({ ...f, email: e.target.value }))} autoFocus
                        />
                        <div className="flex flex-col gap-2">
                          <div className="flex justify-between items-center">
                            <label className="text-sm font-bold text-slate-700">Contraseña</label>
                            <button type="button" className="text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors">
                              ¿Olvidaste tu contraseña?
                            </button>
                          </div>
                          <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-400 group-focus-within:text-blue-500 transition-colors pointer-events-none">
                              <Lock size={18} />
                            </div>
                            <input 
                              type={showPass ? 'text' : 'password'} value={loginForm.password}
                              onChange={(e: any) => setLoginForm(f => ({ ...f, password: e.target.value }))}
                              placeholder="••••••••"
                              className="w-full pl-11 pr-12 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 text-sm font-medium focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none"
                            />
                            <button 
                              type="button" onClick={() => setShowPass(!showPass)}
                              className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                            >
                              {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                          </div>
                        </div>

                        <button 
                          type="submit" disabled={submitting}
                          className="mt-4 w-full group relative flex items-center justify-center gap-2 py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-bold text-sm transition-all disabled:opacity-70 disabled:cursor-not-allowed shadow-[0_8px_20px_rgba(0,0,0,0.12)] hover:shadow-[0_12px_24px_rgba(0,0,0,0.18)]"
                          style={{ background: '#0f172a', color: '#fff' }}
                        >
                          {submitting ? (
                            <><Loader2 size={18} className="animate-spin" /> Ingresando...</>
                          ) : (
                            <>Ingresar <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" /></>
                          )}
                        </button>
                      </motion.form>
                    )}

                    {/* ── REGISTER FORM ── */}
                    {tab === 'register' && (
                      <motion.form 
                        key="register"
                        initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}
                        onSubmit={handleRegister} className="flex flex-col gap-4"
                      >
                        <InputField label="Correo electrónico" icon={<Mail size={18} />} type="email" value={regForm.email} onChange={(e: any) => setRegForm(f => ({ ...f, email: e.target.value }))} placeholder="tu@correo.com" autoFocus />
                        <p className="text-xs text-slate-400 -mt-1">Solo necesitas tu correo y una contraseña. Tus datos (nombre, RUT, teléfono, dirección) los completas al hacer tu primer pedido y quedan guardados.</p>

                        <div className="flex flex-col gap-2">
                          <label className="text-sm font-bold text-slate-700">Contraseña *</label>
                          <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-400 group-focus-within:text-blue-500 transition-colors pointer-events-none">
                              <Lock size={18} />
                            </div>
                            <input 
                              type={showPass ? 'text' : 'password'} value={regForm.password}
                              onChange={(e: any) => setRegForm(f => ({ ...f, password: e.target.value }))}
                              placeholder="Mínimo 8 caracteres"
                              className="w-full pl-11 pr-12 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 text-sm font-medium focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none"
                            />
                            <button 
                              type="button" onClick={() => setShowPass(!showPass)}
                              className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                            >
                              {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                          </div>
                        </div>

                        <div className="flex flex-col gap-2">
                          <label className="text-sm font-bold text-slate-700">Confirmar contraseña *</label>
                          <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-400 group-focus-within:text-blue-500 transition-colors pointer-events-none">
                              <Lock size={18} />
                            </div>
                            <input 
                              type="password" value={regForm.confirm}
                              onChange={(e: any) => setRegForm(f => ({ ...f, confirm: e.target.value }))}
                              placeholder="Repite tu contraseña"
                              className={`w-full pl-11 pr-4 py-3.5 bg-slate-50 border rounded-2xl text-slate-900 text-sm font-medium focus:bg-white focus:ring-4 transition-all outline-none
                                ${regForm.confirm && regForm.confirm !== regForm.password ? 'border-blue-400 focus:border-blue-500 focus:ring-blue-500/10' : 'border-slate-200 focus:border-blue-500 focus:ring-blue-500/10'}`}
                            />
                          </div>
                        </div>

                        <button 
                          type="submit" disabled={submitting}
                          className="mt-4 w-full group relative flex items-center justify-center gap-2 py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-bold text-sm transition-all disabled:opacity-70 disabled:cursor-not-allowed shadow-[0_8px_20px_rgba(0,0,0,0.12)] hover:shadow-[0_12px_24px_rgba(0,0,0,0.18)]"
                          style={{ background: '#0f172a', color: '#fff' }}
                        >
                          {submitting ? (
                            <><Loader2 size={18} className="animate-spin" /> Creando cuenta...</>
                          ) : (
                            <>Crear cuenta <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" /></>
                          )}
                        </button>
                      </motion.form>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>

            <p className="text-center text-xs text-slate-400 mt-8 font-medium">
              Al continuar, aceptas nuestros{' '}
              <a href="#" className="text-slate-600 hover:text-blue-600 underline decoration-slate-300 hover:decoration-blue-500 transition-colors">Términos y condiciones</a>
              {' '}y{' '}
              <a href="#" className="text-slate-600 hover:text-blue-600 underline decoration-slate-300 hover:decoration-blue-500 transition-colors">Política de privacidad</a>.
            </p>
          </motion.div>
        </div>
      </div>

    </div>
  );
}

function InputField({ label, icon, ...props }: any) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-bold text-slate-700">{label}</label>
      <div className="relative group">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-400 group-focus-within:text-blue-500 transition-colors pointer-events-none">
          {icon}
        </div>
        <input 
          {...props}
          className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 text-sm font-medium focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none"
        />
      </div>
    </div>
  );
}

function SparklesIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
    </svg>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginInner />
    </Suspense>
  );
}
