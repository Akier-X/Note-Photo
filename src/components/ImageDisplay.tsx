import { motion } from "motion/react";
import { Loader2 } from "lucide-react";

interface ImageDisplayProps {
  imageUrl: string | null;
  isLoading: boolean;
  altText?: string;
}

export function ImageDisplay({ imageUrl, isLoading, altText = "Generated Image" }: ImageDisplayProps) {
  return (
    <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-stone-100 border border-stone-200 shadow-sm flex items-center justify-center">
      {isLoading ? (
        <div className="flex flex-col items-center justify-center text-stone-500 gap-4">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <Loader2 className="w-8 h-8" />
          </motion.div>
          <p className="font-serif italic text-lg">Crafting your vision...</p>
        </div>
      ) : imageUrl ? (
        <motion.img
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          src={imageUrl}
          alt={altText}
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="text-center p-8 max-w-md">
          <div className="w-16 h-16 bg-stone-200 rounded-full mx-auto mb-4 flex items-center justify-center">
            <span className="text-2xl opacity-50">✨</span>
          </div>
          <p className="text-stone-500 font-serif text-xl italic">
            "Imagination is the beginning of creation."
          </p>
          <p className="text-stone-400 text-sm mt-2 font-sans">
            Enter a prompt below to start generating.
          </p>
        </div>
      )}
    </div>
  );
}
