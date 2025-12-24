# Data Model: Healthcare Staff Management Platform

**Date**: 2025-01-27  
**Feature**: Healthcare Staff Management Platform

## Entities

### Staff

- **id** (string): Unique staff identifier.  
- **name** (string): Full name.  
- **role** (string): Role (e.g., RN, MD, LPN, CNA).  
- **specialty** (string): Clinical specialty (e.g., ICU, ER).  
- **contact** (object): Email, phone, preferred channel.  
- **availability** (rules): General availability pattern (days, times).  
- **timeOff** (list): Approved time-off periods.  

### Shift

- **id** (string): Unique shift identifier.  
- **unitId** (string): Reference to Unit/Facility.  
- **start** (datetime): Shift start time.  
- **end** (datetime): Shift end time.  
- **requiredRoles** (list): Roles/skills required (e.g., 2x RN, 1x MD).  
- **status** (enum): `open`, `partially_filled`, `filled`, `cancelled`.  

### Assignment

- **id** (string): Unique assignment id.  
- **shiftId** (string): Reference to Shift.  
- **staffId** (string): Reference to Staff.  
- **status** (enum): `proposed`, `assigned`, `confirmed`, `declined`, `cancelled`.  
- **conflicts** (list): Conflict codes (overlap, overtime, credential_issue).  
- **createdAt** (datetime).  

### Credential

- **id** (string): Unique credential id.  
- **staffId** (string): Reference to Staff.  
- **type** (string): License/certification type (e.g., RN license, ACLS).  
- **issuedAt** (date).  
- **expiresAt** (date).  
- **status** (enum): `active`, `expiring_soon`, `expired`.  
- **requiredForRoles** (list): Roles or units that require this credential.  

### Notification

- **id** (string).  
- **type** (enum): `shift_change`, `open_shift`, `credential_alert`.  
- **payload** (object): Context data (shift id, staff ids, credential id).  
- **recipients** (list): Staff ids.  
- **channel** (enum): `in_app`, `email`, `sms` (future).  
- **sentAt** (datetime).  
- **acknowledgedBy** (list): Staff ids with timestamps.  

### Unit/Facility

- **id** (string).  
- **name** (string).  
- **type** (string): e.g., ICU, ER, Med-Surg.  
- **minStaffing** (rules): Min counts per role.  
- **escalationRules** (rules): Who to notify when under-staffed.  

## Relationships

- Staff 1–N Assignments  
- Shift 1–N Assignments  
- Staff 1–N Credentials  
- Unit 1–N Shifts  
- Notification N–N Staff (via recipients and acknowledgements)  

## Validation Rules

- Assignment must reference existing Staff and Shift.  
- Shift `end` must be after `start`.  
- Credentials must have `expiresAt` ≥ `issuedAt`.  
- Assignment only valid if required credentials are `active`.  
- No overlapping assignments for the same Staff when `status` in (`assigned`, `confirmed`).  


