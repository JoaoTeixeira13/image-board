// this file will contain all of our Vue code!

import * as Vue from "./vue.js";
import modal from "./modal.js";

Vue.createApp({
    data() {
        return {
            name: "Images",
            images: [],
            imageSelected: "",
            moreButton: true,
        };
    }, //data ends here

    mounted() {
        console.log("my vue app has mounted!");
        //this is the location for us to ask if there are any images to retrieve in our database!

        fetch("/images")
            .then((resp) => resp.json())
            .then((data) => {
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
            let lowerId = this.images[this.images.length - 1].id;

            fetch(`/moreImages/${lowerId}`)
                .then((resp) => resp.json())
                .then((data) => {
                    this.images.push(...data.payload);

                    //turn off the more button
                    const lowestImg = this.images[this.images.length - 1];

                    console.log(
                        "comparing lowest two values",
                        lowestImg.id === lowestImg.lowestId
                    );

                    if (lowestImg.id === lowestImg.lowestId) {
                        this.moreButton = false;
                    }
                })
                .catch((err) => {
                    console.log("error is ", err);
                });
        },
    },
}).mount("#main");
