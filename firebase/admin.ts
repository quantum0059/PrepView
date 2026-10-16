import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

// Normalize the private key regardless of how Vercel stored it:
// - strips surrounding quotes (if pasted with quotes in the dashboard)
// - converts literal \\n (double-escaped) or \n (single-escaped) to real newlines
function normalizePrivateKey(key: string | undefined): string | undefined {
    if (!key) return undefined;
    // Remove surrounding quotes added by some env var editors
    let normalized = key.replace(/^["']|["']$/g, "");
    // Convert any escaped newline variant to a real newline
    normalized = normalized.replace(/\\n/g, "\n");
    return normalized;
}

// Initialize Firebase Admin if not already initialized
const initializeAdmin = () => {
    const apps = getApps();

    if (!apps.length) {
        initializeApp({
            credential: cert({
                projectId: process.env.FIREBASE_PROJECT_ID,
                clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
                privateKey: normalizePrivateKey(process.env.FIREBASE_PRIVATE_KEY),
            })
        });
    }
};

// Initialize before exporting
initializeAdmin();

export const auth = getAuth();
export const db = getFirestore();
