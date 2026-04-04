import { defineStore } from 'pinia';
import { onAuthStateChanged, signOut, signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '@/firebase'; // Path to your firebase config

export const useAuthStore = defineStore('user', {
  state: () => ({
    _profile: null,
    _isInitialized: false, // Tracks if Firebase has finished checking the login status
  }),
  getters: {
    profile: (state) => state._profile,
    uid: (state) => state._profile?.uid, // Firebase uses 'uid'
    isAuthenticated: (state) => !!state._profile,
  },
  actions: {
    // Call this once in your App.vue or main.js
    initializeAuth() {
      return new Promise((resolve) => {
        onAuthStateChanged(auth, (user) => {
          if (user) {
            // Map the Firebase user object to your profile state
            this._profile = {
              uid: user.uid,
              email: user.email,
              displayName: user.displayName,
              photoURL: user.photoURL,
            };
          } else {
            this._profile = null;
          }
          this._isInitialized = true;
          resolve(user);
        });
      });
    },
    async login () {
      try {
        const result = await signInWithPopup(auth, googleProvider);

        // This gives you the Google Access Token if you need to call Google APIs
        // const credential = GoogleAuthProvider.credentialFromResult(result);
        // const token = credential.accessToken;

        const user = result.user;
        console.log('Successfully logged in:', user);

        // If you're moving to SQL later, this user.uid is
        // what you'll store in your SQL tables.
      } catch (error) {
        console.error('Error during Google Login:', error.message);
      }
    },

    async logout() {
      try {
        await signOut(auth);
        // The onAuthStateChanged listener will automatically
        // set _profile to null, but we can do it manually for speed
        this._profile = null;

        // Optional: Send the user back to the login page
      } catch (error) {
        console.error('Logout failed:', error);
      }
    },
  },
});