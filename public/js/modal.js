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
        console.log("selected image mounted  is ", this.selectedImage);
        // console.log("this is ", this);
        //fetch request
        fetch(`/getImages/${this.selectedImage}`)
            .then((res) => res.json())
            .then((data) => {
                this.image = data;
                console.log("current data is", data);
                console.log(this.image, "this image object");
            })
            .catch((err) => {
                console.log("error is ", err);
            });
    },
    methods: {
        increaseCount() {
            console.log("user wants to count");
            this.count++;
        },
        close(){
            console.log("this is being clicked");
            this.$emit("close")
            
        }
    },
    template: ` <div>
    <span @click="close">X</span>
                    <img v-bind:src="image.url" v-bind:alt="image.description"/>
                    <h2>{{image.title}}</h2>
                    <h3>{{image.description}}</h3>
                    <p>Uploaded by {{image.username}} on {{image.created_at}}</p>
                     <button @click="increaseCount"> increase count </button>
                     <button @click="count--">decrease count </button>
               </div>`,
};

export default modal;
