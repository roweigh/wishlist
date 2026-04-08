import { defineStore } from 'pinia';
import { onAuthStateChanged, signOut, signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '@/firebase';
import { getUser, getEmailWhitelist } from '@/api/auth';
import { addUser } from '../api/auth';

export const useAuthStore = defineStore('user', {
  state: () => ({
    _initializing: true, // Tracks if Firebase has finished checking the login status
    _whitelist: [],
    _profile: null,

    _whiteListed: true,
    _accountSetup: false,
  }),
  getters: {
    initializing: (state) => state._initializing,
    profile: (state) => state._profile,
    uid: (state) => state._profile?.uid, // Firebase uses 'uid'
    whiteListed: (state) => state._whiteListed,
    accountSetup: (state) => state._accountSetup,
  },
  actions: {
    async initializeAuth() {
      this._whitelist = await getEmailWhitelist();

      return new Promise((resolve) => {
        onAuthStateChanged(auth, async (user) => { // This actually reacts on login too
          if (user && this._whitelist.includes(user.email)) {
            let name = null;
            try {
              name = await getUser(user.uid);
            } catch (error) {
              console.error('Error fetching user profile:', error);
            }

            this._profile = {
              uid: user.uid,
              email: user.email,
              displayName: user.displayName,
              name,
            };

            // Valid user whitelisted but incomplete
            this._whiteListed = true;
            if (!name) { this._accountSetup = true; }
          } else if (user && !this._whitelist.includes(user.email)) {
            this._whiteListed = false;
          } else {
            this._profile = null;
          }
          this._initializing = false;
          resolve(user);
        });
      });
    },

    async createUser (uid, payload) {
      await addUser(uid, payload);
      this._profile = {
        ...this._profile,
        ...payload,
      };
      this._accountSetup = false;
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
        this._whiteListed = true;
      } catch (error) {
        console.error('Logout failed:', error);
      }
    },

    setGuest () {
      this._profile = {
        uid: null,
        email: null,
        displayName: null,
        name: 'Guest',
      };
    },
  },
});