# OCTOHUB System Design Specification

# SYSTEM PHILOSOPHY

OCTOHUB is architected as:

> a distributed orchestration platform around immutable Git objects.

Git itself acts as:

* the storage engine
* the versioning engine
* the object graph engine

The platform layers above Git provide:

* collaboration
* permissions
* orchestration
* indexing
* automation
* visualization

---

# HIGH-LEVEL ARCHITECTURE

```text
Frontend Client (Next.js)
        ↓
API Gateway (NGINX)
        ↓
Django API Layer
        ↓
------------------------------------------------
| PostgreSQL | Redis | Celery | Git Services |
------------------------------------------------
        ↓
Linux Repository Storage Fabric
```

---

# CORE INFRASTRUCTURE COMPONENTS

# 1. FRONTEND CLIENT LAYER

## Technology

* Next.js
* TypeScript
* TailwindCSS

## Responsibilities

* Render repository UI
* Render pull requests
* Render diffs and blame views
* Manage authentication state
* Consume REST APIs
* Handle optimistic UI updates

## Architectural Notes

Frontend remains stateless.
All persistent state resides in backend services.

---

# 2. API GATEWAY LAYER

## Technology

* NGINX
* Traefik (future option)

## Responsibilities

* TLS termination
* Reverse proxy routing
* Rate limiting
* WebSocket proxying
* Static asset delivery

---

# 3. DJANGO API LAYER

## Technology

* Django
* Django REST Framework

## Responsibilities

* Authentication
* Authorization
* Repository metadata management
* Pull request orchestration
* Team/org management
* Webhook management
* Git process orchestration

## Architectural Principle

Django does NOT store repository contents.
Git repositories remain filesystem-native.

---

# 4. DATABASE LAYER

## Technology

* Neon PostgreSQL

## Responsibilities

* Users
* Organizations
* Teams
* Repository metadata
* Pull requests
* Comments
* Permissions
* Webhook configs

## Does NOT Store

* Git blobs
* Trees
* Packfiles
* Raw repository objects

Git handles those directly.

---

# 5. REDIS LAYER

## Responsibilities

* Session caching
* Rate limiting
* Async queue buffering
* Repository metadata caching
* Temporary merge state caching

---

# 6. CELERY WORKER LAYER

## Responsibilities

* Webhook dispatch
* Search indexing
* Notification delivery
* Background Git processing
* CI orchestration
* Repository scanning

## Design Principle

Heavy workloads should never block API requests.

---

# 7. GIT STORAGE LAYER

# Repository Structure

```text
/srv/octohub/repos/<owner>/<repo>.git
```

## Repository Type

Bare repositories only.

## Git Operations

* git init --bare
* git clone
* git push
* git fetch
* git merge
* git blame
* git cat-file
* git rev-parse

---

# AUTHENTICATION SYSTEM

# USER LOGIN FLOW

## Phase 1

User submits credentials via frontend.

## Phase 2

Django validates credentials.

## Phase 3

Password verified using Argon2id.

## Phase 4

JWT access token issued.

## Phase 5

Refresh token persisted securely.

## Phase 6

Redis mirrors session metadata.

---

# SSH AUTHORIZATION FLOW

## Phase 1 — SSH Key Registration

User uploads:

* ED25519 key
* RSA key

## Phase 2 — Fingerprint Validation

Django validates:

* format
* duplication
* ownership

## Phase 3 — Forced Command Registration

Authorized key written into:

```text
/home/git/.ssh/authorized_keys
```

Wrapped using:

```text
command="/srv/octohub/auth/git-auth-gateway"
```

---

# GIT AUTH GATEWAY

# Responsibilities

## Validate

* repository existence
* user permissions
* repo visibility
* branch protections

## Prevent

* shell access
* path traversal
* cross-user access
* malicious repo overwrites

## Allowed Commands

* git-upload-pack
* git-receive-pack

All other commands rejected.

---

# REPOSITORY PROVISIONING FLOW

# Phase 1

User submits repository name.

# Phase 2

Django validates:

* slug uniqueness
* naming rules
* ownership limits

# Phase 3

Database metadata row created.

# Phase 4

Filesystem path generated.

# Phase 5

Git repository initialized:

```bash
git init --bare
```

# Phase 6

Permissions synchronized.

# Phase 7

Repository indexed asynchronously.

---

# GIT PUSH FLOW

# Phase 1

Developer executes:

```bash
git push origin main
```

# Phase 2

SSH authentication occurs.

# Phase 3

git-auth-gateway validates permissions.

# Phase 4

Git packfile streamed to server.

# Phase 5

receive-pack processes refs.

# Phase 6

post-receive hook triggered.

# Phase 7

Async tasks dispatched:

* indexing
* webhook delivery
* notifications
* CI jobs

---

# PULL REQUEST SYSTEM

# PR CREATION FLOW

## Phase 1

User selects:

* source branch
* target branch

## Phase 2

Django calculates:

* commit differences
* merge feasibility

## Phase 3

Dry-run merge executed:

```bash
git merge-tree
```

## Phase 4

Conflict metadata parsed.

## Phase 5

Diffs rendered to frontend.

---

# PR MERGE FLOW

## If Clean

* merge executed
* refs updated
* PR closed
* webhook events dispatched

## If Conflict

* merge blocked
* conflict markers surfaced
* user intervention required

---

# DIFF ENGINE

# Responsibilities

* File diffs
* Split/unified rendering
* Syntax highlighting
* Rename detection
* Whitespace filtering

# Git Commands

* git diff
* git blame
* git log
* git cat-file

---

# SEARCH INFRASTRUCTURE

# Indexing Pipeline

## Trigger Sources

* pushes
* merges
* branch updates

## Workers Parse

* filenames
* symbols
* commit metadata
* repository trees

## Future Expansion

* AST parsing
* semantic search
* symbol graphing

---

# WEBHOOK SYSTEM

# Event Sources

* push
* pull_request
* issue
* release

# Delivery System

* Celery workers
* retry pipelines
* exponential backoff

# Failure Handling

* dead-letter logging
* retry persistence
* webhook diagnostics

---

# SECURITY MODEL

# Core Threats

* shell injection
* malicious packfiles
* symlink attacks
* path traversal
* arbitrary Git execution

# Protections

* forced SSH commands
* sandboxed Git execution
* strict repo path validation
* signed auth flows
* rate limiting

---

# SCALING STRATEGY

# API Layer

Stateless horizontal scaling.

# Repository Layer

Filesystem sharding planned.

# Async Layer

Distributed Celery workers.

# Database Layer

PostgreSQL read replicas.

# Cache Layer

Redis cluster expansion.

---

# OBSERVABILITY

# Metrics

* push latency
* clone latency
* queue depth
* webhook failures

# Logging

* structured JSON logs
* request tracing
* Git operation telemetry

# Monitoring

* API health
* worker health
* storage utilization

---

# LONG-TERM INFRASTRUCTURE GOALS

## Distributed Git Object Storage

* object deduplication
* packfile optimization
* repo sharding

## Advanced CI/CD

* containerized runners
* isolated build execution
* distributed workflow scheduling

## Real-Time Collaboration

* live presence
* collaborative reviews
* streaming notifications

---

# FINAL ARCHITECTURAL PRINCIPLE

OCTOHUB is NOT:

> a CRUD application storing code in a database.

OCTOHUB IS:

> a distributed orchestration platform around native Git internals.
