// this file will contain all of our Vue code!

import * as Vue from "./vue.js";

Vue.createApp({
    data() {
        return {
            name: "Images",
            images: [],
        };
    }, //data ends here

    mounted() {
        console.log("my vue app has mounted!");
        //this is the location for us to ask if there are any images to retrieve in our database!

        fetch("/images")
            .then((resp) => resp.json())
            .then((data) => {
                console.log("response from /images:", data);

                this.images = data;
            });
    },

    methods: {
        //this is where we define all of our functions
        handleSubmit(e) {
            e.preventDefault();
            console.log("Handle Submit");

            fetch("/upload", {
                method: "POST",
                body: new FormData(e.target),
            })
                .then((res) => res.json())
                .then((data) => this.images.unshift(data.payload));
        },
    },
}).mount("#main");
