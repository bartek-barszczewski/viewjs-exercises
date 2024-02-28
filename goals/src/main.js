Vue.createApp({
    data() {
        return {
            name: "BartekBajtek",
            age: 31,
            imgUrl: "https://miro.medium.com/v2/resize:fit:900/1*OrjCKmou1jT4It5so5gvOA.jpeg",
            inputValue: "Hello Vue.js",
        };
    },

    methods: {
        newAge(years) {
            return this.age + years;
        },

        random() {
            return Math.random().toPrecision(2);
        },
    },
}).mount("#app");
