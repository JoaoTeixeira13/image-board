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
                    this.comment = "";
                    this.username = "";
                })
                .catch((err) => {
                    console.log("error is ", err);
                });
        },
    },
    template: ` <div class="comment-template">

                    <div class="comment-group">
    
                        <div v-if="comments.length" v-for="comment in comments" :key="comment.id" class="comment-box">
                        
                            <p>{{comment.comment}}</p>
                            <p><strong>{{comment.username}}</strong> on {{comment.created_at}}.</p>
                        
                        </div>
                    </div>
                    
                        <div class="comment-form">
                    
                            <div class="comment-inputs">
                                <input v-model="comment" name="comment" placeholder="COMMENT*" required/>
                                <input v-model="username" name="username" placeholder="USERNAME*" required/>
                            </div>
                            
                            <button @click="submit"><i class="fa-solid fa-circle-arrow-up"></i> Submit</button> 

                        </div>

                </div>
                `,
};

export default comments;
