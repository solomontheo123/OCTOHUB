# OCTOHUB Architecture

## Core Philosophy

Git is the immutable data engine.
Everything else is orchestration around Git objects.

---

## Primary Stack

### Frontend

* Next.js
* TypeScript
* TailwindCSS

### Backend

* Django
* Django REST Framework

### Database

* Neon PostgreSQL

### Async Infrastructure

* Redis
* Celery

### Git Layer

* Native Git CLI
* Bare repositories

---

## Core Infrastructure Components

### API Layer

Handles:

* authentication
* repositories
* pull requests
* permissions

### Git Storage Layer

Stores:

* bare repositories
* packfiles
* refs
* Git objects

### Async Event System

Handles:

* webhooks
* indexing
* notifications
* CI jobs

---

## Repository Storage Strategy

Repositories stored at:

/srv/octohub/repos/<owner>/<repo>.git

Git acts as the immutable storage engine.

---

## Long-Term Infrastructure Goals

* Distributed repository storage
* Search indexing
* CI/CD orchestration
* SSH transport
* Horizontal scalability
