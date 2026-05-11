#!/bin/sh
set -eu

cat > /usr/share/nginx/html/env-config.js <<EOF
window.__APP_CONFIG__ = {
  VITE_API_URL: "${VITE_API_URL:-}",
  VITE_ADMIN_PASSCODE: "${VITE_ADMIN_PASSCODE:-}",
};
EOF
