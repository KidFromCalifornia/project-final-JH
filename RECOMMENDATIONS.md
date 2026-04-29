# Code Recommendations & Fixes

## Priority Issues

### 🔴 **CRITICAL - Security & Auth**

#### 1. **Weak Password Validation**

- **File**: `backend/src/middleware/validation.js`
- **Issue**: Password only requires 8 characters, no complexity rules
- **Risk**: Weak passwords can be brute-forced
- **Fix**:

```javascript
// Add password complexity validation
const isStrongPassword = (password) => {
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*]/.test(password);
  const isLongEnough = password.length >= 10;

  return hasUppercase && hasLowercase && hasNumbers && hasSpecialChar && isLongEnough;
};
```

#### 2. **JWT Token Expiration Too Long**

- **File**: `backend/src/routes/auth.js` (line 36)
- **Issue**: Token expires in 7 days - security risk
- **Recommendation**: Use shorter expiration (1-2 hours) with refresh token pattern

```javascript
// Instead of:
const token = jwt.sign(..., { expiresIn: '7d' });

// Use:
const token = jwt.sign(..., { expiresIn: '2h' });
const refreshToken = jwt.sign(..., { expiresIn: '7d' });
```

#### 3. **localStorage Used for Auth Tokens**

- **File**: `frontend/src/stores/useCafeStore.js` (line 141)
- **Issue**: localStorage is vulnerable to XSS attacks
- **Fix**: Use httpOnly cookies with backend session management

```javascript
// Frontend should not store sensitive tokens in localStorage
// Use cookies set by backend with httpOnly, Secure, SameSite flags
```

#### 4. **No Rate Limiting on Login**

- **File**: `backend/src/routes/auth.js`
- **Issue**: No protection against brute-force attacks
- **Fix**: Add express-rate-limit

```javascript
import rateLimit from 'express-rate-limit';

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts
  message: 'Too many login attempts, try again later',
});

router.post('/login', loginLimiter, validateLogin, async (req, res) => {
  // ...
});
```

---

### 🟠 **HIGH - Performance & Optimization**

#### 5. **Missing Database Indexes**

- **Files**: Backend models
- **Issue**: No indexes on frequently queried fields (email, username, category)
- **Fix**: Add indexes to models

```javascript
userSchema.index({ email: 1 });
userSchema.index({ username: 1 });
cafeSchema.index({ category: 1 });
cafeSchema.index({ 'locations.neighborhood': 1 });
```

#### 6. **N+1 Query Problem**

- **File**: `backend/src/routes/cafeSubmissions.js` (line 74)
- **Issue**: Populating fields without limit could cause performance issues
- **Status**: Currently good with Promise.all, but monitor

#### 7. **No Pagination Limits Enforced**

- **File**: `backend/src/routes/cafeSubmissions.js`
- **Issue**: Max limit not set - users could request 10,000 items
- **Fix**:

```javascript
const maxLimit = 100;
const limit = Math.min(parseInt(req.query.limit) || 20, maxLimit);
```

#### 8. **Missing API Response Caching**

- **Issue**: No caching strategy for metadata, cafes list
- **Recommendation**: Add Redis or in-memory caching for static data

```javascript
// Cache form options for 1 hour
router.get('/form-options', async (req, res) => {
  const cached = cache.get('formOptions');
  if (cached) return res.json(cached);

  const data = await fetchFormOptions();
  cache.set('formOptions', data, 3600);
  res.json(data);
});
```

---

### 🟡 **MEDIUM - Code Quality**

#### 9. **Inconsistent Error Responses**

- **Files**: Multiple route files
- **Issue**: Some return `error`, some return `message`, inconsistent status codes
- **Fix**: Create standardized response wrapper

```javascript
// utils/apiResponse.js
export const sendSuccess = (res, data, statusCode = 200) => {
  res.status(statusCode).json({
    success: true,
    data,
  });
};

export const sendError = (res, error, statusCode = 400) => {
  res.status(statusCode).json({
    success: false,
    error: typeof error === 'string' ? error : error.message,
  });
};
```

#### 10. **No Input Sanitization**

- **Files**: All route handlers
- **Issue**: No protection against NoSQL injection or XSS
- **Fix**: Add mongo-sanitize and express-validator

```javascript
import mongoSanitize from 'mongo-sanitize';
import { body, validationResult } from 'express-validator';

app.use(mongoSanitize()); // Prevents NoSQL injection

router.post(
  '/cafes',
  [
    body('name').trim().isLength({ min: 2 }).escape(),
    body('address').trim().isLength({ min: 5 }).escape(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    // ...
  }
);
```

#### 11. **Duplicate Form State Logic**

- **Files**: `LoginForm.jsx`, `NewCafeForm.jsx`, `TastingForm.jsx`
- **Issue**: Similar form handling code repeated
- **Recommendation**: Create custom hook `useForm()`

```javascript
// hooks/useForm.js
export const useForm = (initialValues, onSubmit) => {
  const [form, setForm] = useState(initialValues);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onSubmit(form);
  };

  return { form, setForm, errors, setErrors, handleChange, handleSubmit };
};
```

