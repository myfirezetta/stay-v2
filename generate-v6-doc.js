import * as fs from "fs";
import { Document, Packer, Paragraph, TextRun, HeadingLevel } from "docx";

const doc = new Document({
  sections: [
    {
      properties: {},
      children: [
        new Paragraph({ text: "SymboFlow System Documentation", heading: HeadingLevel.TITLE }),
        new Paragraph({ text: "Version: 6.0", heading: HeadingLevel.HEADING_2 }),
        new Paragraph({ text: "Date: June 12, 2026", heading: HeadingLevel.HEADING_2 }),
        new Paragraph({ text: "\n" }),
        
        new Paragraph({ text: "1. Project Overview", heading: HeadingLevel.HEADING_1 }),
        new Paragraph({ text: "SymboFlow is a modern, real-time project management and collaboration platform. It unifies task management, issue tracking, and team communication into a single interface. The application features a 3-column layout heavily optimized for desktop, with real-time updates powered by WebSockets." }),
        new Paragraph({ text: "\n" }),

        new Paragraph({ text: "2. Technology Stack", heading: HeadingLevel.HEADING_1 }),
        new Paragraph({ text: "Frontend:", heading: HeadingLevel.HEADING_3 }),
        new Paragraph({ text: "- React 19 & Vite for fast build and rendering.", bullet: { level: 0 } }),
        new Paragraph({ text: "- TailwindCSS 4 for atomic, responsive styling.", bullet: { level: 0 } }),
        new Paragraph({ text: "- Lucide-React for clean, consistent iconography.", bullet: { level: 0 } }),
        new Paragraph({ text: "- Socket.IO Client for real-time feed and notification subscriptions.", bullet: { level: 0 } }),
        
        new Paragraph({ text: "Backend & Database:", heading: HeadingLevel.HEADING_3 }),
        new Paragraph({ text: "- Node.js & Express serving the REST API endpoints.", bullet: { level: 0 } }),
        new Paragraph({ text: "- Socket.IO Server for live event broadcasting across connected clients.", bullet: { level: 0 } }),
        new Paragraph({ text: "- Supabase (PostgreSQL) for relational data persistence.", bullet: { level: 0 } }),
        new Paragraph({ text: "\n" }),

        new Paragraph({ text: "3. Database Architecture", heading: HeadingLevel.HEADING_1 }),
        new Paragraph({ text: "The backend is structured around several core Supabase tables:" }),
        new Paragraph({ text: "- Users: Tracks DisplayName, Role, DepartmentId, GroupId, Avatar, and authentication details.", bullet: { level: 0 } }),
        new Paragraph({ text: "- Projects: Top-level containers for work.", bullet: { level: 0 } }),
        new Paragraph({ text: "- Tasks & Tickets: Track work items. Both support the full lifecycle: New -> Ongoing -> Done -> Closed -> Archived. They track AssigneeIds (supports multiple assignees), CreatorId, Target dates, and precise transition timestamps.", bullet: { level: 0 } }),
        new Paragraph({ text: "- Feed: Central hub for communication. Posts can be standalone or replies. Supports rich tag parsing.", bullet: { level: 0 } }),
        new Paragraph({ text: "- Notifications: Tracks user-specific alerts containing Title, Content, Link, and Read Status.", bullet: { level: 0 } }),
        new Paragraph({ text: "\n" }),

        new Paragraph({ text: "4. Core Features & Capabilities", heading: HeadingLevel.HEADING_1 }),
        
        new Paragraph({ text: "Entity Management (Tasks/Tickets):", heading: HeadingLevel.HEADING_3 }),
        new Paragraph({ text: "Users can create, edit, and transition Tasks and Tickets. The system supports assigning multiple users to a single item via a checklist interface. Progress is tracked against Target Completion Dates. Users can upload attachments directly to items and view them inline." }),
        
        new Paragraph({ text: "Real-time Feed & Mentions:", heading: HeadingLevel.HEADING_3 }),
        new Paragraph({ text: "The core screen of the application is a live Feed. Users can communicate freely and tag other entities. Supported tags include:" }),
        new Paragraph({ text: "- @u:Username (Tags specific users)", bullet: { level: 0 } }),
        new Paragraph({ text: "- @r:Role (Tags everyone in a specific role, e.g., @r:Admin)", bullet: { level: 0 } }),
        new Paragraph({ text: "- @d:Department (Tags everyone in a department)", bullet: { level: 0 } }),
        new Paragraph({ text: "- @g:Group (Tags everyone in a specialized team group)", bullet: { level: 0 } }),
        
        new Paragraph({ text: "Persistent Notification Engine:", heading: HeadingLevel.HEADING_3 }),
        new Paragraph({ text: "Whenever a user is tagged (directly or via their group/role) in the Feed, or assigned a new Task/Ticket, the backend dynamically calculates the impacted users and generates targeted notification records. The author of the action is explicitly excluded from being notified to prevent self-spam." }),
        
        new Paragraph({ text: "Real-time UI Alerts:", heading: HeadingLevel.HEADING_3 }),
        new Paragraph({ text: "Connected users receive instantaneous floating toast popups when they are mentioned. A dedicated 'Notifications' hub in the sidebar aggregates history, displaying an unread badge counter. Clicking a feed notification automatically switches the UI to focus exclusively on that isolated conversation thread." }),
        new Paragraph({ text: "\n" }),

        new Paragraph({ text: "5. Security & Authentication", heading: HeadingLevel.HEADING_1 }),
        new Paragraph({ text: "The system features a complete auth layer layout (LoginView), but currently employs a development bypass, defaulting active sessions to 'Alice' (Admin) for seamless testing without requiring credentials." })
      ],
    },
  ],
});

Packer.toBuffer(doc).then((buffer) => {
  fs.writeFileSync("SymboFlow_Documentation_v6.docx", buffer);
  console.log("Full Project Document created successfully");
});
