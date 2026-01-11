---
description: Guide to setting up Stripe Payment Links for AgriBoost Pro
---

# 💳 Setup Stripe Payment Link

Follow these steps to enable real payments for your app.

## 1. Login to Stripe
Go to [dashboard.stripe.com](https://dashboard.stripe.com) and log in.
*   **Tip**: Toggle **"Test Mode"** (orange switch in top-right) so you can test without real money.

## 2. Create the "Pro" Product
1.  Navigate to **Products** (left sidebar).
2.  Click **+ Add Product**.
3.  **Name**: `AgriBoost Pro`
4.  **Description**: "Monthly subscription for unlimited AI advice and crop scans."
5.  **Pricing Information**:
    *   **Pricing Model**: Standard pricing
    *   **Price**: `2500` (Currency: **NGN** or **USD**)
    *   **Billing period**: **Monthly**
6.  Click **Save product**.

## 3. Generate Payment Link
1.  Go to **Payment Links** (search in top bar or find in menu).
2.  Click **+ New**.
3.  **Select Product**: Choose `AgriBoost Pro`.
4.  **Configuration** (Left Sidebar):
    *   **Collect tax automatically**: Optional.
    *   **Collect customer address**: Optional.
    *   **After payment** (CRITICAL STEP):
        *   Select: **"Redirect to your website"**.
        *   URL: enter your app's URL followed by `?payment=success`.
        *   **For Localhost**: `http://localhost:5173/?payment=success`
        *   **For Production**: `https://your-app-name.vercel.app/?payment=success`
5.  Click **Create link** (top right).

## 4. Connect to App
1.  Copy the generated link (e.g., `https://buy.stripe.com/test_...`).
2.  Open your project's `.env` file.
3.  Add or update this line:
    ```bash
    VITE_STRIPE_PAYMENT_LINK=https://buy.stripe.com/test_YOUR_LINK_HERE
    ```
4.  Restart your server if running (`Ctrl+C`, then `npm run dev`).

## 5. Test It
1.  Click **"Subscribe via Stripe"** in your app.
2.  Use a Stripe Test Card:
    *   **Card Number**: `4242 4242 4242 4242`
    *   **Expiry**: Any future date
    *   **CVC**: Any 3 digits
3.  After paying, you should be redirected back to your app, and the interface should say **"AgriBoost Pro Activated!"**.
