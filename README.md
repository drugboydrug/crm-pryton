# Pryton — Internal Kanban

Private internal control panel for task management and system operations.
Built for two trusted users. No public access.

## What it does
- Secure login (Supabase Auth)
- Internal dashboard
- Kanban board:
  - Todo / In progress / Done
  - Create task (Enter)
  - Edit title inline
  - Drag & drop
  - Delete task
- Realtime sync (Supabase Realtime)
- Minimal, quiet UI (Apple internal tool style)

## Tech stack
- Next.js (App Router)
- Supabase (Auth, DB, Realtime)
- React
- dnd-kit

## How to run locally
```bash
npm install
npm run dev
```

Create `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

## Database

**Table: tasks**
Fields:
- `id` (uuid)
- `title` (text)
- `status` (todo | in_progress | done)
- `created_at` (timestamp)

## Access

Only allowed emails can log in.
This is an internal tool, not a public product.

## Status

**v1.1 — stable**

---

## готово ✅

### что мы зафиксировали
- рабочая версия **v1.1**
- понятное описание проекта
- любой из вас завтра откроет и сразу поймёт:
  - что это
  - как запускать
  - что уже сделано

---

## итог по проекту сейчас (коротко)
- продукт **работает**
- код **не разваливается**
- архитектура **расширяемая**
- UI **тихий и взрослый**
- можно пользоваться каждый день

---

## дальше (выбор, без давления)
- **21** — деплой на Vercel (10–15 минут)
- **22** — хоткеи (⌘N, ⌘1–3)
- **23** — архив задач
- **24** — мелкий realtime-polish

скажи номер — идём дальше.
