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
            notification: false,
        };
    }, //data ends here

    mounted() {
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

        //use the fetched data to recursevely compare if there is a new image on the data base

        const checkNewImages = () => {
            setTimeout(() => {
                fetch("/images")
                    .then((res) => res.json())
                    .then((result) => {
                        let highestId = this.images[0].id;

                        if (highestId !== result[0].id) {
                            this.notification = true;
                        }
                    })
                    .catch((err) => {
                        console.log("error is ", err);
                    });

                return checkNewImages();
            }, 5000);
        };
        checkNewImages();
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
        notificationPop() {
            fetch("/images")
                .then((resp) => resp.json())
                .then((data) => {
                    //finds the new images since last fetch and uploads them to the existing array of images

                    let highestId = this.images[0].id;
                    const newImages = data.filter((x) => x.id > highestId);
                    this.images.unshift(...newImages);
                    this.notification = false;
                })
                .catch((err) => {
                    console.log("error is ", err);
                });
        },
    },
}).mount("#main");
