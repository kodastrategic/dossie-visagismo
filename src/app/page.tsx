'use client';

import React, { useState, useRef } from 'react';

// --- COMPONENTES DE UI CUSTOMIZADOS (TEMA DARK + RESPONSIVO) ---

const Input = ({ label, ...props }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) => (
  <div className="flex flex-col gap-1 mb-6 print:mb-2">
    <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400 print:text-black">{label}</label>
    <input 
      className="border-b border-white/30 py-2 focus:outline-none focus:border-white bg-transparent text-white placeholder:text-white/20 transition-colors print:border-none print:text-black print:py-0 print:text-sm"
      {...props} 
    />
  </div>
);

const Textarea = ({ label, ...props }: { label: string } & React.TextareaHTMLAttributes<HTMLTextAreaElement>) => (
  <div className="flex flex-col gap-1 mb-6 print:mb-2">
    <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400 print:text-black">{label}</label>
    <textarea 
      className="border border-white/30 p-3 focus:outline-none focus:border-white bg-transparent text-white min-h-[120px] transition-colors print:border-none print:p-0 print:min-h-0 print:text-black print:text-sm"
      {...props} 
    />
  </div>
);

const Select = ({ label, options, ...props }: { label: string; options: string[] } & React.SelectHTMLAttributes<HTMLSelectElement>) => (
  <div className="flex flex-col gap-1 mb-6 print:mb-2">
    <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400 print:text-black">{label}</label>
    <select 
      className="border-b border-white/30 py-2 focus:outline-none focus:border-white bg-transparent text-white cursor-pointer print:border-none print:appearance-none print:text-black print:text-sm"
      {...props}
    >
      {options.map(opt => <option key={opt} value={opt} className="bg-black text-white">{opt}</option>)}
    </select>
  </div>
);

const ImageUpload = ({ label, preview, setPreview }: { label: string; preview: string | null; setPreview: (val: string | null) => void }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  return (
    <div className="mb-4 w-full">
      <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-2 block print:hidden">{label}</label>
      <div 
        onClick={() => fileInputRef.current.click()}
        className={`relative border-2 border-dashed border-white/20 aspect-[3/4] flex flex-col items-center justify-center cursor-pointer overflow-hidden transition-all hover:bg-white/5 print:border-none print:aspect-auto print:max-h-[150px] ${preview ? 'border-solid border-white/40' : ''}`}
      >
        {preview ? (
          <img src={preview} alt="Preview" className="w-full h-full object-cover" />
        ) : (
          <div className="flex flex-col items-center gap-3 text-center p-4 print:hidden">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className="text-white/40"><path fill="currentColor" d="M11 16V7.85l-2.6 2.6L7 9l5-5l5 5l-1.4 1.45l-2.6-2.6V16zm-5 4q-.825 0-1.412-.587T4 18v-3h2v3h12v-3h2v3q0 .825-.587 1.413T18 20z"/></svg>
            <span className="text-[10px] uppercase tracking-[0.2em] text-white/40">Upload {label}</span>
          </div>
        )}
        <input type="file" ref={fileInputRef} onChange={handleImageChange} className="hidden" accept="image/*" />
      </div>
    </div>
  );
};

// --- COMPONENTE PRINCIPAL (WIZARD DARK + MOBILE) ---

