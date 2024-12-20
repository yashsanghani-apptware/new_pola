curl -X POST http://localhost:4000/v1/policies/evaluate \
-H "Content-Type: application/json" \
-d '{
  "principal": {
    "id": "principal-id", 
    "attributes": {
      "role": "admin",
      "department": "IT"
    }
  },
  "resource": {
    "id": "resource-id", 
    "attributes": {
      "type": "file",
      "location": "internal"
    }
  },
  "action": "read"
}'

