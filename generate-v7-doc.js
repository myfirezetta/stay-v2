import * as fs from "fs";
import { Document, Packer, Paragraph, TextRun, HeadingLevel } from "docx";

const doc = new Document({
  sections: [
    {
      properties: {},
      children: [
        new Paragraph({ text: "SymboFlow System Documentation", heading: HeadingLevel.TITLE }),
        new Paragraph({ text: "Last Updated: June 12, 2026", heading: HeadingLevel.HEADING_2 }),
        new Paragraph({ text: "\n" }),
        
        new Paragraph({ text: "1. Introduction", heading: HeadingLevel.HEADING_1 }),
        new Paragraph({ text: "SymboFlow is a modern, real-time project management and ticketing platform designed to streamline cross-departmental operations (e.g., HR, Admin, IT Developer, IT Support). By merging project tracking with live social collaboration, SymboFlow ensures total transparency and rapid issue resolution." }),
        new Paragraph({ text: "\n" }),

        new Paragraph({ text: "2. Technical Architecture", heading: HeadingLevel.HEADING_1 }),
        new Paragraph({ text: "The platform operates on a robust, scalable technology stack:" }),
        new Paragraph({ text: "• Frontend: React.js (Vite), styled with TailwindCSS for a highly responsive UI.", bullet: { level: 0 } }),
        new Paragraph({ text: "• Backend API: Node.js with Express.js.", bullet: { level: 0 } }),
        new Paragraph({ text: "• Real-Time Engine: Socket.io for live bidirectional communication.", bullet: { level: 0 } }),
        new Paragraph({ text: "• Database: Supabase (PostgreSQL) providing persistent, structured storage.", bullet: { level: 0 } }),
        new Paragraph({ text: "\n" }),

        new Paragraph({ text: "3. Core Features & Capabilities", heading: HeadingLevel.HEADING_1 }),
        
        new Paragraph({ text: "3.1. Responsive 3-Column Interface", heading: HeadingLevel.HEADING_2 }),
        new Paragraph({ text: "The UI features a dynamic layout consisting of a Navigation Sidebar, a Central Feed/List view, and a Right Analytics Panel. Both sidebars can be collapsed to expand the central workspace by 50% on smaller screens." }),
        
        new Paragraph({ text: "3.2. Social Feed & Collaboration", heading: HeadingLevel.HEADING_2 }),
        new Paragraph({ text: "A central timeline where users can post updates and add comments to specific Tasks or Tickets. Powered by Socket.io, every comment or status update instantly broadcasts to all connected clients without requiring a page refresh." }),
        
        new Paragraph({ text: "3.3. Task & Ticket Lifecycle", heading: HeadingLevel.HEADING_2 }),
        new Paragraph({ text: "SymboFlow tracks the entire lifecycle of work items with granular timestamping. The standard workflow follows a precise sequence:" }),
        new Paragraph({ text: "• New / Open: The default state upon creation.", bullet: { level: 0 } }),
        new Paragraph({ text: "• Ongoing: Triggered when a user clicks 'Start Work'. The system logs the StartDate.", bullet: { level: 0 } }),
        new Paragraph({ text: "• Done: Triggered when marked complete. The system logs the DoneDate.", bullet: { level: 0 } }),
        new Paragraph({ text: "• Closed: Marks the task as verified. Logs the ClosedDate.", bullet: { level: 0 } }),
        new Paragraph({ text: "• Archived: Hides the task from active view. Logs the ArchivedDate.", bullet: { level: 0 } }),
        new Paragraph({ text: "• Reopen: Any completed, closed, or archived task can be reopened, resetting the state to 'Ongoing' and logging the ReopenedDate.", bullet: { level: 0 } }),

        new Paragraph({ text: "3.4. Segment Targeting & Tagging", heading: HeadingLevel.HEADING_2 }),
        new Paragraph({ text: "Users are assigned to specific Roles, Departments, and Groups. The Feed Composer natively supports tagging segments via '@d:Department', '@g:Group', and '@r:Role'. The real-time Feed engine seamlessly broadcasts tagged updates to every individual user belonging to that segment, ensuring rapid, targeted team communication without cluttering others' feeds." }),
        
        new Paragraph({ text: "3.5. File Uploads and Attachments", heading: HeadingLevel.HEADING_2 }),
        new Paragraph({ text: "Users can upload relevant documents or images to any Task or Ticket. An inline 'View Upload' button dynamically appears within the central tracking list. Clicking it seamlessly triggers a browser-level file download or inline view, ensuring rapid access to critical materials." }),

        new Paragraph({ text: "3.6. Multiple Assignees", heading: HeadingLevel.HEADING_2 }),
        new Paragraph({ text: "The system fully supports assigning tasks and tickets to multiple people via an intuitive checkbox list. The database uses optimized integer arrays to track assignees, ensuring scalable cross-team assignments." }),

        new Paragraph({ text: "3.7. Smart Statuses & Performance Calculation", heading: HeadingLevel.HEADING_2 }),
        new Paragraph({ text: "The system automatically assesses tasks and assigns dynamic badges. A task is 'Overdue' if the current date exceeds the DueDate. It is labeled 'High Priority' if it is within 3 days of the deadline. The system also calculates Performance by comparing the 'Target Days' (Start to Due) against the 'Actual Days' (Start to Done)." }),

        new Paragraph({ text: "3.8. Persistent Notification Engine", heading: HeadingLevel.HEADING_2 }),
        new Paragraph({ text: "Whenever a user is tagged (directly or via their group/role/department) in the Feed, or assigned a new Task/Ticket, the backend dynamically calculates the impacted users and generates targeted notification records. The author of the action is explicitly excluded from being notified to prevent self-spam." }),

        new Paragraph({ text: "3.9. Real-Time UI Alerts & Contextual Navigation", heading: HeadingLevel.HEADING_2 }),
        new Paragraph({ text: "Connected users receive instantaneous floating toast popups when they are mentioned. A dedicated 'Notifications' hub aggregates history with an unread badge counter. Clicking a feed notification automatically isolates and focuses the UI exclusively on that specific conversation thread." }),
        new Paragraph({ text: "\n" }),

        new Paragraph({ text: "4. Database Schema Overview", heading: HeadingLevel.HEADING_1 }),
        new Paragraph({ text: "The underlying PostgreSQL tables manage all entity relationships:" }),
        
        new Paragraph({ text: "Users Table", heading: HeadingLevel.HEADING_3 }),
        new Paragraph({ text: "Stores user profiles including Name, Department, Group, Avatar, Role, and Status." }),
        
        new Paragraph({ text: "Projects Table", heading: HeadingLevel.HEADING_3 }),
        new Paragraph({ text: "Encapsulates high-level objectives (Id, Name, Description, CreatedAt)." }),

        new Paragraph({ text: "Tasks & Tickets Tables", heading: HeadingLevel.HEADING_3 }),
        new Paragraph({ text: "Tracks actionable items and support requests. Key columns include:" }),
        new Paragraph({ text: "• Metadata: Title, Description, ProjectId, TaskId, SystemId", bullet: { level: 0 } }),
        new Paragraph({ text: "• People: CreatorId (Posted by), AssigneeIds (Array of assigned users)", bullet: { level: 0 } }),
        new Paragraph({ text: "• Statuses: Status (Ongoing, Done, Close, Archive)", bullet: { level: 0 } }),
        new Paragraph({ text: "• Timestamps: StartDate, DueDate, DoneDate, ClosedDate, ArchivedDate, ReopenedDate", bullet: { level: 0 } }),
        new Paragraph({ text: "• Attachments: AttachmentUrl", bullet: { level: 0 } }),

        new Paragraph({ text: "Feed Table", heading: HeadingLevel.HEADING_3 }),
        new Paragraph({ text: "Stores real-time conversation threads, tracking Content, ParsedTags, AuthorId, and ParentId for replies." }),

        new Paragraph({ text: "Notifications Table", heading: HeadingLevel.HEADING_3 }),
        new Paragraph({ text: "Logs isolated alerts. Tracks UserId, Title, Content, Link (contextual thread URI), and IsRead state." })
      ],
    },
  ],
});

Packer.toBuffer(doc).then((buffer) => {
  fs.writeFileSync("SymboFlow_Documentation_v7.docx", buffer);
  console.log("Full Project Document (v7) created successfully in requested format.");
});
