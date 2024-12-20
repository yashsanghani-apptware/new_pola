#!/bin/bash

# Ensure we're in the correct directory, or you can specify one
# cd /path/to/your/directory

# Find all files and replace 'https' with 'http'
find . -type f -exec sed -i '' 's/agsiri\.com:8080:/agsiri\.com:8080/g' {} +

echo "Added port 8080 for local testing of the service"

