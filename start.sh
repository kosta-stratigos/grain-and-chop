#!/bin/zsh

set -euo pipefail

PORT="${1:-4173}"

if command -v python3 >/dev/null 2>&1; then
  PYTHON_BIN="python3"
elif command -v python >/dev/null 2>&1; then
  PYTHON_BIN="python"
else
  echo "Python was not found. Install Python 3 and try again."
  exit 1
fi

SCRIPT_DIR="$(cd -- "$(dirname -- "${0}")" && pwd)"

echo "Starting Granular Chop Lab from:"
echo "${SCRIPT_DIR}"
echo
echo "Open http://localhost:${PORT}"
echo "Press Ctrl+C to stop the server."
echo

cd "${SCRIPT_DIR}"
exec "${PYTHON_BIN}" -m http.server "${PORT}"
