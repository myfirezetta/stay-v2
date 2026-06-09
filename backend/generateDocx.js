const fs = require("fs");
const { Document, Packer, Paragraph, TextRun, HeadingLevel } = require("docx");

const doc = new Document({
  creator: "SymboFlow System",
  title: "SymboFlow Project Management System Documentation",
  description: "Overview of the SymboFlow architecture and features",
  sections: [
    {
      properties: {},
      children: [
        new Paragraph({
          text: "SymboFlow System Documentation",
          heading: HeadingLevel.HEADING_1,
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "1. System Purpose", bold: true, size: 28 }),
          ],
          spacing: { before: 400, after: 200 },
        }),
        new Paragraph({
          text: "SymboFlow is a modern, context-driven project management platform designed to streamline team collaboration. Rather than relying heavily on traditional forms and deep menus, SymboFlow revolves around an intelligent Activity Feed and a contextual Composer. Users can effortlessly link tasks, tickets, people, and projects simply by tagging them in a conversational feed.",
        }),
        
        new Paragraph({
          children: [
            new TextRun({ text: "2. Core Features", bold: true, size: 28 }),
          ],
          spacing: { before: 400, after: 200 },
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "OmniSearch & Contextual Tagging:", bold: true }),
            new TextRun(" Type '#' for Projects/Tasks, '@' for People/Groups, '!' for Tickets, '*' for Milestones, or '&' for Systems. The Composer instantly provides intelligent autocomplete suggestions, linking records dynamically."),
          ],
          bullet: { level: 0 }
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "Role-Based Access Control (RBAC):", bold: true }),
            new TextRun(" Robust data security ensuring that standard members only see Projects, Tasks, and Tickets they are explicitly assigned to, while Admins retain global visibility."),
          ],
          bullet: { level: 0 }
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "Real-time Activity Feed:", bold: true }),
            new TextRun(" Powered by WebSockets, the central feed updates instantly across the team without refreshing. Feed items naturally thread together with a powerful nested reply system."),
          ],
          bullet: { level: 0 }
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "Rich Entity Management:", bold: true }),
            new TextRun(" Easily create and link Projects, Tasks, Tickets, Systems, Milestones, Users, and Groups through the slide-out Management Drawer."),
          ],
          bullet: { level: 0 }
        }),

        new Paragraph({
          children: [
            new TextRun({ text: "Universal Entity List View:", bold: true }),
            new TextRun(" A centralized table management screen to see and manage all Projects, Tasks, Tickets, Users, and Groups at a glance. Supports real-time dynamic status updates and full CRUD actions (Edit, Delete, and Mark Done) via clean, hoverable icon buttons."),
          ],
          bullet: { level: 0 }
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "Dynamic Smart Statuses:", bold: true }),
            new TextRun(" Tasks and Tickets automatically calculate their status (New, Ongoing, Overdue, or Done) based on their start/due dates and current real-world time. This eliminates manual status-shifting busywork for standard operational tracking."),
          ],
          bullet: { level: 0 }
        }),

        new Paragraph({
          children: [
            new TextRun({ text: "3. Layout & User Interface", bold: true, size: 28 }),
          ],
          spacing: { before: 400, after: 200 },
        }),
        new Paragraph({
          text: "The user interface utilizes a premium 'glassmorphic' design philosophy with dynamic blurring, smooth transitions, and integrated Dark/Light modes to reduce cognitive load and look stunning. The layout consists of three primary zones:",
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "Left Sidebar:", bold: true }),
            new TextRun(" Provides quick navigation across core spaces (Home, Explore, Settings). It also houses the universal 'Manage' button to open the entity creation drawer, the Theme toggle, and the active User Profile/Logout controls."),
          ],
          bullet: { level: 0 }
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "Center Stage (Feed):", bold: true }),
            new TextRun(" The focal point of the application. It contains the intelligent Composer input at the top, followed by a chronological, real-time list of updates, tickets, and mentions relevant to the user."),
          ],
          bullet: { level: 0 }
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "Right Dashboard Panel:", bold: true }),
            new TextRun(" Provides high-level operational statistics at a glance, automatically filtered by the user's access level. Displays total projects, task completion status, overdue items, and upcoming milestones."),
          ],
          bullet: { level: 0 }
        }),

        new Paragraph({
          children: [
            new TextRun({ text: "4. Technical Architecture", bold: true, size: 28 }),
          ],
          spacing: { before: 400, after: 200 },
        }),
        new Paragraph({
          text: "SymboFlow leverages a modern Javascript stack:",
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "Frontend:", bold: true }),
            new TextRun(" React 19 built with Vite, styled elegantly with Tailwind CSS 4, utilizing Motion (Framer Motion) for fluid UI micro-interactions."),
          ],
          bullet: { level: 0 }
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "Backend Engine:", bold: true }),
            new TextRun(" Node.js and Express powering RESTful endpoints, augmented by Socket.io for bi-directional realtime events."),
          ],
          bullet: { level: 0 }
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "Database Layer:", bold: true }),
            new TextRun(" Microsoft SQL Server (MSSQL) serves as the persistent relational backbone, maintaining complex linkages between hierarchical data points securely."),
          ],
          bullet: { level: 0 }
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "Security:", bold: true }),
            new TextRun(" Secure password hashing via bcryptjs, and strict middleware enforcing project-level permissions and dynamic feed filtering based on complex tag intersection logic."),
          ],
          bullet: { level: 0 }
        }),
      ],
    },
  ],
});

Packer.toBuffer(doc).then((buffer) => {
  fs.writeFileSync("../SymboFlow_Documentation.docx", buffer);
  console.log("Document created successfully at root dir.");
});
