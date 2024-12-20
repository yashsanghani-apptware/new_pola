{
  "$id": "https://api.pola.dev/v2.5.3.2/agsiri/actor/v2.5/actor.schema.json",
  "$schema": "http://json-schema.org/draft-07/schema#",
  "definitions": {
    "pola.actor.v2.5.Address": {
      "type": "object",
      "properties": {
        "streetAddress": { "type": "string" },
        "addressLocality": { "type": "string" },
        "addressRegion": { "type": "string" },
        "postalCode": { "type": "string" },
        "addressCountry": { "type": "string" }
      },
      "required": ["streetAddress", "addressLocality", "addressRegion", "postalCode", "addressCountry"],
      "additionalProperties": false
    },
    "pola.actor.v2.5.ContactPoint": {
      "type": "object",
      "properties": {
        "telephone": { "type": "string" },
        "contactType": { "type": "string" },
        "email": { 
          "type": "string", 
          "format": "email" 
        }
      },
      "required": ["telephone", "contactType", "email"],
      "additionalProperties": false
    },
    "pola.actor.v2.5.User": {
      "type": "object",
      "properties": {
        "id": { "type": "string", "pattern": "^[a-f\\d]{24}$" },
        "name": { "type": "string" },
        "givenName": { "type": "string" },
        "familyName": { "type": "string" },
        "email": { 
          "type": "string", 
          "format": "email" 
        },
        "telephone": { "type": "string" },
        "jobTitle": { "type": "string" },
        "username": { "type": "string" },
        "password": { "type": "string" },
        "address": { 
          "$ref": "#/definitions/pola.actor.v2.5.Address" 
        },
        "contactPoint": { 
          "$ref": "#/definitions/pola.actor.v2.5.ContactPoint" 
        },
        "groups": { 
          "type": "array", 
          "items": { "type": "string", "pattern": "^[a-f\\d]{24}$" }
        },
        "roles": { 
          "type": "array", 
          "items": { "type": "string", "pattern": "^[a-f\\d]{24}$" }
        },
        "policies": { 
          "type": "array", 
          "items": { "type": "string", "pattern": "^[a-f\\d]{24}$" }
        },
        "organization": { "type": "string", "pattern": "^[a-f\\d]{24}$" },
        "attr": { 
          "type": "object", 
          "additionalProperties": { "type": "string" }
        }
      },
      "required": ["id", "name", "givenName", "familyName", "email", "telephone", "username", "password", "contactPoint"],
      "additionalProperties": false
    },
    "pola.actor.v2.5.Group": {
      "type": "object",
      "properties": {
        "id": { "type": "string", "pattern": "^[a-f\\d]{24}$" },
        "name": { "type": "string" },
        "description": { "type": "string" },
        "memberOf": { "type": ["string", "null"], "pattern": "^[a-f\\d]{24}$" },
        "members": {
          "type": "array",
          "items": { 
            "type": "object",
            "properties": {
              "id": { "type": "string", "pattern": "^[a-f\\d]{24}$" },
              "onModel": { 
                "type": "string", 
                "enum": ["User", "Group"] 
              }
            },
            "required": ["id", "onModel"],
            "additionalProperties": false
          }
        },
        "roles": { 
          "type": "array", 
          "items": { "type": "string", "pattern": "^[a-f\\d]{24}$" }
        },
        "policies": { 
          "type": "array", 
          "items": { "type": "string", "pattern": "^[a-f\\d]{24}$" }
        },
        "organization": { "type": ["string", "null"], "pattern": "^[a-f\\d]{24}$" }
      },
      "required": ["id", "name", "members"],
      "additionalProperties": false
    },
    "pola.actor.v2.5.Role": {
      "type": "object",
      "properties": {
        "id": { "type": "string", "pattern": "^[a-f\\d]{24}$" },
        "name": { "type": "string" },
        "description": { "type": "string" },
        "inheritsFrom": { 
          "type": "array", 
          "items": { "type": "string", "pattern": "^[a-f\\d]{24}$" }
        },
        "policies": { 
          "type": "array", 
          "items": { "type": "string", "pattern": "^[a-f\\d]{24}$" }
        },
        "organization": { "type": ["string", "null"], "pattern": "^[a-f\\d]{24}$" }
      },
      "required": ["id", "name"],
      "additionalProperties": false
    },
    "pola.actor.v2.5.Resource": {
      "type": "object",
      "properties": {
        "id": { "type": "string", "pattern": "^[a-f\\d]{24}$" },
        "typeName": { 
          "type": "string", 
          "pattern": "^[a-zA-Z0-9_-]{2,64}::[a-zA-Z0-9_-]{2,64}::[a-zA-Z0-9_-]{2,64}$" 
        },
        "name": { "type": "string" },
        "ari": { "type": "string" },
        "description": { "type": "string" },
        "sourceUrl": { "type": "string", "format": "uri" },
        "documentationUrl": { "type": "string", "format": "uri" },
        "replacementStrategy": { 
          "type": "string", 
          "enum": ["create_then_delete", "delete_then_create"] 
        },
        "tagging": {
          "type": "object",
          "properties": {
            "taggable": { "type": "boolean" },
            "tagOnCreate": { "type": "boolean" },
            "tagUpdatable": { "type": "boolean" },
            "tagProperty": { "type": "string" }
          },
          "additionalProperties": false
        },
        "properties": { 
          "type": "object", 
          "additionalProperties": { "type": "string" }
        },
        "required": { 
          "type": "array", 
          "items": { "type": "string" }
        },
        "primaryIdentifier": { 
          "type": "array", 
          "items": { "type": "string" }
        },
        "policies": { 
          "type": "array", 
          "items": { "type": "string", "pattern": "^[a-f\\d]{24}$" }
        },
        "auditInfo": {
          "type": "object",
          "properties": {
            "createdBy": { "type": "string" },
            "createdAt": { "type": "string", "format": "date-time" },
            "updatedBy": { "type": "string" },
            "updatedAt": { "type": "string", "format": "date-time" }
          },
          "additionalProperties": false
        }
      },
      "required": ["id", "typeName", "ari", "description", "properties", "required", "primaryIdentifier"],
      "additionalProperties": false
    },
    "pola.actor.v2.5.Organization": {
      "type": "object",
      "properties": {
        "name": { "type": "string" },
        "url": { "type": "string", "format": "uri" },
        "logo": { "type": "string", "format": "uri" },
        "sameAs": { "type": "string", "format": "uri" },
        "description": { "type": "string" },
        "taxID": { "type": "string" },
        "telephone": { "type": "string" },
        "location": { 
          "$ref": "#/definitions/pola.actor.v2.5.Address" 
        },
        "legalName": { "type": "string" },
        "contactPoint": { 
          "$ref": "#/definitions/pola.actor.v2.5.ContactPoint" 
        },
        "policies": { 
          "type": "array", 
          "items": { "type": "string", "pattern": "^[a-f\\d]{24}$" }
        },
        "variables": { 
          "type": "array", 
          "items": { "type": "string", "pattern": "^[a-f\\d]{24}$" }
        }
      },
      "required": ["name", "url", "description", "telephone", "location", "legalName", "contactPoint"],
      "additionalProperties": false
    },
    "pola.actor.v2.5.Fact": {
      "type": "object",
      "properties": {
        "id": { "type": "string" },
        "actorId": { "type": "string" },
        "type": { "type": "string" },
        "value": { "type": "string" },
        "timestamp": { "type": "string", "format": "date-time" },
        "source": { 
          "type": "string",
          "enum": ["manual", "sensor", "user-input", "external-service"]
        },
        "confidenceLevel": { 
          "type": "string", 
          "enum": ["high", "medium", "low"]
        },
        "expiresAt": { "type": "string", "format": "date-time" },
        "context": { 
          "$ref": "#/definitions/pola.actor.v2.5.Context"
        },
        "tags": { 
          "type": "array", 
          "items": { "type": "string" }
        },
        "linkedPolicies": { 
          "type": "array", 
          "items": { "type": "string" }
        }
      },
      "required": ["id", "actorId", "type", "value", "timestamp", "source", "confidenceLevel"],
      "additionalProperties": false
    },
    "pola.actor.v2.5.Blacklist": {
      "type": "object",
      "properties": {
        "id": { "type": "string" },
        "actorId": { "type": "string" },
        "reason": { 
          "type": "string",
          "enum": ["security breach", "policy violation", "non-compliance", "fraudulent behavior", "anomaly detection"]
        },
        "actionsRestricted": { 
          "type": "array", 
          "items": { "type": "string" }
        },
        "startTime": { "type": "string", "format": "date-time" },
        "endTime": { "type": "string", "format": "date-time" },
        "source": { 
          "type": "string", 
          "enum": ["system", "user-input", "admin-decision", "third-party"] 
        },
        "severity": { 
          "type": "string", 
          "enum": ["high", "medium", "low"]
        },
        "context": { 
          "$ref": "#/definitions/pola.actor.v2.5.Context"
        },
        "linkedFacts": { 
          "type": "array", 
          "items": { "type": "string" }
        },
        "tags": { 
          "type": "array", 
          "items": { "type": "string" }
        }
      },
      "required": ["id", "actorId", "reason", "actionsRestricted", "startTime", "source", "severity"],
      "additionalProperties": false
    },
    "pola.actor.v2.5.Context": {
      "type": "object",
      "properties": {
        "user": { "$ref": "#/definitions/pola.actor.v2.5.UserContext" },
        "resource": { "$ref": "#/definitions/pola.actor.v2.5.ResourceContext" },
        "environment": { "$ref": "#/definitions/pola.actor.v2.5.EnvironmentContext" },
        "variables": { "$ref": "#/definitions/pola.policy.v2.5.Variables" },
        "policy": { "$ref": "#/definitions/pola.actor.v2.5.PolicyContext" },
        "intent": { "$ref": "#/definitions/pola.actor.v2.5.IntentContext" },
        "interaction": { "$ref": "#/definitions/pola.actor.v2.5.InteractionContext" }
      },
      "additionalProperties": false
    },
    "pola.actor.v2.5.UserContext": {
      "type": "object",
      "properties": {
        "id": { "type": "string" },
        "name": { "type": "string" },
        "role": { "type": "string" },
        "group": { "type": "string" },
        "attr": { 
          "type": "object", 
          "additionalProperties": { "type": "string" }
        }
      },
      "required": ["id", "role"],
      "additionalProperties": false
    },
    "pola.actor.v2.5.ResourceContext": {
      "type": "object",
      "properties": {
        "ari": { "type": "string" },
        "id": { "type": "string" },
        "type": { "type": "string" },
        "name": { "type": "string" },
        "location": { "type": "string" },
        "tags": { 
          "type": "object", 
          "additionalProperties": { "type": "string" }
        },
        "attr": { 
          "type": "object", 
          "additionalProperties": { "type": "string" }
        }
      },
      "required": ["ari", "id", "type"],
      "additionalProperties": false
    },
    "pola.actor.v2.5.EnvironmentContext": {
      "type": "object",
      "properties": {
        "timestamp": { "type": "string", "format": "date-time" },
        "region": { "type": "string" },
        "ip": { "type": "string" },
        "os": { "type": "string" },
        "device": { "type": "string" },
        "attr": { 
          "type": "object", 
          "additionalProperties": { "type": "string" }
        }
      },
      "required": ["timestamp"],
      "additionalProperties": false
    },
    "pola.actor.v2.5.IntentContext": {
      "type": "object",
      "properties": {
        "objective": { "type": "string" },
        "action": { "type": "string" },
        "attr": { 
          "type": "object", 
          "additionalProperties": { "type": "string" }
        }
      },
      "required": ["objective", "action"],
      "additionalProperties": false
    },
    "pola.actor.v2.5.InteractionContext": {
      "type": "object",
      "properties": {
        "id": { "type": "string" },
        "type": { "type": "string" },
        "channel": { "type": "string" },
        "timestamp": { "type": "string", "format": "date-time" },
        "attr": { 
          "type": "object", 
          "additionalProperties": { "type": "string" }
        }
      },
      "required": ["id", "type", "timestamp"],
      "additionalProperties": false
    },
    "pola.actor.v2.5.PolicyContext": {
      "type": "object",
      "properties": {
        "id": { "type": "string" },
        "name": { "type": "string" },
        "version": { "type": "string" },
        "attr": { 
          "type": "object", 
          "additionalProperties": { "type": "string" }
        }
      },
      "required": ["id"],
      "additionalProperties": false
    }
  },
  "type": "object",
  "properties": {
    "user": { "$ref": "#/definitions/pola.actor.v2.5.User" },
    "group": { "$ref": "#/definitions/pola.actor.v2.5.Group" },
    "role": { "$ref": "#/definitions/pola.actor.v2.5.Role" },
    "resource": { "$ref": "#/definitions/pola.actor.v2.5.Resource" },
    "organization": { "$ref": "#/definitions/pola.actor.v2.5.Organization" },
    "fact": { "$ref": "#/definitions/pola.actor.v2.5.Fact" },
    "blacklist": { "$ref": "#/definitions/pola.actor.v2.5.Blacklist" },
    "context": { "$ref": "#/definitions/pola.actor.v2.5.Context" }
  },
  "oneOf": [
    { "required": ["user"] },
    { "required": ["group"] },
    { "required": ["role"] },
    { "required": ["resource"] },
    { "required": ["organization"] },
    { "required": ["fact"] },
    { "required": ["blacklist"] }
  ],
  "additionalProperties": false
}

