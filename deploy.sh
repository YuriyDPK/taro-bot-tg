#!/bin/bash

# Переходим в директорию проекта
cd /var/www/botlikeauto

# Выполняем git pull
echo "Pulling the latest changes from the repository..."
git pull origin dev  # Замените 'main' на нужную вам ветку, если необходимо

# Останавливаем и удаляем существующий контейнер
echo "Stopping and removing the existing Docker container..."
docker stop botlikeauto || true
docker rm botlikeauto || true

# Собираем новый образ
echo "Building the Docker image..."
docker build -t botlikeauto .

# Запускаем новый контейнер
echo "Starting the Docker container..."
docker run -d -p 8376:3000 --name botlikeauto botlikeauto

echo "Deployment successful!" 