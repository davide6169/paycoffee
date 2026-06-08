# PayCoffee Web App

A modern web replica of the classic iOS PayCoffee app (2011-2012) for tracking coffee payments and credits among friends.

## Features

- **Person Management**: Add, remove, and manage friends in your coffee group
- **Smart Payment Algorithm**: Automatically selects the best payer based on credits
- **Credit System**: Track who owes coffee with color-coded indicators
- **Touch Gestures**: Single tap to select, double tap for manual payment
- **Export/Import**: Share data via CSV compatible with the iOS app
- **Persistent Storage**: Data saves automatically to localStorage
- **Mobile-First UI**: Pixel-perfect iOS replica with Georgia fonts and dark theme

## Tech Stack

- **Framework**: Next.js 14+ with TypeScript
- **Styling**: CSS Variables + Custom CSS (iOS replica)
- **State Management**: React Context + Hooks
- **Storage**: localStorage (offline-first)
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Open http://localhost:3000
```

### Build for Production

```bash
# Create production build
npm run build

# Preview production build
npm start

# Run type checking
npm run type-check

# Run linting
npm run lint
```

## How It Works

### Credit System

1. Each person has a credit balance (can be positive, negative, or zero)
2. **Green** (positive): Owes less coffee
3. **Red** (negative): Owes more coffee
4. **Yellow** (zero): Balanced

### Payment Process

1. **Select** people who had coffee (single tap)
2. **Tap "Pay"** to process payment
3. **Smart algorithm** selects best payer:
   - Person with lowest credits
   - If tied, oldest payment date
   - If still tied, random selection
4. **Credits update**:
   - Payer gains +(N-1) credits
   - Each selected person loses -1 credit
   - N = number of selected persons

### Manual Payment

- **Double tap** on an unselected person to manually choose them as payer

### Edit Mode

- Tap **"Edit"** to enter edit mode
- **Remove** persons with red button
- Access **Actions** menu for export/import

### Export/Import

- **Export to Clipboard**: Copy CSV data
- **Export to File**: Download .csv file
- **Export to Email**: Open email client with data
- **Import from Clipboard**: Paste CSV data to import

CSV Format (iOS compatible):
```
name;credits;date
Tony;1;2012-10-28
Peter;2;2012-10-29
Phil;-3;2012-10-18
```

## Project Structure

```
paycoffee/
├── app/
│   ├── layout.tsx          # Root layout with metadata
│   ├── page.tsx            # Main app page
│   └── globals.css         # Global iOS styles
├── components/
│   ├── Navigation/         # Top navigation bar
│   ├── Toolbar/            # Bottom toolbar
│   ├── PersonList/         # Main person list
│   ├── AddPersonDialog/    # Add person modal
│   ├── PaymentDialog/      # Payment confirmation
│   ├── InfoView/           # Help/information
│   └── ExportImportMenu/   # Export/import actions
├── contexts/
│   └── AppContext.tsx      # Global state management
├── hooks/
│   ├── usePaymentState.ts  # Payment logic hooks
│   ├── usePersonList.ts    # Person list hooks
│   └── useTouchGestures.ts # Touch gesture handlers
├── lib/
│   ├── types.ts            # TypeScript interfaces
│   ├── constants.ts        # App constants
│   ├── storage.ts          # localStorage utilities
│   ├── paymentLogic.ts     # CORE business logic
│   └── exportImport.ts     # CSV export/import
└── public/
    ├── images/             # Coffee-themed backgrounds
    └── fonts/              # Georgia font files
```

## Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

Or connect your GitHub repository to Vercel for automatic deployments.

## Browser Compatibility

- **iOS Safari** (primary target)
- **Chrome Mobile** (Android)
- **Firefox Mobile**
- **Desktop browsers** (Chrome, Firefox, Safari, Edge)

## Credits

- Original iOS App: PayCoffee (2011-2012)
- Web Replica: Built with Next.js 14+

---

**Enjoy tracking your coffee payments! ☕**
