const comments = {
    data() {
        return {
            heading: "comments component",
            comments: [],
            comment: "",
            username: "",
        };
    },
    props: ["selectedImage"],
    mounted() {
        console.log("comments component mounted");

        fetch(`/comments/${this.selectedImage}`)
            .then((res) => res.json())
            .then((data) => {
                this.comments = data;
            })
            .catch((err) => {
                console.log("error is ", err);
            });
    },
    methods: {
        submit() {
            fetch(`/comment`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    comment: this.comment,
                    username: this.username,
                    image_id: this.selectedImage,
                }),
            })
                .then((res) => res.json())
                .then((data) => {
                    this.comments.push(data.payload);
                })
                .catch((err) => {
                    console.log("error is ", err);
                });
        },
    },
    template: ` <div class="comment-template">

                    <h3>Add a Comment!</h3>

                    <div class="comment-form">
                        <input v-model="comment" name="comment" placeholder="COMMENT*" required/>
                        <input v-model="username" name="username" placeholder="USERNAME*" required/>
                        <button @click="submit"><i class="fa-solid fa-circle-arrow-up"></i> Submit</button> 

                    </div>

                    <div v-if="comments.length" v-for="comment in comments" :key="comment.id" class="comment-box">
                    
                        <p>{{comment.comment}}</p>
                        <p>{{comment.username}} on {{comment.created_at}}.</p>
                        
                    </div>

                </div>
                `,
};

export default comments;
