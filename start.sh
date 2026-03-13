#!/bin/bash

echo "🚀 Iniciando Glosario App..."
echo ""

if ! command -v docker-compose &> /dev/null; then
    echo "❌ Error: docker-compose no está instalado"
    exit 1
fi

echo "📦 Iniciando servicios..."
docker-compose up -d

echo ""
echo "⏳ Esperando a que la base de datos esté lista..."
sleep 10

echo ""
echo "🔧 Ejecutando migraciones..."
docker-compose exec -T backend bun run db:migrate || true

echo ""
echo "👤 Creando usuario administrador..."
docker-compose exec -T backend bun run src/scripts/create-admin.ts || true

echo ""
echo "✅ Glosario App está listo!"
echo ""
echo "📚 Glosario público: http://localhost:4321"
echo "🔐 Panel admin:      http://localhost:4321/admin"
echo "📡 API:              http://localhost:3000"
echo ""
echo "Credenciales por defecto:"
echo "  Email:    admin@glosario.com"
echo "  Password: admin123"