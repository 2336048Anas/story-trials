# Synthetic Data Policy

## ⚠️ CRITICAL: This System Uses Synthetic Data Only

This project is designed for **educational and demonstration purposes** using **SYNTHETIC DATA ONLY**. No real patient data, health information, or financial transactions are permitted.

## What This Means

### Data Usage
- All data assets, trials, and submissions are **demonstration records**
- No real patient or health data is processed, stored, or transmitted
- All IPFS content represents synthetic test data

### Payment & Compensation
- All monetary values (`rewardUsd`, `amount`, `currency`) are **mock demonstration values**
- No real financial transactions occur
- Payment/Royalty/Payout models exist to explore **optional compensation models** in consent-based data contribution systems
- These features demonstrate how compensation **could** work in a theoretical system

## Technical Safeguards

### 1. Database Schema Comments
All payment-related models in `prisma/schema.prisma` include explicit "SYNTHETIC DATA ONLY" comments:
- `Currency` enum
- `Trial.rewardUsd` field
- `Payment` model
- `RoyaltyEvent` model
- `Payout` model

### 2. API Validation Layer
**File:** `apps/api/src/lib/synthetic-guard.js`

Three safeguard functions:
- `ensureSyntheticMode()` - Checks `ALLOW_REAL_PAYMENTS` environment variable
- `syntheticOnlyMiddleware` - Express middleware to block payment operations if real payments enabled
- `validateSyntheticAmount()` - Validates amounts don't exceed demo limits (default: 1M cents = $10,000)

### 3. Route Protection
Payment-related routes use the `syntheticOnlyMiddleware`:
- `POST /trials` - Creating trials with reward amounts
- `POST /payments` - Creating payment records
- `POST /payments/royalties` - Creating royalty events

### 4. Environment Variable
**File:** `apps/api/.env`

```bash
ALLOW_REAL_PAYMENTS=false
```

**MUST remain `false`** for compliance. If set to `true`, all payment operations will throw 403 errors.

### 5. Health Check Indicator
The `/health` endpoint includes:
```json
{
  "syntheticDataOnly": true,
  "note": "This system uses synthetic data only - no real patient data or financial transactions"
}
```

## Compliance with Feedback

This implementation addresses the coursework feedback requirements:

✅ **"Must explicitly state that only synthetic data will be used"**
- Schema comments on all payment models
- API responses include warnings
- Health check endpoint declares policy

✅ **"Replace 'monetising patient data' with 'consent-based data contribution with optional compensation models'"**
- All payment-related comments reframed as "demonstration" and "exploration"
- No references to real monetary transactions
- Focuses on technical exploration of consent systems

✅ **"No real health data"**
- Policy document explicitly states synthetic data only
- No PHI/PII processing in codebase

✅ **"Off chain storage for all data"**
- Data stored in IPFS (off-chain)
- Only licensing metadata on-chain via Story Protocol

## For Developers

When adding new features that involve payment/reward amounts:

1. Add the `syntheticOnlyMiddleware` to the route
2. Use `validateSyntheticAmount()` to check amounts
3. Include warnings in API responses:
   ```javascript
   return res.json({
     ok: true,
     data: result,
     warning: "SYNTHETIC DATA ONLY - No real financial transaction occurred."
   });
   ```
4. Add schema comments if creating new payment-related models

## For Coursework Assessors

This system demonstrates:
- **Technical architecture** of consent-based licensing (not deployment)
- **Optional compensation models** using synthetic demonstration data
- **Blockchain for licensing metadata** (immutability, transparency) while keeping data off-chain
- **GDPR-conscious design** (to be enhanced with consent models later)

No real patient participation, real health data, or real financial transactions occur or are intended.
