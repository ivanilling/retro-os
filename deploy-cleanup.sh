#!/bin/bash
# Скрипт для полной очистки и переразвёртывания Retro OS

echo "🧹 Очистка старых файлов..."

# Удалите все файлы в папке сайта (замените /path/to/your/site на реальный путь)
SITE_DIR="/var/www/retro-os"  # ИЗМЕНИТЕ НА ВАШ ПУТЬ

# Создайте резервную копию
BACKUP_DIR="/tmp/retro-os-backup-$(date +%Y%m%d-%H%M%S)"
echo "📦 Создание резервной копии в $BACKUP_DIR..."
sudo mkdir -p $BACKUP_DIR
sudo cp -r $SITE_DIR/* $BACKUP_DIR/ 2>/dev/null || true

# Очистите папку сайта
echo "🗑️  Удаление старых файлов..."
sudo rm -rf $SITE_DIR/*
sudo rm -rf $SITE_DIR/.htaccess
sudo rm -rf $SITE_DIR/.well-known

# Скопируйте новые файлы
echo "📤 Копирование новых файлов..."
sudo cp -r dist/* $SITE_DIR/
sudo cp dist/.htaccess $SITE_DIR/ 2>/dev/null || true

# Установите правильные права
echo "🔐 Настройка прав доступа..."
sudo chown -R www-data:www-data $SITE_DIR
sudo chmod -R 755 $SITE_DIR

# Очистите кэш Nginx/Tengine
echo "🧹 Очистка кэша сервера..."
sudo rm -rf /var/cache/nginx/*
sudo rm -rf /var/cache/tengine/*

# Перезагрузите Nginx
echo "🔄 Перезагрузка Nginx..."
sudo nginx -t && sudo systemctl reload nginx

echo "✅ Готово! Сайт обновлён."
echo "💾 Резервная копия сохранена в: $BACKUP_DIR"
