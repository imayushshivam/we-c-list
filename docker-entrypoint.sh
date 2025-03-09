#!/bin/sh
set -e

# Function to check database connection
check_db_connection() {
  echo "Testing database connection..."
  npx prisma db execute --stdin <<EOF
  SELECT 1;
EOF
  return $?
}

echo "Waiting for database to be ready..."
MAX_RETRIES=5
RETRY_COUNT=0

# Try to connect to the database with retries
while [ $RETRY_COUNT -lt $MAX_RETRIES ]; do
  if check_db_connection; then
    echo "Database connection successful!"
    break
  else
    RETRY_COUNT=$((RETRY_COUNT+1))
    echo "Failed to connect to database. Retry $RETRY_COUNT of $MAX_RETRIES..."
    sleep 10
  fi
  
  if [ $RETRY_COUNT -eq $MAX_RETRIES ]; then
    echo "WARNING: Could not connect to database after $MAX_RETRIES attempts."
    echo "Will try to continue startup anyway..."
  fi
done

# Try to run migrations, but don't fail if they can't be run
echo "Attempting to apply database migrations..."
npx prisma migrate deploy || echo "WARNING: Failed to apply migrations, but continuing startup..."

# Then run the main container command
echo "Starting application..."
exec "$@"
