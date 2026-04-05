import { defineStore } from 'pinia';
import { onAuthStateChanged, signOut, signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '@/firebase'; // Path to your firebase config
import { getEmailWhitelist } from '@/api/auth';

export const useAuthStore = defineStore('user', {
  state: () => ({
    _profile: null,
    _initializing: true, // Tracks if Firebase has finished checking the login status
    _whitelist: [],
  }),
  getters: {
    initializing: (state) => state._initializing,
    profile: (state) => state._profile,
    uid: (state) => state._profile?.uid, // Firebase uses 'uid'
    // isAuthenticated: (state) => !!state._profile,
  },
  actions: {
    // Call this once in your App.vue or main.js
    async initializeAuth() {
      this._whitelist = await getEmailWhitelist();

      return new Promise((resolve) => {
        onAuthStateChanged(auth, (user) => {
          if (this._whitelist.includes(user?.email)) {
            this._profile = {
              uid: user.uid,
              email: user.email,
              displayName: user.displayName,
            };
          } else {
            this._profile = null;
          }
          this._initializing = false;
          resolve(user);
        });
      });
    },

    async login () {
      try {
        const result = await signInWithPopup(auth, googleProvider);
        return result.user;
      } catch (error) {
        console.error('Error during Google Login:', error.message);
      }
    },

    async logout() {
      try {
        await signOut(auth);
        this._profile = null;
      } catch (error) {
        console.error('Logout failed:', error);
      }
    },
  },
});