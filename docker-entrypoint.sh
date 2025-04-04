#!/bin/sh
set -e

# Check for required environment variables
if [ -z "$BASE_URL" ]; then
  echo "WARNING: BASE_URL is not set!"
fi
if [ -z "$HISTORY_TOKEN_ID" ] || [ -z "$HISTORY_TOKEN" ]; then
  echo "WARNING: HISTORY_TOKEN_ID or HISTORY_TOKEN is not set!"
fi
if [ -z "$TOKEN_ID" ] || [ -z "$TOKEN" ]; then
  echo "WARNING: TOKEN_ID or TOKEN is not set!"
fi

# Ensure the client directory exists
mkdir -p /app/build/client/

# Generate runtime config.js with environment variables
cat > /app/build/client/config.js << EOF
window.RUNTIME_CONFIG = {
  BASE_URL: "${BASE_URL}",
  HISTORY_TOKEN_ID: "${HISTORY_TOKEN_ID}",
  HISTORY_TOKEN: "${HISTORY_TOKEN}",
  TOKEN_ID: "${TOKEN_ID}",
  TOKEN: "${TOKEN}",
  USER_ID: "${USER_ID}",
  FAXLINE_ID: "${FAXLINE_ID}"
};
EOF

# Print confirmation (for debugging)
echo "Runtime config generated successfully in /app/build/client/config.js"

# Execute the main container command
exec "$@"