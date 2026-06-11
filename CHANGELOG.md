# SymboFlow Changelog

## 2026-06-11
- **Status Lifecycle Extension**: Added `Closed` and `Archived` statuses.
  - Implemented exact timestamps tracking for `ClosedDate`, `ArchivedDate`, and `ReopenedDate` in Supabase.
  - Modified the UI Action buttons to support sequential transitions: `New` -> `Ongoing` -> `Done` -> `Closed` -> `Archived`.
  - Added a `Reopen as Ongoing` button for Done, Closed, and Archived tasks.
- **Attachment Viewing**: Added an inline 'View Upload' button directly in the main Entity List for tasks and tickets with uploaded files, allowing quick download and viewing.
- **Multiple Assignees**: Upgraded the Assignee system across the database, API, and UI to support assigning a single Task or Ticket to multiple users simultaneously via an intuitive checkbox list.
- **User Segments & Tagging**: Added Department and Group assignments to User profiles. The Feed composer now supports tagging Roles (`@r:`), Departments (`@d:`), and Groups (`@g:`), broadcasting messages directly to all users within those segments.

## 2026-06-10
- **Authorship Tracking**: Added a `CreatorId` (Posted by) column to Tasks and Tickets tables to track who created the item.
- **UI Enhancements**: 
  - Revamped the app layout to a 3-column design with a collapsible Left Sidebar and Right Panel.
  - Reduced width of sidebars to give the central Feed list 50% more space.
  - Re-implemented the EntityListView to show a "People" column displaying both Creator and Assignee names.
- **Authentication**: Set up basic Username/Password authentication UI logic, but added a bypass mechanism using a default user (Alice) until real Auth is required.
- **Performance Calculation**: Display Target vs Actual days to completion in the Entity List view.
- **Database Architecture**: Implemented full set of Postgres tables via Supabase (`Users`, `Projects`, `Tasks`, `Tickets`, `Milestones`, `Comments`) connected to an Express/Socket.io API layer for real-time reactivity.
