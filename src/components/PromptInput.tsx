import { useState, FormEvent } from "react";
import { Send, Wand2 } from "lucide-react";

interface PromptInputProps {
  onGenerate: (prompt: string) => void;
  isLoading: boolean;
  placeholder?: string;
  mode: "generate" | "edit";
}

export function PromptInput({ onGenerate, isLoading, placeholder, mode }: PromptInputProps) {
  const [prompt, setPrompt] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (prompt.trim() && !isLoading) {
      onGenerate(prompt);
      setPrompt("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-3xl mx-auto relative">
      <div className="relative flex items-center bg-white rounded-full shadow-lg border border-stone-100 p-2 transition-all focus-within:ring-2 focus-within:ring-olive/20">
        <div className="pl-4 text-stone-400">
          {mode === "generate" ? <Wand2 className="w-5 h-5" /> : <Send className="w-5 h-5" />}
        </div>
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder={placeholder || "Describe what you want to create..."}
          className="flex-1 bg-transparent border-none px-4 py-3 focus:outline-none text-stone-800 placeholder:text-stone-400 font-sans text-lg"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={!prompt.trim() || isLoading}
          className="bg-olive text-white rounded-full p-3 hover:bg-olive-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <Send className="w-5 h-5" />
          )}
        </button>
      </div>
      <div className="text-center mt-3">
        <p className="text-xs text-stone-400 font-sans tracking-wide uppercase">
          Powered by Gemini 2.5 Flash Image
        </p>
      </div>
    </form>
  );
}