export default function DossieWizard() {
  const [step, setStep] = useState(1);
  const totalSteps = 8;

  const [formData, setFormData] = useState({
    cliente: '',
    especialista: '',
    instagram: '',
    videoUrl: '',
    // ... outros campos podem ser adicionados aqui para bind no PDF real
  });

  const [previews, setPreviews] = useState({
    main: null,
    c1: null, c2: null, c3: null,
    b1: null, b2: null
  });

  const [products, setProducts] = useState([
    { id: Date.now(), name: '', desc: '', photo: null }
  ]);

  const addProduct = () => products.length < 6 && setProducts([...products, { id: Date.now(), name: '', desc: '', photo: null }]);
  const removeProduct = (id) => products.length > 1 && setProducts(products.filter(p => p.id !== id));
  const updateProduct = (id, field, value) => setProducts(products.map(p => p.id === id ? { ...p, [field]: value } : p));

  const nextStep = () => { window.scrollTo({ top: 0, behavior: 'smooth' }); setStep(prev => Math.min(prev + 1, totalSteps)); };
  const prevStep = () => { window.scrollTo({ top: 0, behavior: 'smooth' }); setStep(prev => Math.max(prev - 1, 1)); };
  const handlePrint = () => window.print();

  return (
    <div className="min-h-screen bg-black font-serif text-white selection:bg-white selection:text-black overflow-x-hidden">
      
      {/* HEADER FIXO */}
      <nav className="fixed top-0 left-0 w-full bg-black/90 backdrop-blur-md border-b border-white/10 z-50 px-4 md:px-8 py-4 flex flex-col md:flex-row justify-between items-center gap-3 print:hidden">
        <span className="uppercase tracking-[0.4em] font-bold text-xs md:text-sm">Dossiê Estratégico</span>
        <div className="flex gap-4 items-center w-full md:w-auto justify-center">
          <span className="text-[10px] uppercase tracking-widest text-white/40">Passo {step} / {totalSteps}</span>
          <div className="flex-1 md:w-48 h-[2px] bg-white/10 relative">
            <div className="absolute top-0 left-0 h-full bg-white transition-all duration-700" style={{ width: `${(step/totalSteps)*100}%` }}></div>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto pt-28 md:pt-40 pb-40 px-6 print:hidden text-white">
        
        {/* PASSO 1: CAPA */}
        {step === 1 && (
          <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <div className="text-center space-y-6">
              <h1 className="text-4xl md:text-6xl uppercase tracking-[0.25em] font-extralight border-y border-white/20 py-10 md:py-16 inline-block px-8 md:px-20 leading-tight">
                DOSSIÊ ESTRATÉGICO
              </h1>
              <p className="italic text-white/50 tracking-widest uppercase text-xs md:text-sm">Consultoria de Reposicionamento</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4 pt-8">
              <Input label="Nome do cliente" value={formData.cliente} onChange={e => setFormData({...formData, cliente: e.target.value})} placeholder="Ex: Lucas Silva" />
              <Input label="Data da consultoria" type="date" />
              <Select label="Versão" options={['Online', 'Presencial']} />
              <Input label="Nome do especialista" value={formData.especialista} onChange={e => setFormData({...formData, especialista: e.target.value})} placeholder="Seu nome" />
              <Input label="Instagram do profissional" value={formData.instagram} onChange={e => setFormData({...formData, instagram: e.target.value})} placeholder="@seuusuario" />
              <Input label="Vídeo Explicativo (Link Drive/Opcional)" value={formData.videoUrl} onChange={e => setFormData({...formData, videoUrl: e.target.value})} placeholder="https://drive.google.com/..." />
            </div>
          </div>
        )}

        {/* PASSO 2: DIAGNÓSTICO */}
        {step === 2 && (
          <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <h2 className="text-3xl md:text-4xl uppercase tracking-widest border-l-2 border-white pl-6 italic">Diagnóstico</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-2">
              <Textarea label="Momento de vida atual" />
              <Select label="Objetivo de imagem" options={['Autoridade', 'Presença', 'Posicionamento', 'Confiança', 'Outro']} />
              <Input label="Profissão / contexto profissional" />
              <Textarea label="Como a imagem atual comunica" />
              <Textarea label="Pontos fortes da imagem atual" />
              <Textarea label="Pontos que enfraquecem a presença" />
            </div>
          </div>
        )}

        {/* PASSO 3: VISAGISMO */}
        {step === 3 && (
          <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <h2 className="text-3xl md:text-4xl uppercase tracking-widest border-l-2 border-white pl-6 italic">Análise Visagista</h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
              <div className="lg:col-span-1">
                <ImageUpload label="Foto do Cliente" preview={previews.main} setPreview={(val) => setPreviews({...previews, main: val})} />
              </div>
              <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
                <Select label="Formato do rosto" options={['Oval', 'Quadrado', 'Retangular', 'Redondo', 'Triangular', 'Outro']} />
                <Textarea label="Estrutura facial" />
                <Textarea label="Proporções visuais" />
                <Textarea label="Harmonia estética" />
                <Textarea label="Características dominantes" />
                <Textarea label="Estilos que favorecem" />
              </div>
            </div>
          </div>
        )}

        {/* PASSO 4: CORTE */}
        {step === 4 && (
          <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <h2 className="text-3xl md:text-4xl uppercase tracking-widest border-l-2 border-white pl-6 italic">Direcionamento de Corte</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
              <Input label="Estilo de corte ideal" />
              <Textarea label="Estrutura do corte" />
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:col-span-2 pt-6">
                <ImageUpload label="Referência 1" preview={previews.c1} setPreview={(val) => setPreviews({...previews, c1: val})} />
                <ImageUpload label="Referência 2" preview={previews.c2} setPreview={(val) => setPreviews({...previews, c2: val})} />
                <ImageUpload label="Referência 3" preview={previews.c3} setPreview={(val) => setPreviews({...previews, c3: val})} />
              </div>
            </div>
          </div>
        )}

        {/* PASSO 5: BARBA */}
        {step === 5 && (
          <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <h2 className="text-3xl md:text-4xl uppercase tracking-widest border-l-2 border-white pl-6 italic">Direcionamento de Barba</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
              <Input label="Estilo de barba ideal" />
              <Textarea label="Linha de contorno" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:col-span-2 pt-6 max-w-xl">
                <ImageUpload label="Referência 1" preview={previews.b1} setPreview={(val) => setPreviews({...previews, b1: val})} />
                <ImageUpload label="Referência 2" preview={previews.b2} setPreview={(val) => setPreviews({...previews, b2: val})} />
              </div>
            </div>
          </div>
        )}

        {/* PASSO 6: PRODUTOS */}
        {step === 6 && (
          <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <div className="flex justify-between items-end border-b border-white pb-4">
              <h2 className="text-3xl md:text-4xl uppercase tracking-widest italic">Produtos</h2>
              <span className="text-[10px] uppercase tracking-widest text-white/40">{products.length} / 6</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {products.map((product, idx) => (
                <div key={product.id} className="border border-white/10 p-6 bg-white/5 space-y-4 relative">
                  <div className="flex justify-between items-center"><span className="text-[10px] text-white/20 uppercase">Item {idx+1}</span>{products.length > 1 && <button onClick={() => removeProduct(product.id)} className="text-[10px] text-red-500/50 hover:text-red-500 uppercase">Remover</button>}</div>
                  <Input label="Nome do Produto" value={product.name} onChange={e => updateProduct(product.id, 'name', e.target.value)} />
                  <Textarea label="Descrição / Uso" value={product.desc} onChange={e => updateProduct(product.id, 'desc', e.target.value)} />
                  <ImageUpload label="Foto" preview={product.photo} setPreview={val => updateProduct(product.id, 'photo', val)} />
                </div>
              ))}
              {products.length < 6 && (
                <button onClick={addProduct} className="border-2 border-dashed border-white/10 flex flex-col items-center justify-center p-12 hover:bg-white/5 transition-all group">
                  <span className="text-2xl font-light mb-2 group-hover:scale-125 transition-transform">+</span>
                  <span className="text-[10px] uppercase tracking-widest font-bold">Adicionar</span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* PASSO 7: PROJETO FINAL */}
        {step === 7 && (
          <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <h2 className="text-3xl md:text-4xl uppercase tracking-widest border-l-2 border-white pl-6 italic">Projeto Final</h2>
            <div className="space-y-8 max-w-3xl text-white">
              <Textarea label="Direção visual recomendada" />
              <Textarea label="Comunicação da nova imagem" />
              <Input label="Estilo visual estratégico" />
              <Textarea label="Resultado esperado" />
            </div>
          </div>
        )}

        {/* PASSO 8: FINALIZAR */}
        {step === 8 && (
          <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000 text-center">
            <div className="py-20 border border-white/10 space-y-8 bg-white/5">
              <h2 className="text-4xl md:text-5xl uppercase tracking-[0.3em] font-light italic">Pronto</h2>
              <button onClick={handlePrint} className="bg-white text-black px-12 py-5 uppercase tracking-[0.4em] text-xs font-bold hover:bg-white/80 transition-all shadow-2xl">Gerar Dossiê PDF</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left opacity-40">
              <Textarea label="Direcionamento técnico" />
              <Textarea label="Ajustes personalizados" />
            </div>
          </div>
        )}

        {/* NAVEGAÇÃO WIZARD */}
        <div className="fixed bottom-0 left-0 w-full bg-black border-t border-white/10 p-4 md:p-6 flex justify-between gap-4 print:hidden z-50">
          <button onClick={prevStep} disabled={step === 1} className={`flex-1 md:flex-none uppercase tracking-widest text-[10px] font-bold border border-white/20 px-4 md:px-10 py-4 ${step === 1 ? 'opacity-10' : 'hover:bg-white hover:text-black'}`}>Anterior</button>
          <button onClick={nextStep} disabled={step === totalSteps} className={`flex-1 md:flex-none uppercase tracking-widest text-[10px] font-bold bg-white text-black px-4 md:px-12 py-4 ${step === totalSteps ? 'opacity-10' : 'hover:bg-white/90'}`}>{step === totalSteps ? 'Fim' : 'Próximo'}</button>
        </div>
      </main>

      {/* ÁREA DO PDF (VISÍVEL SÓ NA IMPRESSÃO) */}
      <div className="hidden print:block bg-white text-black min-h-screen p-12 font-sans">
        <div className="border-b-2 border-black pb-8 mb-10 text-center">
          <h1 className="text-3xl uppercase tracking-[0.6em] font-bold">DOSSIÊ ESTRATÉGICO</h1>
          <p className="text-[10px] uppercase tracking-widest mt-3 font-medium opacity-60 italic">Consultoria de Reposicionamento de Imagem</p>
        </div>

        <div className="space-y-12">
          <section>
             <h2 className="text-[11px] uppercase tracking-widest font-bold border-b border-black/10 pb-2 mb-6">Diagnóstico Geral</h2>
             <div className="grid grid-cols-2 gap-10 text-[10px]">
                <div className="space-y-4">
                   <p><span className="font-bold uppercase opacity-50 block mb-1">Cliente:</span> {formData.cliente || '[Nome do Cliente]'}</p>
                   <p><span className="font-bold uppercase opacity-50 block mb-1">Especialista:</span> {formData.especialista || '[Nome do Especialista]'}</p>
                </div>
                {formData.videoUrl && (
                  <div className="border border-black/5 p-4 bg-gray-50 flex flex-col justify-center text-center">
                    <p className="font-bold uppercase text-[9px] mb-2">Vídeo Explicativo</p>
                    <a href={formData.videoUrl} target="_blank" className="text-black underline font-bold text-[10px] truncate">{formData.videoUrl}</a>
                  </div>
                )}
             </div>
          </section>

          <section>
            <h2 className="text-[11px] uppercase tracking-widest font-bold border-b border-black/10 pb-2 mb-6">Visagismo & Estrutura Facial</h2>
            <div className="flex gap-8">
              {previews.main && <img src={previews.main} className="w-48 h-64 object-cover border border-black/10" />}
              <div className="flex-1 text-[10px] leading-relaxed space-y-4">
                 <p><span className="font-bold uppercase opacity-50 block">Análise Técnica:</span> [Conteúdo do Diagnóstico Facial aqui...]</p>
              </div>
            </div>
          </section>

          <section className="break-before-page">
            <h2 className="text-[11px] uppercase tracking-widest font-bold border-b border-black/10 pb-2 mb-6">Indicação de Produtos</h2>
            <div className="grid grid-cols-2 gap-x-8 gap-y-10">
              {products.map((p, i) => (
                <div key={i} className="space-y-3">
                  {p.photo && <img src={p.photo} className="w-full h-32 object-contain border border-black/5 p-2" />}
                  <p className="text-[11px] font-bold uppercase tracking-wider">{p.name || `Produto ${i+1}`}</p>
                  <p className="text-[10px] text-gray-600 leading-relaxed">{p.desc || 'Descrição das funcionalidades e modo de uso...'}</p>
                </div>
              ))}
            </div>
          </section>

          {/* RODAPÉ PDF CLICÁVEL */}
          <section className="mt-20 pt-10 border-t border-black/10 flex justify-between items-center text-[9px] uppercase tracking-widest">
            <p className="opacity-40 italic">Documento Confidencial</p>
            {formData.instagram && (
              <a href={`https://instagram.com/${formData.instagram.replace('@','')}`} target="_blank" className="font-bold text-black border-b border-black">
                Instagram: {formData.instagram}
              </a>
            )}
          </section>
        </div>
      </div>

    </div>
  );
}
