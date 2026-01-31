# Temple React Application - Testing Guide

## Overview
This guide explains how to run and write tests for the Temple React application. The project includes unit tests for services, hooks, pages, and contexts.

## Test Files Created

### 1. **Service Tests** (`src/services/api.test.js`)
Tests for API service functions including:
- Events CRUD operations
- Donors management
- Priests, Services, and Timings API calls
- Authentication API

**Run with:**
```bash
npm test -- api.test.js
```

### 2. **Hook Tests** (`src/hooks/useAPI.test.js`)
Tests for custom React hooks:
- `useTempleTimings` - Fetch temple opening/closing times
- `useUpcomingEvents` - Fetch upcoming events
- `useAllEvents` - Fetch all events
- `useAllPriests` - Fetch all priests
- `useAllDonors` - Fetch all donors
- `useServices` - Fetch services

**Run with:**
```bash
npm test -- useAPI.test.js
```

### 3. **Context Tests**
- **AuthContext** (`src/context/AuthContext.test.js`)
  - Login/logout functionality
  - Token storage
  - Authentication state management

- **LanguageContext** (`src/context/LanguageContext.test.js`)
  - Language switching
  - Translation function
  - Language persistence

**Run with:**
```bash
npm test -- AuthContext.test.js
npm test -- LanguageContext.test.js
```

### 4. **Page Component Tests**
Each page component has its own test file:

- **Home.test.js** - Home page rendering
- **Events.test.js** - Events listing and filtering
- **Priests.test.js** - Priests information display
- **Services.test.js** - Services listing with prices
- **Timings.test.js** - Temple opening hours
- **Admin.test.js** - Admin dashboard and authentication

**Run with:**
```bash
npm test -- [PageName].test.js
```

## Setup & Installation

### Install Testing Dependencies
```bash
npm install
```

This will install:
- `@testing-library/react` - React testing utilities
- `@testing-library/jest-dom` - Custom Jest matchers
- `@testing-library/user-event` - User interaction simulation
- `jest` - Testing framework
- `jest-environment-jsdom` - DOM environment for tests

### Configuration Files
- **src/setupTests.js** - Jest configuration and global mocks
- **.env files** - Environment variables for testing

## Running Tests

### Run All Tests
```bash
npm test
```

### Run Tests in Watch Mode
```bash
npm test -- --watch
```

### Run Specific Test File
```bash
npm test -- api.test.js
```

### Run Tests with Coverage
```bash
npm test -- --coverage
```

This will generate a coverage report showing:
- Statements coverage
- Branches coverage
- Functions coverage
- Lines coverage

### Run Tests in CI Mode (Non-interactive)
```bash
npm test -- --ci --coverage --watchAll=false
```

## Test Examples

### Example 1: Testing API Calls
```javascript
it('should fetch all events successfully', async () => {
  const mockEvents = [
    { id: 1, eventName: 'Diwali' },
    { id: 2, eventName: 'Holi' }
  ];

  api.eventsAPI.getAll.mockResolvedValue({ data: mockEvents });
  
  const result = await eventsAPI.getAll();
  expect(result.data).toEqual(mockEvents);
});
```

### Example 2: Testing React Hooks
```javascript
it('should fetch temple timings on mount', async () => {
  const { result } = renderHook(() => useTempleTimings());
  
  expect(result.current.loading).toBe(true);
  
  await waitFor(() => {
    expect(result.current.loading).toBe(false);
  });
  
  expect(result.current.timings).toBeDefined();
});
```

### Example 3: Testing React Components
```javascript
it('should render Events page without crashing', () => {
  render(
    <BrowserRouter>
      <LanguageProvider>
        <AuthProvider>
          <Events />
        </AuthProvider>
      </LanguageProvider>
    </BrowserRouter>
  );
  
  expect(screen.getByText(/Events/i)).toBeInTheDocument();
});
```

## Writing New Tests

### Basic Test Structure
```javascript
describe('Feature Name', () => {
  beforeEach(() => {
    // Setup before each test
  });

  it('should do something', () => {
    // Test code
    expect(result).toBe(expectedValue);
  });

  afterEach(() => {
    // Cleanup after each test
  });
});
```

### Common Testing Patterns

#### 1. Testing Async Functions
```javascript
it('should handle async operations', async () => {
  const promise = fetchData();
  
  await waitFor(() => {
    expect(result).toBeDefined();
  });
});
```

#### 2. Testing User Interactions
```javascript
it('should handle button click', () => {
  render(<Component />);
  
  fireEvent.click(screen.getByRole('button'));
  
  expect(screen.getByText('Result')).toBeInTheDocument();
});
```

#### 3. Testing API Errors
```javascript
it('should handle API errors', async () => {
  api.getEvents.mockRejectedValue(new Error('Network error'));
  
  const { result } = renderHook(() => useEvents());
  
  await waitFor(() => {
    expect(result.current.error).toBeTruthy();
  });
});
```

## Mocking

### Mock axios
```javascript
jest.mock('axios');

axios.create = jest.fn(() => ({
  get: jest.fn().mockResolvedValue({ data: mockData })
}));
```

### Mock API Functions
```javascript
jest.mock('../services/api');

api.eventsAPI.getAll.mockResolvedValue({ data: mockEvents });
```

### Mock Custom Hooks
```javascript
jest.mock('../hooks/useAPI', () => ({
  useTempleTimings: () => ({
    timings: mockTimings,
    loading: false,
    error: null
  })
}));
```

## Best Practices

1. **Use descriptive test names** - Test names should clearly describe what is being tested
2. **Test behavior, not implementation** - Focus on what the component does, not how it does it
3. **Keep tests isolated** - Each test should be independent and not rely on other tests
4. **Use meaningful assertions** - Use specific assertions that clearly show what's expected
5. **Mock external dependencies** - Mock API calls, network requests, and other external dependencies
6. **Test user interactions** - Test how users interact with components, not internal state
7. **Clean up after tests** - Clear mocks and restore state after each test

## Continuous Integration

To run tests in CI/CD pipeline:

```bash
npm test -- --ci --coverage --watchAll=false
```

This command:
- Runs all tests in CI mode
- Generates coverage report
- Exits with proper exit codes for CI/CD systems

## Troubleshooting

### Tests Not Running
- Ensure all dependencies are installed: `npm install`
- Check that Jest is properly configured in `package.json`
- Verify test files have `.test.js` extension

### Mocking Issues
- Ensure mocks are placed before imports
- Clear mocks in `beforeEach` hook
- Use `jest.mock()` at module level

### Async Test Failures
- Use `async/await` with `waitFor` for async operations
- Ensure proper timeout configuration for slow operations
- Check that promises are properly awaited

### Component Rendering Issues
- Wrap components with necessary providers (AuthProvider, LanguageProvider, BrowserRouter)
- Ensure all required props are passed
- Check for console errors in test output

## Resources

- [Jest Documentation](https://jestjs.io/)
- [React Testing Library Docs](https://testing-library.com/react)
- [Testing Best Practices](https://github.com/testing-library/react-testing-library)
- [React Hooks Testing](https://react-hooks-testing-library.com/)

## Coverage Goals

Aim for:
- **Statements:** 80%+
- **Branches:** 75%+
- **Functions:** 80%+
- **Lines:** 80%+

Run coverage report:
```bash
npm test -- --coverage
```
