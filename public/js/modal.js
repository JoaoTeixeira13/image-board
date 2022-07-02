const modal = {
    data() {
        return {
            heading: "modal component",
            count: 1,
            greetee: "",
            image: {},
        };
    },
    props: ["selectedImage"],
    mounted() {
        console.log("first component mounted");

        fetch(`/getImages/${this.selectedImage}`)
            .then((res) => res.json())
            .then((data) => {
                this.image = data;
            })
            .catch((err) => {
                console.log("error is ", err);
            });
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
                    </div>
                    <span @click="close" class=close-tag>X</span>
                    
               </div>`,
};

export default modal;
