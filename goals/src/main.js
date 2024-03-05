Vue.createApp({
    data() {
        return {
            name: "BartekBajtek",
            confirmName: "",
            age: 31,
            imgUrl: "https://miro.medium.com/v2/resize:fit:900/1*OrjCKmou1jT4It5so5gvOA.jpeg",
            inputValue: "Hello Vue.js",
        };
    },

    methods: {
        setName(event, name) {
            this.name = event.target.value + name;
        },

        confirmInput(event) {
            this.confirmName = this.name;
        },

        newAge(years) {
            return this.age + years;
        },

        random() {
            return Math.random().toPrecision(2);
        },

        add(age) {
            this.age = this.age + age;
        },

        reduce(age) {
            this.age = this.age - age;
        },
    },
}).mount("#app");
