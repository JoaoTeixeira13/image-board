const modal = {
    data() {
        return {
            heading: "modal component",
            count: 1,
            greetee: "",
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
    },
    template: ` <div>
                    <h2> I am your {{heading}}</h2>
                    <h2>Hello {{greetee}}</h2>
                    <h3> count is: {{count}}</h3>
                    <button @click="increaseCount"> increase count </button>
                    <button @click="count--">decrease count </button>
               </div>`,
};

export default modal;
