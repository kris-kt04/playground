#!/bin/sh
# Minimal entrypoint used by devcontainer tooling when present.
# It forwards arguments to the container's command so containers with
# JSON-array `CMD` or compose `command` behave the same.
sudo service postgresql start
# Wait for PostgreSQL to be ready (optional, but recommended)
until pg_isready -U postgres; do
  echo "Waiting for PostgreSQL to start..."
  sleep 1
done

set -e

if [ "$#" -eq 0 ]; then
  # No args: sleep to keep container alive (works with compose/CMD)
  exec sleep infinity
fi

exec "$@"
