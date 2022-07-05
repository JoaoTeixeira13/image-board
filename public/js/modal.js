import comments from "./comments.js";

const modal = {
    data() {
        return {
            heading: "modal component",
            image: {},
        };
    },
    props: ["selectedImage"],
    mounted() {
        // console.log("image object is", this.image, this.selectedImage);
        console.log("first component mounted");

        fetch(`/getImages/${this.selectedImage}`)
            .then((res) => res.json())
            .then((data) => {
                if (data.payload) {
                    this.image = data.payload;
                } else {
                    this.$emit("close");
                }
            })
            .catch((err) => {
                console.log("error is ", err);
            });
    },
    components: {
        comments: comments,
    },
    methods: {
        close() {
            this.$emit("close");
        },
    },
    template: ` <div class="modal-box">
                    <img v-bind:src="image.url" v-bind:alt="image.description" :key="image.id"/>
                    <div class="modal-info">
                        <h2>{{image.title}}</h2>
                        <h3>{{image.description}}</h3>
                        <p>Uploaded by {{image.username}} on {{image.created_at}}</p>
                        <comments :selected-image="selectedImage"></comments>
                    </div>
                    <span @click="close" class=close-tag><i class="fa-solid fa-circle-xmark"></i></span>
                    
               </div>`,
};

export default modal;
