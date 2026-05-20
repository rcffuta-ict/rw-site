# @rcffuta/ict-lib

> **A comprehensive TypeScript library for RCF FUTA's digital ecosystem**
> Centralized business logic, type-safe database operations, and authentication services for RCF FUTA applications.

[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)](https://www.typescriptlang.org/)
[![License: ISC](https://img.shields.io/badge/License-ISC-green.svg)](https://opensource.org/licenses/ISC)

## 📚 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Installation](#-installation)
- [Quick Start](#-quick-start)
- [Environment Setup](#-environment-setup)
- [API Reference](#-api-reference)
- [Services Documentation](#-services-documentation)
- [Type Definitions](#-type-definitions)
- [Database Setup](#-database-setup)
- [Examples](#-examples)
- [Development](#-development)

---

## 🎯 Overview

\`@rcffuta/ict-lib\` is a production-ready TypeScript library that provides the core functionality for RCF FUTA's digital applications.

**Key Components:**

- **Authentication & User Management** - Multi-step registration with OTP verification
- **Administrative Services** - Tenure, unit, and leadership management
- **Zone & Unit Services** - Residential zone and ministry unit operations
- **Event Management** - Event creation, attendance tracking, and analytics
- **Member Services** - Profile management and member queries
- **Email Services** - Transactional emails via Zoho SMTP
- **Type Safety** - 100% TypeScript with comprehensive type definitions

---

## ✨ Features

### 🔐 Authentication System

- Multi-step registration (bio → academic → location → emergency)
- Email OTP verification with Zoho SMTP
- Session management with Supabase Auth
- Profile completion tracking

### 👥 Member & Zone Management

- Residential zone assignment and tracking
- Hall pastor and zone coordinator roles
- Unit/ministry membership management
- Member search and filtering

### 🎓 Academic Integration

- 55+ FUTA departments across 11 faculties
- Department validation and utilities
- Class set management (100L-700L)

### 📧 Email Services

- OTP verification emails
- Welcome emails with branded templates
- Zoho SMTP integration with fallback support

### 🏗️ Admin Operations

- Tenure management (academic sessions)
- Unit creation and leadership assignment
- Naming ceremony coordination
- Bulk operations support

### ❓ Q/A & Moderation

- Event-specific question management
- Question clustering and answering
- Flagging and moderation for church events

---

## 📦 Installation

### Prerequisites

- Node.js >= 16.x
- npm, yarn, or pnpm
- GitHub account with access to \`@rcffuta\` packages

### Step 1: Configure NPM Registry

Create or update \`.npmrc\` in your project root:

```ini
@rcffuta:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:\_authToken=\${GITHUB_TOKEN}
```

> **Note:** Replace \`\${GITHUB_TOKEN}\` with your GitHub Personal Access Token (with \`read:packages\` scope)

### Step 2: Install the Package

```bash

# Using pnpm (recommended)

pnpm add @rcffuta/ict-lib

# Using npm

npm install @rcffuta/ict-lib

# Using yarn

yarn add @rcffuta/ict-lib
```

---

## 🚀 Quick Start

### Client-Side Usage (Types & Constants Only)

For frontend applications, import only types and constants:

```typescript
import {
    DEPARTMENTS,
    getDepartmentsByFaculty,
    type DepartmentType,
} from "@rcffuta/ict-lib";

// Get all departments
const allDepts = DEPARTMENTS;

// Filter by faculty
const engDepts = getDepartmentsByFaculty("ENGINEERING");

// Type-safe department usage
const userDept: DepartmentType = {
    name: "Computer Science",
    faculty: "SCIENCES",
    code: "CSC",
};
```

### Server-Side Usage (Full Services)

For backend applications (API routes, serverless functions):

```typescript
import { RcfIctClient } from "@rcffuta/ict-lib/server";

// Initialize with environment variables
const client = RcfIctClient.fromEnv();

// Or with explicit credentials
const client = new RcfIctClient("https://your-project.supabase.co", "your-anon-key");

// Use services
async function registerUser(email: string, password: string) {
    const { user } = await client.auth.register(email, password);
    await client.auth.sendOtp(email, user.firstName);
    return user;
}
```

---

## ⚙️ Environment Setup

### Required Environment Variables

Create a \`.env\` or \`.env.local\` file in your project:

```bash

# Supabase Configuration (Required)

SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key # For admin operations only

# Environment (Optional)

NODE_ENV=development # development | testing | production

# Email Configuration (Required for auth services)

ZOHO_SMTP_HOST=smtp.zoho.com
ZOHO_SMTP_PORT=465
ZOHO_SMTP_USER=noreply@rcffuta.com
ZOHO_SMTP_PASS=your-smtp-password

# Email Sender Info (Optional)

MAIL_SENDER_EMAIL=noreply@rcffuta.com
MAIL_SENDER_NAME=RCF FUTA ICT

# Application Config (Optional)

APP_NAME=RCF ICT Library
APP_VERSION=1.0.0
DEBUG_MODE=false
```

### Environment Validation

The library automatically validates your environment configuration:

```typescript
import { loadEnvConfig } from "@rcffuta/ict-lib/server";

try {
    const config = loadEnvConfig();
    console.log("✅ Environment configuration valid");
} catch (error) {
    console.error("❌ Invalid environment:", error.message);
}
```

---

## 📖 API Reference

### Client Exports (\`@rcffuta/ict-lib\`)

**Safe for frontend use - No server-side code or secrets**

```typescript
// Types
import type {
    DepartmentType,
    FacultyType,
    ProfileData,
    AcademicData,
} from "@rcffuta/ict-lib";

// Constants
import { DEPARTMENTS, FACULTIES, CLASS_SETS } from "@rcffuta/ict-lib";

// Schemas (for validation)
import { bioDataSchema, academicDataSchema } from "@rcffuta/ict-lib";
```

### Server Exports (\`@rcffuta/ict-lib/server\`)

**Backend only - Contains database operations and secrets**

```typescript
import {
    RcfIctClient,
    AuthService,
    AdminService,
    ZoneService,
    UnitService,
    EventService,
    MemberService,
    loadEnvConfig,
} from "@rcffuta/ict-lib/server";
```

---

## 🔧 Services Documentation

### AuthService

Handles user authentication, registration, and profile management.

```typescript
// Register new user
await client.auth.register(email: string, password: string)

// Send OTP email
await client.auth.sendOtp(email: string, name: string)

// Update profile sections
await client.auth.updateBioData(data: BioData)
await client.auth.updateAcademicData(data: AcademicData)
await client.auth.updateLocationData(data: LocationData)
await client.auth.updateEmergencyData(data: EmergencyData)
```

### AdminService

Administrative operations for tenure and organizational management.

```typescript
// Tenure Management
await client.admin.createTenure(data: TenureData)
await client.admin.getActiveTenure()

// Unit Management
await client.admin.createUnit(name: string, type: 'TEAM' | 'MINISTRY')
await client.admin.assignUnitLeader(unitId: string, userId: string)
```

### ZoneService

Manage residential zones and hall pastors.

```typescript
// Zone Operations
await client.zone.getAllZonesOverview()
await client.zone.createZone(name: string, description: string)
await client.zone.assignHallPastor(tenureId, email, zoneId)
await client.zone.getZoneMembers(zoneId: string)
```

### UnitService

Ministry unit and worker management.

```typescript
// Unit Operations
await client.unit.getAllUnitsOverview();
await client.unit.addWorker(tenureId, email, unitId);
await client.unit.getUnitMembers(unitId, tenureId);
```

### EventService

Event creation and attendance tracking.

```typescript
// Event Management
await client.event.createEvent(data: EventData)
await client.event.markAttendance(eventId, userId)
await client.event.getEventStats(eventId)
```

### MemberService

Member search and profile queries.

```typescript
// Member Queries
await client.member.searchMembers(query: string)
await client.member.getMemberById(userId: string)
await client.member.getMembersByDepartment(department: string)
```

---

## 📋 Type Definitions

### Core Types

```typescript
// User Profile
interface ProfileData {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    gender: "male" | "female";
    department: string;
    currentLevel: 100 | 200 | 300 | 400 | 500 | 600 | 700;
    matricNumber: string;
}

// Department
interface DepartmentType {
    name: string;
    code: string;
    faculty: FacultyCode;
}

// Tenure
interface TenureData {
    id: string;
    name: string;
    session: string;
    startDate: Date;
    isActive: boolean;
}
```

---

## 🗄️ Database Setup

### Initializing Supabase Database

Run the SQL scripts in order:

1. **Core Schema** (\`supabase/init.sql\`)
    - Creates: profiles, residential_zones, class_sets tables
    - Sets up: RLS policies, triggers, functions

2. **Admin Schema** (\`supabase/admin-init.sql\`)
    - Creates: tenures, units, leadership tables
    - Sets up: Admin RLS policies, helper functions

3. **Alterations** (\`supabase/alter-user-information.sql\`)
    - Updates: profile table constraints, indexes

### Running Scripts

```bash

# Using Supabase CLI

supabase db reset
supabase db push

# Or via Supabase Dashboard

# 1. Go to SQL Editor

# 2. Copy contents of each file

# 3. Execute in order

```

---

## 💡 Examples

### Example 1: User Registration with OTP

```typescript
import { RcfIctClient } from "@rcffuta/ict-lib/server";

const client = RcfIctClient.fromEnv();

async function registerNewUser(email: string, password: string) {
    try {
        const { user } = await client.auth.register(email, password);
        await client.auth.sendOtp(email, user.firstName);

        return { success: true, userId: user.id };
    } catch (error) {
        return { success: false, message: error.message };
    }
}
```

### Example 2: Department Dropdown

```typescript
import { DEPARTMENTS, getDepartmentsByFaculty } from '@rcffuta/ict-lib'
import { useState } from 'react'

function DepartmentSelector() {
const [faculty, setFaculty] = useState('')

const depts = faculty
? getDepartmentsByFaculty(faculty)
: DEPARTMENTS

return (
<select>
{depts.map(dept => (
<option key={dept.code} value={dept.code}>
{dept.name}
</option>
))}
</select>
)
}
```

### Example 3: Zone Management

```typescript
async function setupZone() {
const client = RcfIctClient.fromEnv()

// Create zone
await client.zone.createZone('North Campus', 'North campus hostels')

// Assign hall pastor
await client.zone.assignHallPastor(
'tenure-id',
'pastor@student.futa.edu.ng',
'zone-id'
)

// Get members
const members = await client.zone.getZoneMembers('zone-id')
console.log(\`Zone has \${members.length} members\`)
}
```

---

## 🛠️ Development

### Building the Library

```bash

# Install dependencies

pnpm install

# Build for production

pnpm build

# Watch mode (development)

pnpm dev

# Lint code

pnpm lint
```

### Publishing New Versions

```bash

# Patch version (1.0.0 -> 1.0.1)

pnpm release:patch

# Minor version (1.0.0 -> 1.1.0)

pnpm release:minor

# Major version (1.0.0 -> 2.0.0)

pnpm release:major
```

### Project Structure

```text
@rcffuta/ict-lib/
├── src/
│ ├── config/ # Environment configuration
│ ├── constants/ # FUTA departments & faculties
│ ├── schemas/ # Validation schemas
│ ├── services/ # Business logic services
│ ├── types/ # TypeScript types
│ ├── index.ts # Client exports (frontend-safe)
│ └── server.ts # Server exports (backend-only)
├── supabase/ # Database scripts
├── dist/ # Build output
└── package.json
```

---

## 📄 License

ISC License - see LICENSE file for details

---

## 🤝 Contributing

This is an internal RCF FUTA project. For access or contributions, contact the ICT team.

---

## 📞 Support

For issues, questions, or feature requests:

- **Email:** ict@rcffuta.com
- **GitHub Issues:** [rcffuta/ict-lib/issues](https://github.com/rcffuta/ict-lib/issues)

---

**Built with ❤️ by RCF FUTA ICT Team**
