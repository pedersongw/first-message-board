import React from "react";
import Comment from "./comment";
import DateComponent from "./date";
import TopMobileNavBar from "./TopMobileNavBar";
import { config } from "../URLs.jsx";
import axios from "axios";

class SinglePost extends React.Component {
  state = {
    reply: "",
    post: null,
    comments: null,
  };

  async componentDidMount() {
    try {
      const { data } = await axios.get(config + "/api/posts/single", {
        params: {
          _id: this.props.id,
        },
      });
      console.log(data);
      this.setState({ post: data });
    } catch (error) {
      console.log("Couldn't reach the server", error);
    }
    try {
      let searchParam = { parentPost: `${this.props.id}` };
      const { data: comments } = await axios.post(
        config + "/api/comments/get",
        searchParam
      );
      const hashTable = Object.create(null);
      comments.forEach((comment) => (hashTable[comment._id] = { ...comment }));
      const dataTree = [];
      comments.forEach((comment) => {
        if (comment.parentComment)
          hashTable[comment.parentComment].children.push(
            hashTable[comment._id]
          );
        else dataTree.push(hashTable[comment._id]);
      });
      console.log(dataTree);
      this.setState({ comments: dataTree });
    } catch (error) {
      console.log("catch block called", error);
    }
  }

  renderCommentsInListGroup = () => {
    return this.state.comments.map((comment) => {
      return (
        <Comment
          depth={0}
          key={comment._id}
          openReplyModal={this.props.openReplyModal}
          id={comment._id}
          comment={comment}
          parentPost={comment.parentPost}
        />
      );
    });
  };

  render() {
    const { post, comments } = this.state;
    return (
      <React.Fragment>
        <TopMobileNavBar />
        <div className="posts-spacer">
          {" "}
          <div className="posts-div">
            <div className="viewed-post-wrapper">
              {this.state.comments && this.state.post && (
                <React.Fragment>
                  <div className="viewed-post">
                    <h3 className="viewed-post-title">{post.title}</h3>
                    <p className="viewed-post-user">
                      posted by {post.username[1]}
                    </p>
                    <p className="viewed-post-body">{post.body}</p>
                    <p className="viewed-post-likes">
                      {post.likes.length.toString() +
                        (post.likes.length === 1
                          ? " person liked this"
                          : " people liked this")}
                    </p>
                    <div className="viewed-post-time">
                      <DateComponent time={post.timePosted} />
                    </div>
                    <div className="viewed-post-reply-div">
                      <button
                        type="submit"
                        className="post-reply-button"
                        onClick={() => this.props.openReplyModal()}
                      >
                        Reply
                      </button>
                    </div>
                  </div>

                  <div>{this.renderCommentsInListGroup()}</div>
                </React.Fragment>
              )}
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default SinglePost;
