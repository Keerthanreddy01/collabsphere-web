# scripts/

One-off utility and migration scripts for the CollabSphere monorepo.

## Contents

| File | Description | Status |
|---|---|---|
| `update_onboarding.py` | One-time Firestore migration — backfills `onboarding_completed` field on existing `builder_profiles` documents | ✅ Already run — do not re-run in production |

## Usage

Scripts in this folder are **one-time utilities** unless otherwise marked. Before running any script:

1. Check the status in the table above
2. Read the script header for any prerequisites (Firebase credentials, etc.)
3. Test against a dev/staging Firestore instance before production

## Adding New Scripts

- Give the script a descriptive name: `<verb>_<what>.<ext>` (e.g. `backfill_avatars.py`)
- Add a header comment explaining: what it does, when it should be run, and any prerequisites
- Update the table above after adding
