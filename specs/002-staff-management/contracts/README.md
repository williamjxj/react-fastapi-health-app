# API Contracts: Healthcare Staff Management Platform

**Date**: 2025-01-27  
**Feature**: Healthcare Staff Management Platform

> Note: Initial implementation may use a mock data layer. These contracts describe the intended REST API for a future backend.

## Staff API

- `GET /api/staff` – List staff with filters (role, unit, status).  
- `GET /api/staff/{id}` – Get staff details, availability, and credentials summary.  
- `POST /api/staff` – Create a staff profile.  
- `PATCH /api/staff/{id}` – Update staff profile and preferences.  

## Shift & Assignment API

- `GET /api/shifts` – List shifts by unit, date range, and status.  
- `POST /api/shifts` – Create a shift.  
- `PATCH /api/shifts/{id}` – Update or cancel a shift.  
- `GET /api/shifts/{id}/assignments` – List assignments for a shift.  
- `POST /api/assignments` – Create an assignment (with conflict checks).  
- `PATCH /api/assignments/{id}` – Update assignment status (confirm/decline/cancel).  

## Credential API

- `GET /api/staff/{id}/credentials` – List staff credentials with statuses.  
- `POST /api/staff/{id}/credentials` – Add a credential.  
- `PATCH /api/credentials/{id}` – Update credential details (e.g., expiry).  

## Notification API

- `GET /api/notifications` – List notifications for current user.  
- `POST /api/notifications/broadcast` – Broadcast shift changes or open shifts.  
- `POST /api/notifications/{id}/ack` – Acknowledge a notification.  


