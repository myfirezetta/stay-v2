-- SymboFlow Full Database Schema
-- Run this script in MSSQL to initialize all tables for the SymboFlow tagging engine.

USE projectmng;
GO

-- 1. Collateral & Actors (@)
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Users' and xtype='U')
BEGIN
    CREATE TABLE Users (
        Id INT PRIMARY KEY IDENTITY(1,1),
        DisplayName NVARCHAR(100) NOT NULL,
        Email NVARCHAR(255),
        CreatedAt DATETIME DEFAULT GETDATE()
    );
END
GO

IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Groups' and xtype='U')
BEGIN
    CREATE TABLE Groups (
        Id INT PRIMARY KEY IDENTITY(1,1),
        Name NVARCHAR(100) NOT NULL,
        Description NVARCHAR(MAX),
        CreatedAt DATETIME DEFAULT GETDATE()
    );
END
GO

IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Departments' and xtype='U')
BEGIN
    CREATE TABLE Departments (
        Id INT PRIMARY KEY IDENTITY(1,1),
        Name NVARCHAR(100) NOT NULL,
        CreatedAt DATETIME DEFAULT GETDATE()
    );
END
GO

-- 2. Resource Headers (#)
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Projects' and xtype='U')
BEGIN
    CREATE TABLE Projects (
        Id INT PRIMARY KEY IDENTITY(1,1),
        Name NVARCHAR(255) NOT NULL,
        Description NVARCHAR(MAX),
        CreatedAt DATETIME DEFAULT GETDATE()
    );
END
GO

IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Tasks' and xtype='U')
BEGIN
    CREATE TABLE Tasks (
        Id INT PRIMARY KEY IDENTITY(1,1),
        Title NVARCHAR(255) NOT NULL,
        ProjectId INT FOREIGN KEY REFERENCES Projects(Id),
        Status NVARCHAR(50) DEFAULT 'Todo',
        CreatedAt DATETIME DEFAULT GETDATE()
    );
END
GO

IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Tickets' and xtype='U')
BEGIN
    CREATE TABLE Tickets (
        Id INT PRIMARY KEY IDENTITY(1,1),
        Title NVARCHAR(255) NOT NULL,
        ProjectId INT FOREIGN KEY REFERENCES Projects(Id),
        Status NVARCHAR(50) DEFAULT 'Open',
        CreatedAt DATETIME DEFAULT GETDATE()
    );
END
GO

IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Systems' and xtype='U')
BEGIN
    CREATE TABLE Systems (
        Id INT PRIMARY KEY IDENTITY(1,1),
        Name NVARCHAR(100) NOT NULL,
        Description NVARCHAR(MAX),
        CreatedAt DATETIME DEFAULT GETDATE()
    );
END
GO

-- 3. Chronology & Milestones (*)
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Milestones' and xtype='U')
BEGIN
    CREATE TABLE Milestones (
        Id INT PRIMARY KEY IDENTITY(1,1),
        Title NVARCHAR(255) NOT NULL,
        ProjectId INT FOREIGN KEY REFERENCES Projects(Id),
        TargetDate DATE,
        CreatedAt DATETIME DEFAULT GETDATE()
    );
END
GO

-- 4. Core Feed Engine
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Feed' and xtype='U')
BEGIN
    CREATE TABLE Feed (
        Id INT PRIMARY KEY IDENTITY(1,1),
        Content NVARCHAR(MAX) NOT NULL,
        ParsedTags NVARCHAR(MAX), -- JSON string of extracted #, @, * tags
        AuthorId INT FOREIGN KEY REFERENCES Users(Id),
        CreatedAt DATETIME DEFAULT GETDATE()
    );
END
GO
