import { motion } from "framer-motion";
import type { CategoryId } from "@/types/game";
import { getCategoryTitle } from "@/lib/quiz";

type LoadingScreenProps = {
  category: CategoryId;
};

export default function LoadingScreen({ category }: LoadingScreenProps) {
  const categoryTitle = getCategoryTitle(category);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#08070d] text-white">
      <motion.div
        className="flex flex-col items-center justify-center gap-6 px-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {/* Animated spinner */}
        <div className="relative size-16">
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-transparent border-t-[var(--accent)] border-r-[var(--accent)]"
            animate={{ rotate: 360 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          />
          <motion.div
            className="absolute inset-2 rounded-full border-2 border-transparent border-b-[var(--accent)]/50"
            animate={{ rotate: -360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          />
        </div>

        {/* Loading text */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <p className="text-sm uppercase tracking-[0.15em] text-neutral-400 mb-2">
            Подготовка лабиринта
          </p>
          <h2 className="text-2xl font-black text-white">
            Генерируем вопросы
          </h2>
          <p className="mt-2 text-lg text-[var(--accent)] font-semibold">
            {categoryTitle}
          </p>
        </motion.div>

        {/* Animated dots */}
        <motion.div
          className="flex gap-1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="size-2 rounded-full bg-[var(--accent)]"
              animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: i * 0.15,
              }}
            />
          ))}
        </motion.div>

        {/* Hint text */}
        <motion.p
          className="mt-6 text-sm text-neutral-500 text-center max-w-xs"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          ИИ создаёт персональные вопросы специально для тебя...
        </motion.p>
      </motion.div>
    </div>
  );
}
