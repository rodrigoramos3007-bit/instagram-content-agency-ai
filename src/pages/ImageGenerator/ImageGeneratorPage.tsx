import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Download, Heart, RefreshCw, Wand2, Copy, Trash2 } from 'lucide-react';
import { useBrandStore } from '@/store/brandStore';
import { useContentStore } from '@/store/contentStore';
import { generateImagePrompt } from '@/services/openai';
import { generateImage, formatToSize } from '@/services/imageAI';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { LoadingState } from '@/components/common/LoadingState';
import { generateId, copyToClipboard } from '@/lib/utils';
import { VISUAL_STYLES, IMAGE_FORMATS } from '@/lib/constants';
import type { GeneratedImage } from '@/types/content';
import { toast } from 'sonner';

export function ImageGeneratorPage() {
  const { brand } = useBrandStore();
  const { images, addImage, removeImage, toggleFavorite, favorites } = useContentStore();

  const [loading, setLoading] = useState(false);
  const [description, setDescription] = useState('');
  const [style, setStyle] = useState('premium-clean');
  const [format, setFormat] = useState('1:1');
  const [prompt, setPrompt] = useState('');
  const [promptLoading, setPromptLoading] = useState(false);
  const [currentImage, setCurrentImage] = useState<string | null>(null);

  async function handleGeneratePrompt() {
    if (!brand) { toast.error('Configure sua marca primeiro'); return; }
    if (!description) { toast.error('Descreva o conteúdo da imagem'); return; }
    setPromptLoading(true);
    try {
      const text = await generateImagePrompt(brand, description, style, format);
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error('Invalid JSON');
      const data = JSON.parse(jsonMatch[0]);
      setPrompt(data.prompt || '');
      toast.success('Prompt gerado!');
    } catch {
      setPrompt(`Professional Instagram ${format === '9:16' ? 'story' : 'post'} image for ${brand?.name || 'brand'}, ${style.replace('-', ' ')} style, premium quality, dark background with purple gradient accents, modern design, high resolution photography`);
    } finally {
      setPromptLoading(false);
    }
  }

  async function handleGenerateImage() {
    if (!prompt) { toast.error('Gere ou escreva um prompt primeiro'); return; }
    setLoading(true);
    try {
      const url = await generateImage({ prompt, size: formatToSize(format), quality: 'hd' });
      setCurrentImage(url);
      const image: GeneratedImage = {
        id: generateId(),
        url,
        prompt,
        style,
        format,
        isFavorite: false,
        createdAt: new Date().toISOString(),
      };
      addImage(image);
      toast.success('Imagem gerada!');
    } catch {
      toast.error('Erro ao gerar imagem.');
    } finally {
      setLoading(false);
    }
  }

  async function handleDownload(url: string) {
    const a = document.createElement('a');
    a.href = url;
    a.download = `image-${Date.now()}.jpg`;
    a.target = '_blank';
    a.click();
  }

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-white">Gerador de Imagens</h1>
        <p className="text-brand-text-secondary text-sm mt-1">Crie imagens premium para Instagram com IA</p>
      </motion.div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Config Panel */}
        <div className="xl:col-span-1 space-y-4">
          <Card>
            <CardContent className="space-y-5">
              <div>
                <label className="text-xs text-brand-text-muted mb-1.5 block uppercase tracking-wider">Descrição do Conteúdo</label>
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Descreva o que você quer na imagem..." rows={3} className="w-full bg-brand-elevated border border-brand-border rounded-xl px-4 py-3 text-sm text-white placeholder:text-brand-text-muted outline-none focus:border-brand-primary/50 resize-none" />
              </div>

              <div>
                <label className="text-xs text-brand-text-muted mb-2 block uppercase tracking-wider">Formato</label>
                <div className="grid grid-cols-2 gap-2">
                  {IMAGE_FORMATS.map((f) => (
                    <button
                      key={f.value}
                      onClick={() => setFormat(f.value)}
                      className={`p-2.5 rounded-xl text-xs font-medium border transition-all text-center ${format === f.value ? 'bg-brand-primary/20 text-brand-primary border-brand-primary/40' : 'bg-brand-elevated text-brand-text-muted border-brand-border hover:text-white'}`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs text-brand-text-muted mb-2 block uppercase tracking-wider">Estilo Visual</label>
                <div className="space-y-1.5 max-h-48 overflow-y-auto">
                  {VISUAL_STYLES.map((s) => (
                    <button
                      key={s.value}
                      onClick={() => setStyle(s.value)}
                      className={`w-full text-left p-2.5 rounded-xl text-xs font-medium border transition-all ${style === s.value ? 'bg-brand-primary/20 text-brand-primary border-brand-primary/40' : 'bg-brand-elevated text-brand-text-muted border-brand-border hover:text-white'}`}
                    >
                      <span className="block font-semibold">{s.label}</span>
                      <span className="block opacity-60 text-[10px] mt-0.5">{s.description}</span>
                    </button>
                  ))}
                </div>
              </div>

              <Button
                variant="outline"
                className="w-full"
                onClick={handleGeneratePrompt}
                loading={promptLoading}
                leftIcon={<Wand2 size={15} />}
              >
                Gerar Prompt
              </Button>
            </CardContent>
          </Card>

          {/* Prompt Editor */}
          <Card>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs text-brand-text-muted uppercase tracking-wider">Prompt da Imagem</label>
                {prompt && <button onClick={() => copyToClipboard(prompt)} className="p-1 rounded hover:bg-brand-elevated text-brand-text-muted hover:text-white"><Copy size={13} /></button>}
              </div>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="O prompt aparecerá aqui. Você pode editar livremente..."
                rows={5}
                className="w-full bg-brand-elevated border border-brand-border rounded-xl px-4 py-3 text-xs text-white font-mono placeholder:text-brand-text-muted outline-none focus:border-brand-primary/50 resize-none"
              />
              <Button className="w-full" onClick={handleGenerateImage} loading={loading} leftIcon={<Sparkles size={16} />}>
                Gerar Imagem com IA
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Preview & Gallery */}
        <div className="xl:col-span-2 space-y-5">
          {/* Current Image */}
          <Card>
            <CardContent>
              <h2 className="text-base font-semibold text-white mb-4">Preview</h2>
              {loading ? (
                <LoadingState message="Gerando imagem com IA..." submessage="DALL·E 3 está criando sua imagem premium" />
              ) : currentImage ? (
                <div className="relative group">
                  <img src={currentImage} alt="Generated" className="w-full max-h-96 object-cover rounded-xl border border-brand-border" onError={(e) => { (e.target as HTMLImageElement).src = 'https://picsum.photos/seed/placeholder/800/800'; }} />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 rounded-xl transition-all flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100">
                    <button onClick={() => handleDownload(currentImage)} className="p-3 bg-brand-elevated rounded-xl hover:bg-brand-surface transition-all">
                      <Download size={18} className="text-white" />
                    </button>
                    <button onClick={handleGenerateImage} className="p-3 bg-brand-elevated rounded-xl hover:bg-brand-surface transition-all">
                      <RefreshCw size={18} className="text-white" />
                    </button>
                  </div>
                  <div className="mt-3 flex gap-2">
                    <Badge variant="primary">{style.replace('-', ' ')}</Badge>
                    <Badge variant="default">{format}</Badge>
                  </div>
                </div>
              ) : (
                <div className="aspect-square max-h-72 bg-brand-elevated rounded-xl border border-brand-border flex items-center justify-center">
                  <div className="text-center">
                    <Sparkles size={40} className="text-brand-text-muted mx-auto mb-2" />
                    <p className="text-brand-text-muted text-sm">Sua imagem aparecerá aqui</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Gallery */}
          {images.length > 0 && (
            <Card>
              <CardContent>
                <h2 className="text-base font-semibold text-white mb-4">Galeria ({images.length})</h2>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                  {images.map((img) => (
                    <motion.div
                      key={img.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="relative group aspect-square"
                    >
                      <img
                        src={img.url}
                        alt="Generated"
                        className="w-full h-full object-cover rounded-xl border border-brand-border cursor-pointer"
                        onClick={() => setCurrentImage(img.url)}
                        onError={(e) => { (e.target as HTMLImageElement).src = 'https://picsum.photos/seed/' + img.id + '/200/200'; }}
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 rounded-xl transition-all flex items-center justify-center gap-1.5 opacity-0 group-hover:opacity-100">
                        <button onClick={() => toggleFavorite(img.id)} className="p-1.5 bg-brand-elevated rounded-lg">
                          <Heart size={12} className={favorites.includes(img.id) ? 'text-brand-secondary fill-brand-secondary' : 'text-white'} />
                        </button>
                        <button onClick={() => handleDownload(img.url)} className="p-1.5 bg-brand-elevated rounded-lg">
                          <Download size={12} className="text-white" />
                        </button>
                        <button onClick={() => removeImage(img.id)} className="p-1.5 bg-red-500/20 rounded-lg">
                          <Trash2 size={12} className="text-red-400" />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
