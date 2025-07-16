# 🔧 Troubleshooting Guide

## Common Issues and Solutions

### 1. **504 Outdated Optimize Dep Errors**

**Symptoms:**
- Failed to load resource: 504 (Outdated Optimize Dep)
- React/React-DOM loading issues
- Vite dependency optimization problems

**Solutions:**
```bash
# Clear Vite cache
rm -rf node_modules/.vite

# Kill existing processes on port 5173
lsof -ti:5173 | xargs kill -9

# Restart with clean cache
npm run dev:clean
```

### 2. **Port 5173 Already in Use**

**Symptoms:**
- Error: Port 5173 is already in use
- Server won't start

**Solutions:**
```bash
# Kill all processes on port 5173
lsof -ti:5173 | xargs kill -9

# Or use a different port
npm run dev -- --port 3000
```

### 3. **Memory Issues (Out of Memory)**

**Symptoms:**
- FATAL ERROR: JavaScript heap out of memory
- Slow development server
- Crashes during build

**Solutions:**
```bash
# Use low memory mode
npm run dev:low-memory

# Or increase memory allocation
NODE_OPTIONS="--max-old-space-size=8192" npm run dev
```

### 4. **Tidio Font Preload Warnings**

**Symptoms:**
- Console warnings about Tidio fonts
- "resource was preloaded but not used"

**Note:** These are normal warnings and don't affect functionality. Tidio loads fonts asynchronously.

### 5. **Hot Module Replacement (HMR) Issues**

**Symptoms:**
- Changes not reflecting immediately
- Browser not updating

**Solutions:**
```bash
# Clear browser cache
# Hard refresh: Cmd+Shift+R (Mac) or Ctrl+Shift+R (Windows)

# Restart dev server
npm run dev:clean
```

## Quick Commands

```bash
# Clean start (recommended)
npm run dev:clean

# Low memory mode
npm run dev:low-memory

# Kill port conflicts
lsof -ti:5173 | xargs kill -9

# Clear all caches
rm -rf node_modules/.vite && npm run dev
```

## Prevention Tips

1. **Always use `npm run dev:clean`** when starting development
2. **Close unused browser tabs** to reduce memory usage
3. **Restart dev server** if you notice performance issues
4. **Keep your Node.js version updated**

## When to Contact Support

- Persistent memory issues after trying all solutions
- Build failures that don't resolve with cache clearing
- Network-related errors that persist across restarts 