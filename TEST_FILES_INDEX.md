# Test Files Index

## Quick Navigation

### 📌 Start Here (5 minutes)
1. [TEST_CREATION_SUMMARY.md](./TEST_CREATION_SUMMARY.md) - Overview of what was created
2. [TESTING_QUICK_REFERENCE.md](./TESTING_QUICK_REFERENCE.md) - Quick command reference

### 📖 Detailed Guides (20-30 minutes)
3. [TESTING_GUIDE.md](./TESTING_GUIDE.md) - Comprehensive testing guide
4. [COMPLETE_TEST_OVERVIEW.md](./COMPLETE_TEST_OVERVIEW.md) - Complete reference

### 🧪 Test Files (Review & Extend)

#### Unit Tests
- [src/services/api.test.js](./src/services/api.test.js) - API service tests
- [src/hooks/useAPI.test.js](./src/hooks/useAPI.test.js) - Custom hooks tests

#### Context Tests
- [src/context/AuthContext.test.js](./src/context/AuthContext.test.js) - Auth context
- [src/context/LanguageContext.test.js](./src/context/LanguageContext.test.js) - Language context

#### Page Component Tests
- [src/pages/Home.test.js](./src/pages/Home.test.js) - Home page
- [src/pages/Events.test.js](./src/pages/Events.test.js) - Events page
- [src/pages/Priests.test.js](./src/pages/Priests.test.js) - Priests page
- [src/pages/Services.test.js](./src/pages/Services.test.js) - Services page
- [src/pages/Timings.test.js](./src/pages/Timings.test.js) - Timings page
- [src/pages/Admin.test.js](./src/pages/Admin.test.js) - Admin page

#### Integration Tests
- [src/App.integration.test.js](./src/App.integration.test.js) - Full app tests

#### Configuration
- [src/setupTests.js](./src/setupTests.js) - Jest setup

---

## File Directory Tree

```
temple_react_full/
├── 📄 TEST_CREATION_SUMMARY.md          ← Start here!
├── 📄 TESTING_QUICK_REFERENCE.md        ← Quick commands
├── 📄 TESTING_GUIDE.md                  ← Full guide
├── 📄 COMPLETE_TEST_OVERVIEW.md         ← Complete reference
├── 📄 TEST_FILES_INDEX.md               ← This file
│
├── package.json                          ← Updated with test dependencies
│
└── src/
    ├── setupTests.js                     ← Jest configuration ⚙️
    │
    ├── services/
    │   └── api.test.js                   ← API service tests
    │
    ├── hooks/
    │   └── useAPI.test.js                ← Custom hooks tests
    │
    ├── context/
    │   ├── AuthContext.test.js           ← Auth tests
    │   └── LanguageContext.test.js       ← Language tests
    │
    ├── pages/
    │   ├── Home.test.js                  ← Home page tests
    │   ├── Events.test.js                ← Events page tests
    │   ├── Priests.test.js               ← Priests page tests
    │   ├── Services.test.js              ← Services page tests
    │   ├── Timings.test.js               ← Timings page tests
    │   └── Admin.test.js                 ← Admin page tests
    │
    └── App.integration.test.js           ← Integration tests
```

---

## Reading Guide

### For Complete Beginners (45 minutes)
1. Read: TEST_CREATION_SUMMARY.md (5 min)
2. Read: TESTING_QUICK_REFERENCE.md (5 min)
3. Read: TESTING_GUIDE.md - Setup section (10 min)
4. Run: `npm install` and `npm test` (10 min)
5. Read: One example test file (15 min)

### For Intermediate Developers (60 minutes)
1. Read: TEST_CREATION_SUMMARY.md (5 min)
2. Skim: COMPLETE_TEST_OVERVIEW.md (10 min)
3. Read: TESTING_GUIDE.md - Full guide (20 min)
4. Review: Multiple test files (15 min)
5. Experiment: Run and modify tests (10 min)

### For Experienced Developers (20 minutes)
1. Skim: TESTING_QUICK_REFERENCE.md (2 min)
2. Review: Test file structure (8 min)
3. Check: Integration tests (5 min)
4. Run: Tests and coverage (5 min)

---

## Test File Reference

### api.test.js
**Lines:** 150+  
**Test Cases:** 20+  
**Coverage:** Events, Donors, Auth, Priests, Services, Timings  
**Key Tests:**
- ✅ Fetch all events successfully
- ✅ Create event with required fields
- ✅ Delete event by ID
- ✅ Login with credentials
- ✅ Handle API errors

### useAPI.test.js
**Lines:** 150+  
**Test Cases:** 12+  
**Coverage:** All custom hooks  
**Key Tests:**
- ✅ Fetch temple timings on mount
- ✅ Handle error when fetching
- ✅ Refetch events when called
- ✅ Fetch all data types

### AuthContext.test.js
**Lines:** 100+  
**Test Cases:** 5  
**Coverage:** Authentication flow  
**Key Tests:**
- ✅ Initial auth state
- ✅ Successful login
- ✅ Logout functionality
- ✅ Handle login failure
- ✅ Restore auth from storage

