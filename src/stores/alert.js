import { defineStore } from 'pinia';

export const useAlertStore = defineStore('alert', {
  state: () => ({
    _shown: false,
    _message: '',
    _alertType: '',
    _error: null,
  }),
  getters: {
    shown: state => state._shown,
    message: state => state._message,
    alertType: state => state._alertType,
    error: state => state._error,
  },
  actions: {
    showMessage(type, message, timeout = 4000) {
      this._shown = true;
      this._message = message;
      this._alertType = type;

      setTimeout(() => {
        this._shown = false;
      }, timeout);
    },

    setError (error) {
      error && console.error(error);
      this._error = error;
    },
  },
});