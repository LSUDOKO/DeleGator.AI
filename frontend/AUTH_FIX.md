# 🔧 Authentication Issue - Quick Fix

## Problem
You're stuck at "Signing Message - Please sign the message in your wallet"

## 🚨 **IMMEDIATE SOLUTION**

### Option 1: Check MetaMask Popup (Most Common)
1. **Look for a MetaMask popup window** - it might be hidden behind your browser
2. **Check your browser's popup blocker** - allow popups for localhost
3. **Look at the MetaMask extension icon** - there might be a pending signature request (red badge)
4. **Click the MetaMask extension** and approve the signature

### Option 2: Refresh and Try Again
1. **Close any MetaMask popups**
2. **Refresh the page** (F5 or Ctrl+R)
3. **Click "Connect Wallet"** again
4. **Watch for the MetaMask popup** - don't let it hide behind windows

### Option 3: Clear State and Retry
1. Open browser console (F12)
2. Run this command:
```javascript
localStorage.clear();
location.reload();
```
3. Try connecting again

---

## 🔍 Debugging Steps

### Step 1: Check Browser Console
1. Press **F12** to open DevTools
2. Go to **Console** tab
3. Look for these messages:
   - ✅ `1️⃣ Getting nonce from backend...` - Should see this
   - ✅ `2️⃣ Creating SIWE message...` - Should see this
   - ✅ `3️⃣ Requesting signature from wallet...` - Should see this
   - ❌ If stuck here → **MetaMask popup is hidden or blocked**

### Step 2: Check MetaMask
1. **Click MetaMask extension icon**
2. **Look for pending requests** (red badge with number)
3. **Check if popup is blocked** (browser address bar)
4. **Try switching to a different browser tab and back**

### Step 3: Check Network Tab
1. In DevTools, go to **Network** tab
2. Look for request to `/auth/nonce`
   - ✅ Status 200 = Good
   - ❌ Status 500/404 = Backend issue
3. Look for request to `/auth/verify`
   - This should appear AFTER you sign
   - If missing = signature never completed

---

## 🛠️ Common Causes & Fixes

### 1. MetaMask Popup Hidden
**Cause:** Popup window is behind other windows or blocked

**Fix:**
- Check browser popup blocker (address bar icon)
- Allow popups for `localhost:5173`
- Click MetaMask extension icon directly
- Try a different browser (Chrome recommended)

### 2. Wrong Network
**Cause:** MetaMask is on wrong network

**Fix:**
1. Open MetaMask
2. Switch to **Monad Testnet** or **Base Sepolia**
3. Try signing again

### 3. Cached Auth State
**Cause:** Old authentication data in browser

**Fix:**
```javascript
// In browser console (F12)
localStorage.removeItem('rebased_backend_token');
localStorage.removeItem('rebased_token_expiry');
location.reload();
```

### 4. Backend Not Running
**Cause:** Backend API is down

**Fix:**
```bash
# Check if backend is running
curl http://localhost:3000/health

# If not running, start it:
cd backend
npm run start:api
```

### 5. CORS Issue
**Cause:** Backend rejecting frontend requests

**Fix:**
- Backend should be running on port 3000
- Frontend should be on port 5173 (or 8081)
- Check backend logs for CORS errors

---

## 🎯 Step-by-Step Recovery

### Full Reset Process:
```bash
# 1. Stop frontend (Ctrl+C)

# 2. Clear browser data
# Open browser console (F12) and run:
localStorage.clear();
sessionStorage.clear();

# 3. Close all MetaMask popups

# 4. Restart frontend
cd frontend
npm run dev

# 5. Open fresh browser tab
# Go to http://localhost:5173

# 6. Try connecting wallet again
# WATCH for MetaMask popup!
```

---

## 🔍 What Should Happen (Normal Flow)

1. **Click "Connect Wallet"**
   - Privy modal appears
   - Choose MetaMask
   
2. **MetaMask Connection**
   - MetaMask popup asks to connect
   - Approve connection
   - Modal shows "Wallet Connected ✓"

3. **Sign Message**
   - Modal shows "Step 2: Sign message"
   - **MetaMask popup appears** (WATCH FOR THIS!)
   - Message shows "Sign in to Rebased"
   - Click "Sign" in MetaMask

4. **Backend Verification**
   - Modal shows "Verifying signature..."
   - Backend validates signature
   - JWT token received

5. **Success!**
   - Modal closes
   - You can now access the canvas

---

## 🚨 If Still Stuck

### Check Backend Logs:
```bash
# In backend terminal, you should see:
POST /auth/nonce 200
POST /auth/verify 200
```

### Check Frontend Console:
```
✅ Should see:
1️⃣ Getting nonce from backend...
   Nonce received: abc123...
2️⃣ Creating SIWE message...
   Message prepared
3️⃣ Requesting signature from wallet...
   [WAITING FOR YOU TO SIGN IN METAMASK]
   Signature received: 0x...
4️⃣ Verifying signature with backend...
   Backend JWT received
✅ SIWE flow completed successfully
```

### Enable Verbose Logging:
```javascript
// In browser console (F12)
localStorage.setItem('debug', 'rebased:*');
location.reload();
```

---

## 💡 Pro Tips

1. **Keep MetaMask visible** - Don't minimize it during sign-in
2. **Use Chrome** - Best compatibility with MetaMask
3. **Disable other wallets** - Only use MetaMask to avoid conflicts
4. **Check popup blocker** - Allow popups for localhost
5. **Be patient** - Wait 5-10 seconds for MetaMask popup

---

## 🎯 Quick Test

Run this in browser console to test backend:
```javascript
fetch('http://localhost:3000/auth/nonce', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ address: '0x1234567890123456789012345678901234567890' })
})
.then(r => r.json())
.then(d => console.log('✅ Backend working:', d))
.catch(e => console.error('❌ Backend error:', e));
```

Expected output: `✅ Backend working: {nonce: "..."}`

---

## 🆘 Last Resort

If nothing works:

1. **Try a different browser**
2. **Reinstall MetaMask extension**
3. **Use a different wallet** (WalletConnect, Coinbase Wallet)
4. **Check if antivirus/firewall is blocking**

---

## ✅ Success Indicators

You'll know it worked when:
- ✅ MetaMask popup appeared and you signed
- ✅ Console shows "✅ SIWE flow completed successfully"
- ✅ Modal closes automatically
- ✅ You see the canvas with sidebars
- ✅ No more "Authentication Required" modal

---

**Most likely issue: MetaMask popup is hidden or blocked!**
**Look for the popup window or click the MetaMask extension icon!**
