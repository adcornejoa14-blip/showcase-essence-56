## Problem
In the "Create account" flow, the "Photos of your work" section doesn't accept uploads via click or drag-and-drop, and there's no visual feedback when files are received.

## Root cause
`OnboardingForm.tsx` only wires a click handler on the upload area — there's no `onDragOver` / `onDrop` listener, so dragging files does nothing. Click upload should work, but there's no toast/confirmation when files are added, so it feels broken.

## Changes (only `src/components/onboarding/OnboardingForm.tsx`)

1. **Enable drag & drop** on the work-photos upload area:
   - Add `onDragOver`, `onDragLeave`, `onDrop` handlers
   - Add a `isDragging` state for visual feedback (border highlight while dragging)
   - Filter only image files from the dropped list and append (capped at 10)

2. **Confirmation when photos are received**:
   - Use `sonner` `toast.success(...)` showing how many photos were added (e.g. "3 photos added")
   - Trigger from a single `addWorkPhotos(files)` helper used by both click input and drop handler
   - Show `toast.error` if user tries to exceed 10 or drops non-image files

3. **Same treatment for the profile photo** dropzone (consistent UX): allow drag & drop and show a small confirmation toast when the profile photo is set.

## Out of scope
- No backend / storage changes (uploads still happen at submit time as today)
- No design system changes
- No other onboarding steps touched
