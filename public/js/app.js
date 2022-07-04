// this file will contain all of our Vue code!

import * as Vue from "./vue.js";
import modal from "./modal.js";

Vue.createApp({
    data() {
        return {
            name: "Images",
            images: [],
            imageSelected: "",
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
            })
            .catch((err) => {
                console.log("error is ", err);
            });
    },
    components: {
        modal: modal,
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
                .then((data) => this.images.unshift(data.payload))
                .catch((err) => {
                    console.log("error is ", err);
                });
        },
        selectImage(id) {
            console.log("Image id clicked on is,", id);
            this.imageSelected = id;
        },
        closeModal() {
            this.imageSelected = null;
        },
        getMoreImages() {
            console.log("button clicked");
            //the image with the lowest id
            console.log(
                "image with the lowest id is",
                this.images[this.images.length - 1].id
            );
            let lowestId = this.images[this.images.length - 1].id;
            fetch(`/moreImages/${lowestId}`)
                .then((resp) => resp.json())
                .then((data) => {
                    console.log("response from /moreImages:", data);

                    this.images.push(...data.payload);
                })
                .catch((err) => {
                    console.log("error is ", err);
                });
        },
    },
}).mount("#main");
