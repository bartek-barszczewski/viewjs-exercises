Vue.createApp({
    data() {
        return {
            usernameKeydown: "",
            usernameEnter: "",
            confirmUsername: "",
        };
    },

    methods: {
        showAlert(event, message) {
            alert(message)
        },

        signupUser(event) {
            this.usernameKeydown=event.target.value;
        },

        signupUserBeforeConfirm(event) {
            this.usernameEnter=event.target.value;
        },

        confirmUser(event) {
            this.confirmUsername = this.usernameEnter;
        }
    },
}).mount("#app");
