import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { CATEGORIES } from "@/lib/quiz";
import type { CategoryId } from "@/types/game";

type CategoryModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (category: CategoryId) => void;
};

export default function CategoryModal({ isOpen, onClose, onSelect }: CategoryModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 px-4 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="w-full max-w-3xl rounded-lg border border-white/10 bg-[#111018] p-5 shadow-2xl"
            initial={{ y: 24, scale: 0.96 }}
            animate={{ y: 0, scale: 1 }}
            exit={{ y: 24, scale: 0.96 }}
          >
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-black uppercase tracking-[0.2em] accent-text">Категория</p>
                <h2 className="mt-1 text-2xl font-black">Выбери тему лабиринта</h2>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="grid size-10 place-items-center rounded-lg border border-white/10 text-neutral-300 transition hover:bg-white/10 hover:text-white"
                aria-label="Закрыть выбор категории"
              >
                <X size={20} />
              </button>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {CATEGORIES.map((category) => (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => onSelect(category.id)}
                  className="rounded-lg border border-white/10 bg-white/[0.04] p-4 text-left transition hover:border-[var(--accent)] hover:bg-[var(--accent-soft)]"
                >
                  <span className="text-lg font-black text-white">{category.title}</span>
                  <span className="mt-2 block text-sm text-neutral-400">{category.description}</span>
                </button>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
