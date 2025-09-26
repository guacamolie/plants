#!/usr/bin/env bash
set -euo pipefail
PROFILE="proxy"
if [ "${ENABLE_INTERNAL_PROXY:-true}" != "true" ]; then
  PROFILE="no-proxy"
fi
echo "Starting with compose profile: $PROFILE"
docker compose --profile "$PROFILE" up --build