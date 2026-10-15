#!/bin/sh
# Deploy to BOTH Pages repos (main game = realm). Normal pushes only, never force.
set -e
git push origin HEAD:main
git push realm HEAD:main
