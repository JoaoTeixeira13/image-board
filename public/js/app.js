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

        if (!isNaN(location.pathname.slice(1))) {
            this.imageSelected = location.pathname.slice(1);
            window.addEventListener("popstate", () => {
                this.imageSelected = location.pathname.slice(1);
            });
        } else {
            this.imageSelected = null;
            history.replaceState({}, "", "/");
        }

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

            fetch("/upload", {
                method: "POST",
                body: new FormData(e.target),
            })
                .then((res) => res.json())
                .then((data) => {
                    this.images.unshift(data.payload);
                    //reset input fields after upload
                    this.$refs.title.value = null;
                    this.$refs.user.value = null;
                    this.$refs.description.value = null;
                    this.$refs.image.value = null;
                })
                .catch((err) => {
                    console.log("error is ", err);
                });
        },
        selectImage(id) {
            this.imageSelected = id;
            history.pushState({}, "", "/" + id);
        },
        closeModal() {
            this.imageSelected = null;
            history.pushState({}, "", "/");
        },
        getMoreImages() {
            let lowerId = this.images[this.images.length - 1].id;

            fetch(`/moreImages/${lowerId}`)
                .then((resp) => resp.json())
                .then((data) => {
                    this.images.push(...data.payload);

                    //turn off the more button
                    const lowestImg = this.images[this.images.length - 1];

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
