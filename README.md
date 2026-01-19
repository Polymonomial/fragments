# Fragments

Fragments is a backend REST API for creating, storing, retrieving, updating, and deleting small pieces of content (“fragments”).  
It is designed as a **cloud-ready, containerized service** with authentication, multiple content types, and pluggable storage backends.

This project demonstrates backend API design, authentication, containerization, and cloud-deployment readiness.

---

## Features

- Authenticated fragment creation and management
- Supports multiple content types (text, JSON, binary)
- Fragment metadata and raw data retrieval
- Update and delete existing fragments
- Storage abstraction (local or cloud-based)
- Container-first architecture
- Environment-based configuration
- Connects to AWS S3 and DynamoDB via API (No longer working, AWS student account out of funds)

---

## Tech Stack

**Backend**
- Node.js
- Express
- RESTful API design

**Infrastructure**
- Docker
- Docker Compose

**Storage**
- Local filesystem (development)
- Cloud object storage (production-ready)

**Authentication**
- Environment-configurable authentication strategy
- Designed to support hosted identity providers

---

## API Overview

All routes are authenticated.

```http
# Health check
GET /v1/health

# --------------------
# GET methods
# --------------------

# List fragments (IDs by default)
GET /v1/fragments

# Get fragment data by id
GET /v1/fragments/:id

# Get fragment metadata by id
GET /v1/fragments/:id/info

# --------------------
# POST methods
# --------------------

# Create a new fragment (raw body)
POST /v1/fragments
Content-Type: <mime-type>

<raw fragment data>

# --------------------
# PUT methods
# --------------------

# Update an existing fragment (raw body)
PUT /v1/fragments/:id
Content-Type: <mime-type>

<raw fragment data>

# --------------------
# DELETE methods
# --------------------

# Delete a fragment
DELETE /v1/fragments/:id
