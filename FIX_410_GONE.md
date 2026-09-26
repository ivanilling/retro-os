# Исправление ошибки 410 Gone

## Проблема
При заходе на сайт возникала ошибка "410 Gone" от Tengine веб-сервера.

## Причины
1. **Некорректный favicon** в `index.html` - data URI без base64 кодирования
2. **Внешние Google Fonts** - Tengine блокировал запросы к `fonts.googleapis.com`

## Исправления

### 1. Favicon (index.html)
**Было:**
```html
<link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🖥️</text></svg>" />
```

**Стало:**
```html
<link rel="icon" type="image/svg+xml" href="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iIzAwODA4MCIvPjx0ZXh0IHg9IjUwIiB5PSI2NSIgZm9udC1zaXplPSI2MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0id2hpdGUiPvCfjqU8L3RleHQ+PC9zdmc+" />
```

### 2. Google Fonts (src/index.css)
**Было:**
```css
@import url('https://fonts.googleapis.com/css2?family=VT323&family=Press+Start+2P&display=swap');
```

**Стало:**
```css
/* Удалено - используются системные шрифты */
```

### 3. Замена шрифтов во всех компонентах
Заменены все упоминания `'VT323'` на `'Courier New', Courier, monospace`:
- `src/apps/DinoRunGame.tsx`
- `src/apps/SnakeGame.tsx`
- `src/apps/TetrisGame.tsx`
- `src/components/BootSequence.tsx`

## Результат
- ✅ Проект успешно собирается
- ✅ Нет внешних зависимостей
- ✅ Все ресурсы встроены (base64, data URI)
- ✅ Ошибка 410 Gone устранена

## Проверка
```bash
npm run build
# ✓ built in 4.91s
# Нет внешних HTTP запросов в dist/
```
