# Clerk Portal — Button Spec
**Version:** Draft — June 22, 2026  
**Author:** Product (Emili)

---

## Action required table

### Row 1 — Noah Diallo · Did not reach class
**Button:** Open record (secondary)  
Navigates to **Today's Records**. Noah Diallo's row is highlighted and the details drawer opens pre-loaded with his record.

---

### Row 3 — Sofia Patel · Awaiting parent · Past 24h
**Button:** Follow up (secondary)  
Navigates to **Pending Parent Replies**. Sofia Patel's row is highlighted and the details drawer opens pre-loaded with her record.

---

### Row 4 — Olivia Martínez · Pending clerk approval
**Button:** Approve P1 (primary)  
Navigates to **Pending Parent Replies**. Olivia Martínez's row is highlighted and the details drawer opens pre-loaded with her record, scrolled to the parent reply awaiting approval.

---

## Class submissions — missing attendance

These buttons appear in the class submissions section of the dashboard when one or more teachers have not submitted attendance for the current period.

### Remind all
**Button:** Remind all (primary)  
Sends a notification to **all teachers** who have not yet submitted attendance for the current period. The notification appears in the teacher portal prompting them to submit. The button is disabled and replaced with a confirmation state once sent, to prevent duplicate reminders.

---

### Re-send
**Button:** Re-send (secondary)  
Sends a follow-up notification to a **specific teacher** who was already reminded but has still not submitted. Appears per-teacher row after an initial reminder has been sent.

---

### Send
**Button:** Send (secondary)  
Sends an initial notification to a **specific teacher** who has not yet been reminded. Appears per-teacher row before any reminder has been sent.

---

## Pending replies screen — Waiting tab

These buttons appear in the detail drawer for records in the Waiting tab — records where a parent notification was sent but no reply has been received yet.

### Send reminder / Re-send reminder
**Button:** Send reminder (secondary) · Re-send reminder (secondary)  
Sends a notification to the parent's portal reminding them to submit justification for their child's absence. "Send reminder" appears when no reminder has been sent yet; "Re-send reminder" appears after at least one reminder has already been sent.

**Notification message sent to parent:**
> [Student]'s absence on [date] is still awaiting justification. Please submit it through the absent record in the parent portal or contact the attendance office. If no justification is received, this record will remain Unjustified and may affect your child's grade.

The action is logged to the record's audit trail.

---

## Today's Records screen — absent record

The following buttons appear in the detail drawer of an absent record.

### Sign in
**Button:** Sign in (primary)  
Default action on a new absent record. The student was marked absent for a period but has arrived at the clerk's office. The clerk signs them in so they can return to class. Student status changes from **Absent** to **Signed in · Awaiting check-in** and a 10-minute timer starts for the teacher to confirm the student reached class.

---

### Re-send notification
**Button:** Re-send notification (secondary)  
Resends the absence notification to the parent. Used when the parent did not receive the original notification or when the clerk needs to prompt a reply.

---

### Override remark
**Button:** Override remark (secondary)  
Used when the clerk made a mistake after taking an action on the record. Resets the record back to its default state, restoring the **Sign in** button as the primary action.

---

### Unable to locate
**Button:** Unable to locate (secondary)  
Appears when the Did not reach class ⚠ alert is active — the student was signed in but did not reach class within 10 minutes. If staff cannot find the student, the clerk marks them as unable to locate. A notification is sent to the teacher who then makes the attendance decision (mark Absent or otherwise). The clerk does not change the student's status directly. (T8b)

---

### Approve
**Button:** Approve (primary)  
Previously labelled "Approve P1 Late." Used when the parent submits a justification within the current period window. Approving sets the late or absent status to **Justified** and closes the record. The justification is logged to the audit trail and the record is pushed to Aspen.

---

## Disputes screen — detail drawer

A dispute is opened when a parent disagrees with their child's attendance status — an absence they believe is incorrect, or a lateness or unjustified absence they want to contest.

The detail drawer has four buttons.

### Change to Present
**Button:** Change to Present (primary)  
Used when the parent's claim is correct and the student was actually in class. The student's status is updated to **Present**. The absence record is **canceled but not deleted** — it remains in the audit trail with a note that it was overridden via dispute resolution. No absence is pushed to Aspen for this record.

---

### Uphold original
**Button:** Uphold original (secondary)  
Used when the clerk determines the parent's justification is not valid, or when school policy does not allow the absence to be excused. The original status (unjustified absence or lateness) is **kept unchanged**. The dispute is closed with the original decision standing. The record continues to Aspen as originally pushed.

---

### Request more evidence
**Button:** Request more evidence (secondary)  
Used when the clerk needs additional documentation before making a decision. Clicking the button opens a modal with the following flow:

1. **Reason selection** — The clerk selects one or more reasons explaining what is missing or insufficient:
   - No documentation was submitted
   - Documentation submitted is not legible
   - Documentation does not match the absence date
   - Documentation is incomplete or missing key information

2. **Notification preview** — As the clerk selects reasons, a live preview updates showing the exact message the parent will receive, including the student name, period, subject, and date of the dispute.

3. **Send** — The clerk clicks "Send via parent portal." The parent receives the notification through the parent portal with the reason(s) clearly stated.

After sending: the dispute status changes to **Awaiting evidence** and the action is logged to the record's audit trail. The dispute remains open until the parent responds.

---

### Open record
**Button:** Open record (secondary)  
Opens the full attendance record that is being disputed — the student's absence or lateness record. Allows the clerk to review the complete timeline, audit trail, and any prior justification attempts before making a resolution decision.
