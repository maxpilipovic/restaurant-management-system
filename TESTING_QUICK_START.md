# Testing Quick Start Guide

## Quick Commands

### Backend Tests

```bash
cd backend
npm install  # Install dependencies including supertest
npm test     # Run all tests
```

### Frontend Tests

```bash
cd frontend
npm install --legacy-peer-deps  # Install dependencies (use --legacy-peer-deps for React 19 compatibility)
npm test     # Run all tests
npm run test:ui  # Run with UI
```

**Note**: If you encounter peer dependency conflicts with React 19, use `--legacy-peer-deps` flag during installation.

### E2E Tests

```bash
cd frontend/src/tests
pip install selenium  # If not already installed
python LoginTest.py   # Run login E2E test
```

## Prerequisites

### Backend

- Node.js 18+
- npm packages: `jest`, `supertest`, `@jest/globals`

### Frontend

- Node.js 18+
- npm packages: `vitest`, `@testing-library/react`, `@testing-library/jest-dom`, `jsdom`

### E2E

- Python 3.7+
- Selenium: `pip install selenium`
- Edge WebDriver installed
- Frontend server running on `http://localhost:5173`

## Test Files

- **Backend**: `backend/src/__tests__/api.test.js`
- **Frontend**: `frontend/src/tests/LoginForm.test.jsx`
- **E2E**: `frontend/src/tests/LoginTest.py`

## Full Documentation

See [TESTING.md](./TESTING.md) for comprehensive testing documentation.
