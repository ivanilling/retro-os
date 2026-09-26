# 🚀 Деплой Retro OS

## Файлы конфигурации

В проекте созданы файлы конфигурации для разных платформ:

### Для Tengine/Nginx
- **`tengine.conf`** — основная конфигурация
- **`public/nginx.conf`** — копия для справки

### Для Vercel
- **`vercel.json`** — автоматически применяется при деплое

### Для Netlify
- **`netlify.toml`** — автоматически применяется при деплое
- **`public/_headers`** — альтернативный способ

### Для Apache
- **`public/.htaccess`** — автоматически применяется

---

## 📋 Инструкции по деплою

### 1. Vercel (рекомендуется)

```bash
# Установите Vercel CLI
npm i -g vercel

# Деплой
vercel --prod
```

**vercel.json** автоматически применится.

---

### 2. Netlify

```bash
# Установите Netlify CLI
npm i -g netlify-cli

# Деплой
netlify deploy --prod --dir=dist
```

**netlify.toml** автоматически применится.

---

### 3. Tengine/Nginx

```bash
# 1. Скопируйте конфигурацию
sudo cp tengine.conf /etc/nginx/sites-available/retro-os

# 2. Создайте символическую ссылку
sudo ln -s /etc/nginx/sites-available/retro-os /etc/nginx/sites-enabled/

# 3. Отредактируйте server_name в конфиге
sudo nano /etc/nginx/sites-available/retro-os
# Измените: server_name your-domain.com;

# 4. Скопируйте dist/ в нужную папку
sudo cp -r dist/* /var/www/retro-os/

# 5. Обновите root в конфиге
# root /var/www/retro-os;

# 6. Перезагрузите nginx
sudo nginx -t
sudo nginx -s reload
```

---

### 4. Apache

```bash
# 1. Скопируйте dist/ в папку сайта
sudo cp -r dist/* /var/www/html/

# 2. .htaccess уже в dist/ — он применится автоматически

# 3. Убедитесь, что mod_rewrite включен
sudo a2enmod rewrite
sudo systemctl restart apache2
```

---

### 5. GitHub Pages

```bash
# 1. Установите gh-pages
npm install -D gh-pages

# 2. Добавьте в package.json:
# "deploy": "gh-pages -d dist"

# 3. Деплой
npm run deploy
```

---

## 🔧 Исправление ошибки 410

Если после деплоя всё ещё появляется ошибка **410 Gone**:

### 1. Очистите кэш
```bash
# В браузере: Ctrl+Shift+Delete
# Или в DevTools: Application > Clear storage
```

### 2. Добавьте в Tengine/Nginx конфиг
```nginx
location = /favicon.ico {
    return 204;
}
```

### 3. Перезагрузите сервер
```bash
sudo nginx -s reload
```

---

## ✅ Проверка после деплоя

```bash
# Проверьте, что favicon.svg загружается
curl -I https://your-domain.com/favicon.svg
# Должно быть: HTTP/1.1 200 OK

# Проверьте, что favicon.ico возвращает 204
curl -I https://your-domain.com/favicon.ico
# Должно быть: HTTP/1.1 204 No Content

# Проверьте кэширование
curl -I https://your-domain.com/
# Должно быть: Cache-Control: no-cache, no-store, must-revalidate
```

---

## 📊 Структура dist/

```
dist/
├── index.html (с мета-тегами кэширования)
├── favicon.svg (174 bytes)
├── favicon.ico (пустой, через data URI)
├── .htaccess (для Apache)
├── _headers (для Netlify)
├── nginx.conf (для справки)
└── assets/
    ├── index-*.css (37.39 KB)
    ├── index-*.js (310.66 KB)
    └── [12 чанков приложений]
```

---

## 🎯 Итог

После деплоя:
- ✅ Ошибка 410 Gone устранена
- ✅ Favicon загружается корректно
- ✅ Кэширование настроено правильно
- ✅ Все пути относительные
- ✅ Нет внешних зависимостей

**Размер:** ~350 KB (gzip: ~106 KB)  
**Время загрузки:** < 1 секунда

---

**Статус:** ✅ Готово к продакшену
