# QUIZMANIA: Tech Stack

## Финальный выбор

| Часть | Технология | Почему |
|---|---|---|
| Deploy | Vercel | простой GitHub autodeploy, preview deploys, лучший сценарий для Next.js |
| Framework | Next.js | один проект для сайта, игры и API route для DeepSeek |
| UI layer | React | Next.js работает поверх React; удобно собирать экраны, модалки, HUD, skins |
| Language | TypeScript | снижает риск багов в game state, quiz JSON, enemies, skins и power-ups |
| Styling | Tailwind CSS | быстро собрать аккуратный responsive UI без лишней CSS-рутины |
| UI animation | Framer Motion | плавные переходы, unlock screens, popups, arcade-эффекты |
| Icons | lucide-react | готовые чистые иконки для UI-кнопок и статусов |
| Game loop | requestAnimationFrame | нативный браузерный цикл для плавного движения без тяжёлого game engine |
| Visual assets | SVG components + CSS effects | лёгкие персонажи, skins, враги и power-ups без PNG-ассетов |
| AI | DeepSeek API через Next.js API route | ключ API не попадает на клиент, AI генерирует questions, answers и fun facts |
| Progress | localStorage | достаточно для solo MVP: skins, successful runs, selected skin |

## Почему TypeScript

| TypeScript даёт | Почему важно для игры |
|---|---|
| Типы для вопросов | AI должен вернуть валидный quiz JSON |
| Типы для game state | меньше ошибок в lives, score, current question, stage |
| Типы для enemies | проще контролировать Doubt, Confusion, Panic |
| Типы для skins | понятные unlock thresholds и bonuses |
| Типы для power-ups | меньше риска сломать Hint, Freeze, Focus |

Вывод: TypeScript немного строже на старте, зато снижает риск багов в дедлайн.

## Карты и визуалы

| Часть | Решение |
|---|---|
| Карты | 3 ручных layout-а под Stage 1, Stage 2, Stage 3 |
| Усложнение | по progress: 0-29%, 30-79%, 80-100% |
| Персонаж | SVG-компонент |
| Скины | SVG/CSS-слои поверх персонажа |
| Враги | SVG/CSS-компоненты |
| Power-ups | SVG/CSS-компоненты |
