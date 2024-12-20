#!/bin/bash

# Define the URL for the Schema Registry
SCHEMA_REGISTRY_URL="http://localhost:8080/v1/schemas"

# Find all JSON files in the current directory and subdirectories
find . -name "*.json" | while read -r file; do
  echo "Loading schema from: $file"
  
  # Execute the curl command to upload the schema
  curl -X POST "$SCHEMA_REGISTRY_URL" \
  -H "Content-Type: application/json" \
  -d @"$file"

  # Check the exit status of the curl command
  if [ $? -eq 0 ]; then
    echo "Successfully loaded $file"
  else
    echo "Failed to load $file"
  fi
done