#### 12. **Missing Null/Undefined Checks**

- **File**: `frontend/src/pages/AdminPage.jsx` (line 192)
- **Issue**: `cafesData.data` could be undefined
- **Fix**: Add defensive checks

```javascript
const cafes = cafesData?.data ?? [];
const submissions = submissionsData?.data ?? [];
const tastings = tastingsData?.data ?? [];
```

---

### 🟡 **MEDIUM - Error Handling**

#### 13. **Generic Error Messages**

- **File**: `frontend/src/utils/errorHandler.js`
- **Issue**: All network errors show same message
- **Recommendation**: Differentiate by error type

```javascript
export const handleApiError = (error, showSnackbar, defaultMessage) => {
  if (!navigator.onLine) {
    showSnackbar('No internet connection', 'error');
  } else if (error.status === 401) {
    showSnackbar('Your session expired. Please login again.', 'warning');
  } else if (error.status === 403) {
    showSnackbar('You do not have permission to perform this action.', 'error');
  } else if (error.status === 404) {
    showSnackbar('Resource not found.', 'error');
  } else {
    showSnackbar(error.message || defaultMessage, 'error');
  }
};
```

#### 14. **Unhandled Promise Rejections**

- **File**: Multiple places with `Promise.all()`
- **Issue**: No `.catch()` for individual promise failures
- **Fix**: Use Promise.allSettled() for better error handling

```javascript
const results = await Promise.allSettled([fetch1(), fetch2(), fetch3()]);

results.forEach((result, index) => {
  if (result.status === 'rejected') {
    console.error(`Request ${index} failed:`, result.reason);
  }
});
```

---

### 🟡 **MEDIUM - Accessibility**

#### 15. **Missing ARIA Labels**

- **Files**: Form inputs, buttons
- **Recommendation**: Ensure all interactive elements have accessible labels

```jsx
// Add aria-invalid for form errors
<TextField
  aria-invalid={!!errors.name}
  aria-describedby={errors.name ? 'name-error' : undefined}
  error={!!errors.name}
  helperText={errors.name}
/>;
{
  errors.name && <span id="name-error">{errors.name}</span>;
}
```

#### 16. **Color-Only Status Indicators**

- **File**: `frontend/src/components/map/MapIcons.jsx`
- **Issue**: Single color for all icons (though improved)
- **Recommendation**: Add additional indicators (shape, pattern) for color-blind users

---

### 🔵 **LOW - Nice to Have**

#### 17. **No Request/Response Logging**

- **Recommendation**: Add Winston/Morgan for logging

```javascript
import morgan from 'morgan';
app.use(morgan('combined'));
```

#### 18. **Missing Environment Validation**

- **Recommendation**: Validate required env vars on startup

```javascript
const requiredEnvVars = ['MONGODB_URI', 'JWT_SECRET', 'NODE_ENV', 'FRONTEND_URL'];

requiredEnvVars.forEach((envVar) => {
  if (!process.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
});
```

#### 19. **No API Request Deduplication**

- **Issue**: Same API call can be made multiple times
- **Recommendation**: Add request caching layer

```javascript
const requestCache = new Map();

export const cachedApiCall = (url, options = {}, cacheDuration = 5000) => {
  const cacheKey = `${url}-${JSON.stringify(options)}`;

  if (requestCache.has(cacheKey)) {
    return requestCache.get(cacheKey);
  }

  const promise = apiCall(url, options);
  requestCache.set(cacheKey, promise);

  setTimeout(() => requestCache.delete(cacheKey), cacheDuration);

  return promise;
};
```

#### 20. **No Unit/Integration Tests**

- **Recommendation**: Add Jest/Vitest tests for critical paths
- **Priority components**: Auth, form validation, error handling

---

## Implementation Priority

### Week 1 (Security)

1. ✅ Fix JWT expiration (2 hours instead of 7 days)
2. ✅ Add rate limiting to login
3. ✅ Add input sanitization
4. ✅ Move tokens to httpOnly cookies

### Week 2 (Performance)

5. ✅ Add database indexes
6. ✅ Enforce pagination limits
7. ✅ Add API response caching

### Week 3 (Code Quality)

8. ✅ Standardize error responses
9. ✅ Create useForm hook
10. ✅ Add environment validation

### Week 4 (Testing & Documentation)

11. ✅ Write unit tests
12. ✅ Update API documentation
13. ✅ Add request logging

---

## Files Most Critical to Review

1. `backend/src/routes/auth.js` - Authentication logic
2. `backend/src/middleware/validation.js` - Input validation
3. `frontend/src/utils/errorHandler.js` - Error handling
4. `frontend/src/stores/useCafeStore.js` - State management
5. `backend/src/server.js` - Server configuration

---

## Estimated Time to Fix

- **Critical (Security)**: 4-6 hours
- **High (Performance)**: 3-4 hours
- **Medium (Quality)**: 6-8 hours
- **Low (Nice to Have)**: 3-4 hours

**Total**: ~16-22 hours of development work
