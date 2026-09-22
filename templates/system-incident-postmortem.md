---
id: system-incident-postmortem
name: System Incident Postmortem Template
description: Standardized blameless incident postmortem template covering timeline, root cause, impact, and preventive action items.
type: template
tags: [template, postmortem, incident, sre, devops, engineering]
author: community
version: 1.0.0
verified: false
---

# [INCIDENT-ID] Postmortem: [Brief Incident Summary]

**Incident Date:** YYYY-MM-DD  
**Incident Commander:** @incident-commander  
**Investigators:** @lead-sre, @backend-lead  
**Severity Level:** SEV-1 / Critical  
**Impact Window:** HH:MM UTC to HH:MM UTC (Total Duration: X hours, Y minutes)  

---

## 1. Executive Summary
Brief non-technical overview summarizing customer impact, financial loss (if any), and core root cause.

## 2. Customer & Business Impact
- **Services Affected:** e.g., Authentication, Checkout, Real-time Sync
- **Total Impacted Users:** X% of active users (or total count)
- **Error Rate Peak:** HTTP 500 rate reached XX.X% at HH:MM UTC
- **Support Tickets Generated:** XXX tickets

## 3. Incident Timeline (All times in UTC)
| Timestamp (UTC) | Event / Discovery / Action | Actor |
| :--- | :--- | :--- |
| **14:02** | Automated Canary deployment of service v2.4.1 begins. | CI/CD |
| **14:08** | PagerDuty fires high memory utilization alert on primary replica. | Monitoring |
| **14:15** | Incident triage channel opened; rollback initiated. | @commander |
| **14:24** | Rollback stalled due to database schema lock contention. | @db-admin |
| **14:38** | Lock forcibly cleared; service traffic redirected to standby cluster. | @lead-sre |
| **14:45** | Latency and error rates return to normal baseline. Incident mitigated. | @commander |

## 4. Root Cause Analysis
Explain the technical failure mechanism in detail. Why did the system fail? Why was the failure not caught in staging? What latent condition contributed to the failure?

### 5-Whys Breakdown
1. *Why did service latency spike?* -> Connection pool was exhausted.
2. *Why was the connection pool exhausted?* -> Unindexed query locked the user accounts table.
3. *Why was the unindexed query executed?* -> New billing feature introduced a join without index migration.
4. *Why did staging tests not catch the missing index?* -> Staging database had only 200 rows, masking table scan performance.
5. *Why was staging data not representative?* -> Data synthesis pipeline had not been updated for the billing service.

## 5. What Went Well & Where We Got Lucky
- Alerting triggered within 6 minutes of the canary deployment.
- Failover runbook for standby cluster executed without data loss.

## 6. Where We Need Improvement
- Rollback was delayed by 14 minutes due to lack of automated lock timeout.
- Synthetic load test harness omitted the new billing endpoints.

## 7. Action Items & Remediation Backlog
| ID | Action Item | Priority | DRI / Owner | Target Completion | Jira / GitHub Issue |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **ACT-01** | Add strict lock timeout (5s) to all database migration scripts. | P0 | @db-admin | 2026-09-25 | #4012 |
| **ACT-02** | Update staging synthetic data pipeline to mirror production table volume. | P1 | @qa-lead | 2026-10-02 | #4013 |
| **ACT-03** | Introduce automated EXPLAIN ANALYZE checks in PR CI pipeline. | P2 | @infra-team | 2026-10-15 | #4014 |
