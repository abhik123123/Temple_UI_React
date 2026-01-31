# Testing Quick Reference Guide

## Quick Start (30 seconds)

```bash
# 1. Install dependencies
npm install

# 2. Run all tests
npm test

# 3. Press 'a' to run all tests or 'q' to quit
```

## Common Commands

| Command | Purpose |
|---------|---------|
| `npm test` | Run tests in watch mode |
| `npm test -- --coverage` | Generate coverage report |
| `npm test -- api.test.js` | Run specific test file |
| `npm test -- --watch=false` | Run once and exit |
| `npm test -- --ci` | CI mode (non-interactive) |

## Test File Locations

```
Unit Tests          Tests/      Context
├─ api.test.js         ├─ Home.test.js       ├─ AuthContext.test.js
├─ useAPI.test.js      ├─ Events.test.js     ├─ LanguageContext.test.js
│                      ├─ Priests.test.js
│                      ├─ Services.test.js
│                      ├─ Timings.test.js
│                      └─ Admin.test.js
```

## Common Test Patterns

### 1. Test API Calls
```javascript
jest.mock('../services/api');
api.getData.mockResolvedValue({ data: mockData });

it('should fetch data', async () => {
  const result = await api.getData();
  expect(result.data).toEqual(mockData);
});
```

### 2. Test React Hooks
```javascript
const { result } = renderHook(() => useMyHook());
await waitFor(() => {
  expect(result.current.data).toBeDefined();
});
```

### 3. Test Components
```javascript
render(<Component />);
expect(screen.getByText(/Expected/i)).toBeInTheDocument();
```

### 4. Test User Interactions
```javascript
fireEvent.click(screen.getByRole('button'));
await waitFor(() => {
  expect(screen.getByText(/Updated/i)).toBeInTheDocument();
});
```

### 5. Test Forms
```javascript
const input = screen.getByRole('textbox');
fireEvent.change(input, { target: { value: 'test' } });
fireEvent.click(screen.getByRole('button', { name: /Submit/i }));
```

## Mocking Cheat Sheet

### Mock API
```javascript
jest.mock('../services/api');
api.eventsAPI.getAll.mockResolvedValue({ data: mockEvents });
```

### Mock Hook
```javascript
jest.mock('../hooks/useAPI', () => ({
  useTempleTimings: () => ({ timings: [], loading: false })
}));
```

### Mock Module
```javascript
jest.mock('axios');
```

### Clear Mocks
```javascript
jest.clearAllMocks();          // Clear all mocks
jest.restoreAllMocks();        // Restore all mocks
localStorage.clear();          // Clear storage
```

## Jest Matchers (Common)

```javascript
// Existence
expect(element).toBeInTheDocument();
expect(element).toBeDefined();
expect(element).toBeTruthy();

// Equality
expect(value).toBe(5);
expect(value).toEqual(mockData);

// Text Content
expect(element).toHaveTextContent('Expected Text');
expect(element).toHaveTextContent(/regex/i);

// Visibility
expect(element).toBeVisible();
expect(element).not.toBeVisible();

// Attributes
expect(element).toHaveAttribute('disabled');
expect(element).toHaveClass('active');

// Arrays
expect(array).toHaveLength(5);
expect(array).toContain('item');

// Functions
expect(mockFn).toHaveBeenCalled();
expect(mockFn).toHaveBeenCalledWith(arg1, arg2);
expect(mockFn).toHaveBeenCalledTimes(2);
```

## React Testing Library

```javascript
// Query Methods (throw error if not found)
screen.getByRole('button', { name: /Click/i })
screen.getByText('Hello')
screen.getByLabelText('Username')
screen.getByPlaceholderText('Enter name')

// Query Methods (return null if not found)
screen.queryByRole('button')
screen.queryByText('Hello')

// Query Methods (for multiple elements)
screen.getAllByRole('button')
screen.queryAllByText('Item')
```

## Common Async Patterns

```javascript
// Wait for element to appear
await waitFor(() => {
  expect(screen.getByText(/Loaded/)).toBeInTheDocument();
});

// Act on state changes
await act(async () => {
  fireEvent.click(button);
  await promise;
});

// Wait for specific condition
await waitFor(() => {
  expect(result.current.loading).toBe(false);
}, { timeout: 3000 });
```

## Setup/Teardown

```javascript
describe('Feature', () => {
  beforeEach(() => {
    // Runs before each test
    jest.clearAllMocks();
    localStorage.clear();
  });

  afterEach(() => {
    // Runs after each test
    jest.clearAllMocks();
  });

  beforeAll(() => {
    // Runs once before all tests
  });

  afterAll(() => {
    // Runs once after all tests
  });
});
```

## Component Wrapper

```javascript
render(
  <BrowserRouter>
    <LanguageProvider>
      <AuthProvider>
        <YourComponent />
      </AuthProvider>
    </LanguageProvider>
  </BrowserRouter>
);
```

## Debugging Tests

```javascript
// Print DOM
screen.debug();
screen.debug(element);

// Check what's in the DOM
screen.logTestingPlaygroundURL();

// Set longer timeout
jest.setTimeout(10000);

// Add console logs
console.log('Debug message', variable);

// Use debugger
debugger;
```

## Test File Structure

```javascript
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Component from './Component';

describe('Component Name', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should do something', () => {
    render(<Component />);
    expect(screen.getByText(/Expected/i)).toBeInTheDocument();
  });

  it('should handle user interaction', async () => {
    render(<Component />);
    fireEvent.click(screen.getByRole('button'));
    
    await waitFor(() => {
      expect(screen.getByText(/Result/i)).toBeInTheDocument();
    });
  });
});
```

## Coverage Report

```bash
# Generate coverage
npm test -- --coverage

# Open coverage report
# Windows: coverage\lcov-report\index.html
# Mac: open coverage/lcov-report/index.html
# Linux: xdg-open coverage/lcov-report/index.html
```

## Keyboard Shortcuts in Watch Mode

| Key | Action |
|-----|--------|
| `a` | Run all tests |
| `f` | Run only failed tests |
| `p` | Filter by filename |
| `t` | Filter by test name |
| `o` | Run changed tests only |
| `c` | Clear filters |
| `q` | Quit watch mode |

## Performance Tips

1. **Use `jest.clearAllMocks()` in beforeEach**
2. **Mock external dependencies**
3. **Use `screen.queryBy` instead of `getBy` when element might not exist**
4. **Avoid unnecessary `waitFor` calls**
5. **Keep test data minimal**

## Common Issues & Fixes

| Issue | Fix |
|-------|-----|
| "Can't find element" | Use `screen.debug()` to see DOM |
| "Timeout waiting for element" | Increase timeout with `{ timeout: 5000 }` |
| "Mock not working" | Ensure mock is at module level |
| "Component not rendering" | Wrap with required providers |
| "localStorage errors" | Add mock in setupTests.js |

## Resources

- [Jest Docs](https://jestjs.io/)
- [React Testing Library](https://testing-library.com/react)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
- [Full Guide](./TESTING_GUIDE.md)
- [Test Overview](./COMPLETE_TEST_OVERVIEW.md)

---
**Print this page and keep it handy!** 📋
