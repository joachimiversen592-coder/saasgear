# ContractOS - Legal Contract Management Platform

A modern, Apple HIG-compliant contract management platform built for startups, lawyers, and enterprises.

## Features

### For Startups
- **Contract Workspace**: Create, edit, and manage contracts with an intuitive Word/Google Docs-style editor
- **Version History**: Track all changes with automatic versioning
- **Collaboration**: Share contracts with team members and external lawyers
- **Status Tracking**: Monitor contracts through draft, review, signed, and archived stages
- **Search & Filter**: Quickly find contracts by title, counterparty, status, or tags

### For Lawyers
- **Review Queue**: Dedicated dashboard for managing contract reviews
- **Billing Tracking**: Track reviews and earnings with transparent per-review fees
- **Review Tools**: Add comments, suggestions, and proposed changes
- **Status Management**: Mark contracts as pending, in progress, or completed

### For Enterprise Admins
- **Organization Dashboard**: Comprehensive overview of all contracts and team activity
- **User Management**: Control access and permissions for team members
- **Audit Logs**: Track all important actions for compliance
- **Reporting**: View contract statistics and usage metrics

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS with Apple HIG design tokens
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Icons**: SF Symbols (Apple design language)
- **Font**: SF Pro (Apple San Francisco)

## Design Principles

This platform strictly follows **Apple Human Interface Guidelines**:

- **Clarity**: Clear, legible interfaces with strong visual hierarchy
- **Deference**: Light, unobtrusive design that lets content shine
- **Depth**: Layered layouts with subtle shadows and smooth transitions
- **Consistency**: Uniform components, spacing, and interactions throughout
- **Accessibility**: Large hit areas, sufficient contrast, and clear feedback states

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Supabase account (database already configured)

### Installation

1. Navigate to the contract platform directory:
```bash
cd contract-platform
```

2. Install dependencies:
```bash
npm install
```

3. Environment variables are already configured in `.env.local`

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
contract-platform/
├── app/                    # Next.js App Router pages
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # Startup user dashboard
│   ├── lawyer/            # Lawyer dashboard
│   ├── admin/             # Enterprise admin dashboard
│   └── page.tsx           # Landing page
├── components/
│   ├── editor/            # Contract editor components
│   ├── icons/             # SF Symbols icon system
│   ├── layout/            # Layout components (Sidebar, etc.)
│   └── ui/                # Reusable UI components
└── lib/
    ├── auth.ts            # Authentication utilities
    └── supabase.ts        # Supabase client & types
```

## Database Schema

### Tables

- **profiles**: User profiles with role (startup, lawyer, enterprise_admin)
- **organizations**: Company/organization information
- **contracts**: Contract documents with content, status, and metadata
- **contract_versions**: Version history for all contract changes
- **contract_comments**: Comments and suggestions on contracts
- **lawyer_reviews**: Lawyer review requests and billing
- **audit_logs**: Enterprise audit trail

### Security

All tables implement Row Level Security (RLS) policies:
- Users can only access their own data
- Lawyers can access contracts assigned to them
- Enterprise admins can manage organization data
- Audit logs are read-only for organization members

## User Roles

### Startup
- Create and manage contracts
- Send contracts for legal review
- Collaborate with team members
- View billing and usage

### Lawyer
- View assigned contract reviews
- Add comments and suggestions
- Track earnings and completed reviews
- Manage review queue

### Enterprise Admin
- Manage organization settings
- Control user access and permissions
- View all organization contracts
- Access audit logs and reporting

## Apple HIG Compliance

### Colors
- Primary: Apple Blue (#007AFF)
- Success: Apple Green (#34C759)
- Warning: Apple Orange (#FF9500)
- Error: Apple Red (#FF3B30)
- Neutrals: Gray scale from 50-900

### Typography
- Font Family: SF Pro / SF Pro Text
- Line Height: 150% for body, 120% for headings
- Font Weights: Light, Regular, Medium, Semibold, Bold

### Components
- Rounded corners: 10px (standard), 14px (large), 20px (xl)
- Shadows: Subtle, layered shadows (apple, apple-md, apple-lg)
- Spacing: 8px base unit system
- Transitions: 200ms ease-out for smooth interactions

### Interactions
- Hover states on all interactive elements
- Active scale (0.98) for buttons
- Clear focus states with blue ring
- Loading states with spinners

## Future Enhancements

- [ ] Stripe integration for lawyer review payments
- [ ] Real-time collaborative editing
- [ ] Contract templates library
- [ ] E-signature integration
- [ ] Advanced search with AI
- [ ] Mobile apps (iOS/Android)
- [ ] Email notifications
- [ ] Export to PDF

## License

MIT License - see LICENSE file for details

## Support

For support, please contact your administrator or visit our documentation.
