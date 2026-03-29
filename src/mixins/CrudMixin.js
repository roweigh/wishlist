import { useAlertStore } from '@/stores/alert';
const alertStore = useAlertStore();

export default ({
  addFn,
  updateFn,
  removeFn,
}) => {
  return {
    data () {
      return {
        overlayFlags: {
          add: false,
          edit: false,
          upload: false,
        },
      };
    },
    methods: {
      async add (payload) {
        try {
          await addFn(payload).then(() => {
            alertStore.showMessage('success', 'Successfully Added!');
            this.overlayFlags.add = false;
          }),
          this.$emit('refresh');
        } catch(error) {
          console.error(error);
        }
      },

      async update (payload) {
        try {
          const id = this.overlayFlags?.edit?.id;
          await updateFn(id, payload).then(() => {
            alertStore.showMessage('success', 'Successfully Updated!');
            this.overlayFlags.edit = false;
          }),
          this.$emit('refresh');
        } catch(error) {
          console.error(error);
        }
      },

      async remove (id) {
        try {
          await removeFn(id).then(() => {
            alertStore.showMessage('success', 'Successfully Removed!');
          });
          this.$emit('refresh');
        } catch(error) {
          console.error(error);
        }
      },

      formatDate (v) {
        const date = new Date(v.seconds * 1000);
        return date.toLocaleDateString('en-US', {
          month: '2-digit',
          day: '2-digit',
          year: 'numeric',
        });
      },

      formatDollar (v) {
        return `$${(v).toFixed(2)}`;
      },
    },
  };
};