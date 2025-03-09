#!/bin/sh
set -e

echo "Waiting for database to be ready..."
npx wait-on -t 60000 $DATABASE_URL

echo "Applying database migrations..."
npx prisma migrate deploy

# Then run the main container command
exec "$@"
