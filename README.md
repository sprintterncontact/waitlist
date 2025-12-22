# SME Pilot Programme Waitlist Page

A clean, professional one-page website for an exclusive SME pilot programme targeting UK small business owners (1–20 employees).

## Features

- **Professional Design**: Minimal, modern SaaS/consultancy aesthetic
- **Trust-Focused**: Calm, trustworthy tone without startup hype
- **Task-Focused Form**: Collects specific task requests, not newsletter signups
- **Responsive**: Works seamlessly on desktop, tablet, and mobile
- **Accessible**: Clean typography and high readability

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
```

This creates an optimized production build in the `build` folder.

## Design Principles

- **Colors**: Deep navy (#1a2332), soft neutrals, muted blue accent (#4a90a4)
- **Typography**: Inter font family for clean, professional readability
- **Tone**: Professional, calm, trustworthy, practical
- **Goal**: Make visitors think "This looks serious, low-risk, and useful"

## Form Fields

The waitlist form collects:
- Company name
- Your role
- Email
- Website or LinkedIn
- Task description (specific task needed in next 30 days)
- Timeline (This week / This month / Later)
- Budget range (£50–£75 / £75–£150 / £150+)

## Project Structure

```
├── public/
│   └── index.html
├── src/
│   ├── App.js          # Main component with all sections
│   ├── App.css         # Professional styling
│   ├── index.js        # React entry point
│   └── index.css       # Global styles
├── package.json
└── README.md
```