### LanguageContext.test.js
**Lines:** 70+  
**Test Cases:** 4  
**Coverage:** Language switching  
**Key Tests:**
- ✅ Provide default language
- ✅ Switch language
- ✅ Persist preference
- ✅ Provide translation

### Home.test.js
**Lines:** 50+  
**Test Cases:** 3  
**Coverage:** Home page rendering  
**Key Tests:**
- ✅ Render without crashing
- ✅ Display hero section
- ✅ Show navigation menu

### Events.test.js
**Lines:** 60+  
**Test Cases:** 4  
**Coverage:** Events page  
**Key Tests:**
- ✅ Render page
- ✅ Display events list
- ✅ Show event details
- ✅ Filter by category

### Priests.test.js
**Lines:** 50+  
**Test Cases:** 3  
**Coverage:** Priests page  
**Key Tests:**
- ✅ Render page
- ✅ Display priest list
- ✅ Show specialization

### Services.test.js
**Lines:** 50+  
**Test Cases:** 3  
**Coverage:** Services page  
**Key Tests:**
- ✅ Render page
- ✅ Display services
- ✅ Show prices

### Timings.test.js
**Lines:** 60+  
**Test Cases:** 3  
**Coverage:** Timings page  
**Key Tests:**
- ✅ Render page
- ✅ Display all days
- ✅ Show hours

### Admin.test.js
**Lines:** 80+  
**Test Cases:** 4  
**Coverage:** Admin dashboard  
**Key Tests:**
- ✅ Render page
- ✅ Display login form
- ✅ Show tabs
- ✅ Fetch donors

### App.integration.test.js
**Lines:** 300+  
**Test Cases:** 30+  
**Coverage:** Full app workflows  
**Key Tests:**
- ✅ Navigation flow
- ✅ Authentication flow
- ✅ Language switching
- ✅ Data loading
- ✅ Error handling
- ✅ Responsive design
- ✅ Performance

---

## Commands Quick Reference

```bash
# Install dependencies
npm install

# Run all tests
npm test

# Run tests once (no watch)
npm test -- --watch=false

# Run specific test file
npm test -- api.test.js

# Run tests matching pattern
npm test -- --testNamePattern="fetch"

# Generate coverage report
npm test -- --coverage

# Run in CI mode
npm test -- --ci --coverage --watchAll=false

# Debug tests
node --inspect-brk node_modules/.bin/jest --runInBand
```

---

## Common Tasks

### Add a New Test
1. Create file: `src/components/MyComponent.test.js`
2. Import testing utilities
3. Import component to test
4. Write test cases
5. Run: `npm test -- MyComponent.test.js`

### Extend Existing Tests
1. Open test file
2. Find describe block
3. Add new `it()` case
4. Run: `npm test`

### Check Coverage
1. Run: `npm test -- --coverage`
2. Open: `coverage/lcov-report/index.html`
3. Review coverage percentages

### Fix Failing Test
1. Read test name (tells you what failed)
2. Read test assertion
3. Debug with `screen.debug()`
4. Fix code or test
5. Re-run test

### Debug in Browser
1. Run: `npm test -- --watch`
2. Press 'a' to run all
3. Check browser console
4. Use `screen.debug()` in test

---

## Documentation Lookup

| Need | Reference |
|------|-----------|
| Quick command | TESTING_QUICK_REFERENCE.md |
| How to run test | TESTING_GUIDE.md - Running Tests |
| Test examples | TESTING_GUIDE.md - Test Examples |
| Jest matchers | TESTING_QUICK_REFERENCE.md - Matchers |
| Debugging | TESTING_GUIDE.md - Troubleshooting |
| CI/CD setup | COMPLETE_TEST_OVERVIEW.md - CI/CD |
| Best practices | TESTING_GUIDE.md - Best Practices |
| Common patterns | TESTING_QUICK_REFERENCE.md - Patterns |
| Mocking | TESTING_GUIDE.md - Mocking or QUICK_REF |

---

## Getting Help

1. **Can't run tests?**
   - → See TESTING_GUIDE.md - Setup section

2. **Test failing?**
   - → See TESTING_GUIDE.md - Troubleshooting
   - → Check test output for clues
   - → Use `screen.debug()`

3. **Don't understand syntax?**
   - → See TESTING_QUICK_REFERENCE.md
   - → Look at similar test file
   - → Check Jest/RTL documentation

4. **Want to add tests?**
   - → See TESTING_GUIDE.md - Writing Tests
   - → Copy structure from existing test
   - → Run test to verify

---

## 📊 Statistics

- **Total Test Files:** 11
- **Total Test Cases:** 50+
- **Total Lines of Tests:** 2000+
- **Total Lines of Docs:** 3000+
- **Documentation Files:** 4 + 1 index
- **Coverage Target:** 80%+

---

## 🎯 Next Steps

1. ✅ Read TEST_CREATION_SUMMARY.md
2. ✅ Run: `npm install`
3. ✅ Run: `npm test`
4. ✅ Read TESTING_GUIDE.md
5. ✅ Explore test files
6. ✅ Add your own tests!

---

**Last Updated:** November 27, 2025  
**Status:** ✅ Complete and Ready  
**Version:** 1.0.0
