# Research: Healthcare Staff Management Platform

**Date**: 2025-01-27  
**Feature**: Healthcare Staff Management Platform  
**Purpose**: Understand domain and technology considerations for scheduling, compliance, and communications for healthcare staff.

## Key Questions

1. How do modern healthcare scheduling systems model staff, shifts, and assignments?  
2. What are common patterns for credential/compliance tracking (licenses, expirations)?  
3. How should notifications and acknowledgements be modeled for staff communications?  
4. How can we design the frontend to work with a mock data layer now and a real API later?  

## Findings

### 1. Scheduling and Assignments

**Decision**: Model scheduling with `Staff`, `Shift`, and `Assignment` entities, plus `Unit/Facility` for grouping.  

**Rationale**:
- Aligns with common healthcare scheduling products (Kronos, Shiftboard, etc.).  
- Separating `Assignment` from `Shift` and `Staff` allows history, status changes, and conflict flags.  
- Enables flexible views: by staff, by unit, by time range.  

**Alternatives Considered**:
- Embedding staff arrays inside Shift only: simpler but harder to track history and statuses.  
- Modeling by “rota/roster” documents: heavier, less flexible for the initial scope.  

### 2. Credential and Compliance Tracking

**Decision**: Use a `Credential` entity linked to `Staff` with type, issue/expiry, and status.  

**Rationale**:
- Typical healthcare compliance requires license and certification tracking per staff member.  
- Explicit entity allows logic to block assignments and generate alerts.  
- Supports multiple credentials per staff (RN license, ACLS, etc.).  

**Alternatives Considered**:
- Embedding simple credential fields in Staff: would not scale to multiple credentials or complex rules.  

### 3. Notifications and Audit Trail

**Decision**: Use a `Notification` entity with type, recipients, channel, and acknowledgement status.  

**Rationale**:
- Supports future multi-channel communications (in-app, email, SMS via integrations).  
- Audit trail of what was sent, to whom, and whether they acknowledged.  

**Alternatives Considered**:
- Only storing changes on shifts and not separate notifications: makes auditing user communications harder.  

### 4. Frontend Architecture

**Decision**: Implement as a feature module under `src/components/staff/` with:  
- `scheduling/` views (roster, shift detail)  
- `compliance/` views (credentials dashboard)  
- `communications/` views (inbox/broadcast UI)  

Use mock data/services in `src/lib/api/staff` that can later be replaced with real API clients.

**Rationale**:
- Keeps staff-specific logic contained and testable.  
- Mirrors entity structure used in the spec.  
- Works well with existing React + TypeScript + Tailwind + shadcn/ui stack.  

### 5. Testing Approach

**Decision**:  
- Unit tests for scheduling/compliance logic (conflict detection, credential checks).  
- Integration tests for key user journeys (create shift, assign staff, block expired credential, send broadcast).  

**Rationale**:
- Matches constitution requirements (80% unit, 60% integration).  
- Ensures core business rules are well-covered.  

## Summary

The platform will be implemented as a staff-focused feature module on top of the existing React/TypeScript frontend, with clear entities and testable business rules for scheduling, compliance, and communications. A mock data layer will be used initially, with a clean path to integration with real APIs.


