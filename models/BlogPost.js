class BlogPost {
    constructor(title, content, category) {
        this.title = title;
        this.content = content;
        this.category = category;
        this.comments = [];
    }

    addComment(comment) {
        this.comments.push(comment);
    }
}

module.exports = BlogPost;
