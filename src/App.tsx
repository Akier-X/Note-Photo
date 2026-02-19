/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { generateImage, editImage } from './services/ai';
import { ImageDisplay } from './components/ImageDisplay';
import { PromptInput } from './components/PromptInput';
import { motion } from 'motion/react';
import { Sparkles, History, Trash2, Download } from 'lucide-react';

interface HistoryItem {
  id: string;
  url: string;
  prompt: string;
  timestamp: number;
}

export default function App() {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [mode, setMode] = useState<'generate' | 'edit'>('generate');

  const handleGenerate = async (prompt: string) => {
    setIsLoading(true);
    setError(null);
    try {
      let resultUrl: string;
      if (mode === 'edit' && imageUrl) {
        resultUrl = await editImage(imageUrl, prompt);
      } else {
        resultUrl = await generateImage(prompt);
      }
      
      setImageUrl(resultUrl);
      
      // Add to history
      const newItem: HistoryItem = {
        id: Date.now().toString(),
        url: resultUrl,
        prompt: prompt,
        timestamp: Date.now(),
      };
      setHistory((prev) => [newItem, ...prev]);
      
      // Reset mode to generate after successful generation/edit? 
      // Or keep it in edit mode to allow further edits?
      // Let's keep it in edit mode if we just edited, but maybe switch to edit if we just generated.
      if (mode === 'generate') {
        setMode('edit');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleHistorySelect = (item: HistoryItem) => {
    setImageUrl(item.url);
    setMode('edit');
  };

  const handleClear = () => {
    setImageUrl(null);
    setMode('generate');
  };

  const handleDownload = () => {
    if (imageUrl) {
      const link = document.createElement('a');
      link.href = imageUrl;
      link.download = `zencanvas-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="min-h-screen bg-warm-white text-charcoal font-serif selection:bg-olive/20">
      <header className="py-8 px-6 border-b border-stone/10 bg-white/50 backdrop-blur-md sticky top-0 z-10">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-olive rounded-full flex items-center justify-center text-white">
              <Sparkles className="w-5 h-5" />
            </div>
            <h1 className="text-3xl font-medium tracking-tight">ZenCanvas</h1>
          </div>
          <div className="flex gap-4">
            <button 
              onClick={handleClear}
              className="text-sm font-sans text-stone-500 hover:text-olive transition-colors flex items-center gap-2"
              disabled={!imageUrl}
            >
              <Trash2 className="w-4 h-4" />
              Clear
            </button>
             <button 
              onClick={handleDownload}
              className="text-sm font-sans text-stone-500 hover:text-olive transition-colors flex items-center gap-2"
              disabled={!imageUrl}
            >
              <Download className="w-4 h-4" />
              Save
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Main Canvas Area */}
        <div className="lg:col-span-8 flex flex-col gap-8">
          <div className="bg-white p-4 rounded-[32px] shadow-sm border border-stone/10">
            <ImageDisplay imageUrl={imageUrl} isLoading={isLoading} />
          </div>

          <div className="max-w-3xl mx-auto w-full">
            <PromptInput 
              onGenerate={handleGenerate} 
              isLoading={isLoading} 
              mode={mode}
              placeholder={mode === 'edit' ? "Describe how to change this image..." : "Describe what you want to create..."}
            />
            {error && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 p-4 bg-red-50 text-red-600 rounded-xl text-center font-sans text-sm"
              >
                {error}
              </motion.div>
            )}
          </div>
        </div>

        {/* Sidebar / History */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="flex items-center gap-2 text-stone-500 mb-2">
            <History className="w-4 h-4" />
            <h2 className="font-sans text-sm uppercase tracking-wider font-semibold">Recent Creations</h2>
          </div>
          
          <div className="grid grid-cols-2 gap-4 overflow-y-auto max-h-[calc(100vh-200px)] pr-2 custom-scrollbar">
            {history.length === 0 ? (
              <div className="col-span-2 text-center py-12 text-stone-400 border-2 border-dashed border-stone/20 rounded-2xl">
                <p className="font-sans text-sm">No history yet</p>
              </div>
            ) : (
              history.map((item) => (
                <motion.div
                  key={item.id}
                  layoutId={item.id}
                  onClick={() => handleHistorySelect(item)}
                  className="group relative aspect-square rounded-2xl overflow-hidden cursor-pointer border border-stone/10 hover:border-olive/50 transition-all"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <img 
                    src={item.url} 
                    alt={item.prompt} 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                </motion.div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
