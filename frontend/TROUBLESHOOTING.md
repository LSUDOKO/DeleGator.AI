# 🔧 Frontend Troubleshooting Guide

## ✅ Issue Fixed: Black Page with AIOrb Error

### Problem
```
Uncaught ReferenceError: AIOrb is not defined
```

### Solution
✅ **FIXED** - Added missing import in `Index.tsx`:
```typescript
import { AIOrb } from "@/components/ai/AIOrb";
```

---

## 🚀 How to Run Frontend

```bash
cd frontend
npm run dev
```

**URL:** http://localhost:5173 (or the port shown in terminal)

---

## 🐛 Common Issues & Solutions

### 1. Black/Blank Page
**Cause:** Missing component imports or runtime errors

**Solution:**
- Check browser console (F12) for errors
- Look for "ReferenceError" or "Cannot find module"
- Verify all imports in `Index.tsx`

### 2. MetaMask Warning (Safe to Ignore)
```
MetaMask encountered an error setting the global Ethereum provider
```

**Cause:** Multiple wallet extensions (MetaMask, Backpack, etc.)

**Solution:** This is just a warning and won't affect functionality. You can:
- Ignore it (safe)
- Disable one wallet extension
- Use only one wallet at a time

### 3. Component Not Found
**Cause:** Missing component file or incorrect import path

**Solution:**
```bash
# Check if component exists
ls -la src/components/ai/AIOrb.tsx
ls -la src/components/layout/LeftSidebar.tsx
ls -la src/components/layout/RightSidebar.tsx
```

### 4. Styling Not Applied
**Cause:** Tailwind CSS not processing or missing utilities

**Solution:**
- Restart dev server: `Ctrl+C` then `npm run dev`
- Clear browser cache: `Ctrl+Shift+R`
- Check `index.css` is imported in `main.tsx`

### 5. Animations Not Working
**Cause:** Framer Motion not installed or imported

**Solution:**
```bash
npm install framer-motion
```

### 6. Port Already in Use
```
Error: Port 5173 is already in use
```

**Solution:**
```bash
# Kill the process
lsof -ti:5173 | xargs kill -9

# Or use a different port
npm run dev -- --port 3000
```

---

## 🔍 Debugging Checklist

### Before Starting
- [ ] All dependencies installed: `npm install`
- [ ] No TypeScript errors: `npm run type-check` (if available)
- [ ] Environment variables set (if needed)

### If Page is Blank
1. [ ] Open browser console (F12)
2. [ ] Check for red errors
3. [ ] Look for missing imports
4. [ ] Verify component files exist
5. [ ] Check network tab for failed requests

### If Styling is Wrong
1. [ ] Verify `index.css` changes are saved
2. [ ] Restart dev server
3. [ ] Clear browser cache
4. [ ] Check Tailwind config

### If Components Don't Render
1. [ ] Check all imports are correct
2. [ ] Verify component exports
3. [ ] Look for TypeScript errors
4. [ ] Check props are passed correctly

---

## 📁 Required Files Checklist

### Components
- [x] `src/components/ai/AIOrb.tsx`
- [x] `src/components/ai/AICanvas.tsx`
- [x] `src/components/layout/LeftSidebar.tsx`
- [x] `src/components/layout/RightSidebar.tsx`
- [x] `src/components/layout/Navbar.tsx`

### UI Components (shadcn)
- [x] `src/components/ui/button.tsx`
- [x] `src/components/ui/scroll-area.tsx`
- [x] `src/components/ui/progress.tsx`
- [x] `src/components/ui/dropdown-menu.tsx`

### Styles
- [x] `src/index.css` (updated with new theme)

### Pages
- [x] `src/pages/Index.tsx` (updated with new layout)

---

## 🎨 Verify Theme is Applied

### Check These Elements:
1. **Background:** Should be dark (#0B0C10)
2. **Text:** Should be light/white
3. **Primary Color:** Electric teal (#00E5BE)
4. **Accent:** Neon purple
5. **Glow Effects:** Visible on hover
6. **Gradients:** Teal → Purple on headings

### If Theme Not Applied:
```bash
# 1. Check index.css is loaded
# Open browser DevTools → Sources → index.css

# 2. Verify CSS variables
# Open DevTools → Elements → :root
# Should see --primary: 174 100% 45%

# 3. Force reload
# Ctrl+Shift+R (hard refresh)
```

---

## 🚨 Emergency Reset

If nothing works, try this:

```bash
# 1. Stop dev server
Ctrl+C

# 2. Clean install
rm -rf node_modules
rm package-lock.json
npm install

# 3. Clear cache
rm -rf .vite
rm -rf dist

# 4. Restart
npm run dev
```

---

## 📊 Expected Console Output

### Normal (No Errors)
```
VITE v5.x.x  ready in xxx ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

### With Warnings (OK)
```
MetaMask encountered an error... (SAFE TO IGNORE)
Backpack couldn't override... (SAFE TO IGNORE)
Download React DevTools... (SAFE TO IGNORE)
```

### With Errors (NEEDS FIX)
```
Uncaught ReferenceError: XXX is not defined
Cannot find module 'XXX'
Failed to fetch dynamically imported module
```

---

## 🎯 Quick Fixes

### Fix 1: Missing Import
```typescript
// Add to Index.tsx
import { AIOrb } from "@/components/ai/AIOrb";
```

### Fix 2: Restart Dev Server
```bash
Ctrl+C
npm run dev
```

### Fix 3: Clear Browser Cache
```
Ctrl+Shift+R (Chrome/Firefox)
Cmd+Shift+R (Mac)
```

### Fix 4: Check File Paths
```bash
# Verify files exist
ls src/components/ai/AIOrb.tsx
ls src/components/layout/LeftSidebar.tsx
ls src/components/layout/RightSidebar.tsx
```

---

## ✅ Success Indicators

You'll know it's working when you see:

1. ✅ **Dark background** (not white)
2. ✅ **Animated AI Orb** on landing page
3. ✅ **"Welcome to DeleGator.AI"** with gradient text
4. ✅ **Neon glow effects** on buttons
5. ✅ **No red errors** in console
6. ✅ **Smooth animations** when hovering

---

## 🆘 Still Having Issues?

### Check:
1. Node version: `node -v` (should be 18+)
2. NPM version: `npm -v` (should be 9+)
3. All files saved
4. No TypeScript errors
5. Correct directory: `pwd` should show `.../frontend`

### Get Help:
- Check browser console for specific errors
- Look at Network tab for failed requests
- Verify all component files exist
- Review import paths

---

## 🎉 Working? Great!

If you see the futuristic DeleGator.AI interface with:
- Dark theme ✅
- AI Orb ✅
- Gradient text ✅
- Neon effects ✅

**You're all set! Enjoy your new UI! 🚀**
