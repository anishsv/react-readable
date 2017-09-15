import React, { Component } from 'react';
import '../App.css';
import '../blog-home.css';
import '../bootstrap.min.css';
import Loading from 'react-loading';
import Modal from 'react-modal';
import * as actions from '../actions';
import { connect } from 'react-redux';
import * as api from '../utils/api';
import { Link } from 'react-router-dom';
import Navbar from './navbar.js';
import Comment from '../components/comment';

class Post extends Component {
  constructor(props) {
    super(props);
    this.sortChanged = this.sortChanged.bind(this);
    this.childChanged = this.childChanged.bind(this);
    this.buildComments();
  }

  state = {
    sort: '',
    displayEditor: 'none',
    titleInput: this.props.post.title,
    bodyInput: this.props.post.body,
    opacity: 0,
    visibility: "hidden",
    postEditor: false,
  }

  buildComments() {
    fetch("http://localhost:5001/posts/" + this.props.post.id + "/comments",
    {method: "GET", headers: api.headers_one()})
    .then((resp) => {
      resp.json().then((data) => {
        if(data.length > 0) {
          var obj = {
            type: actions.BUILD_COMMENTS,
            posts: this.props.posts,
            comments: data
          }
          this.props.build_comments(obj);
          this.setState({
            titleInput: this.props.post.title,
            bodyInput: this.props.post.body
          });
        }
      })
    })
  }

  getCommentsLength() {
    var num;
    var array;

    if(Array.isArray(this.props.comments)){
      array = this.props.comments.filter((comment) => {
        return comment.parentId === this.props.post.id && comment.deleted === false;
      });
      num = array.length;
    }
    else {
      var keys = Object.keys(this.props.comments);
      array = keys.filter((comment_id) => {
        return this.props.comments[comment_id].parentId === this.props.post.id && this.props.comments[comment_id].deleted === false;
      });
      num = array.length;
    }

    return num;
  }

  toggleEditor() {
    var value = this.state.displayEditor === 'none' ? "block" : "none";
    this.setState({displayEditor: value,postEditor: true});
  }

  closePostEditor = () => {
    this.setState(() => ({
      postEditor: false,
      displayEditor: 'none'
    }))
  }

  updateTitleInput(input) {
    this.setState({titleInput: input});
  }

  updateBodyInput(input) {
    this.setState({bodyInput: input});
  }

  confirmPostEdits() {
    if(this.state.titleInput < 5) {
      alert("Title Must Be At Least 5 Characters");
      return;
    }
    if(this.state.bodyInput < 5) {
      alert("Body Must Be At Least 5 Characters");
      return;
    }

    fetch("http://localhost:5001/posts/" + this.props.post.id,
    {method: "PUT", body:JSON.stringify({title: this.state.titleInput.trim(), body: this.state.bodyInput.trim()}), headers: api.headers_one()})
    .then((resp) => {
      resp.json().then((data) => {
        var obj = {
          type: actions.EDIT_POST,
          id: this.props.post.id,
          title: data.title,
          body: data.body
        }

        this.props.edit_post(obj);
        this.closePostEditor();
        this.success();
      })
    })
  }

  success() {
    this.setState({opacity: 1, visibility: "visible"}, () => {
      setTimeout(() => {
        this.setState({opacity: 0, visibility: "hidden"});
      } , 2000);
    })
  }

  upvotePost() {
    fetch("http://localhost:5001/posts/" + this.props.post.id,
    {method: "POST", body:JSON.stringify({option: "upVote"}), headers: api.headers_one()})
    .then((resp) => {
      resp.json().then((data) => {
        var obj = {
          type: actions.UPVOTE_POST,
          id: this.props.post.id,
          voteScore: data.voteScore
        }

        this.props.upvote_post(obj);
        this.forceUpdate();
        if(this.props.sortChanged){
          this.props.sortChanged();
        }
      })
    })
  }

  downvotePost() {
    fetch("http://localhost:5001/posts/" + this.props.post.id,
    {method: "POST", body:JSON.stringify({option: "downVote"}), headers: api.headers_one()})
    .then((resp) => {
      resp.json().then((data) => {
        var obj = {
          type: actions.DOWNVOTE_POST,
          id: this.props.post.id,
          voteScore: data.voteScore
        }

        this.props.downvote_post(obj);
        this.forceUpdate();
        if(this.props.sortChanged){
          this.props.sortChanged();
        }
      })
    })
  }

  deletePost() {
    var ask = window.confirm("Delete This Post?");
    if(ask === false) {
      return;
    }

    fetch("http://localhost:5001/posts/" + this.props.post.id,
    {method: "DELETE", headers: api.headers_one()})
    .then((resp) => {
      console.log(resp);
      var obj = {
        type: actions.DELETE_POST,
        id: this.props.post.id,
        deleted: true
      }

      this.props.delete_post(obj);
      if(this.props.alertParent){
        this.props.alertParent();
      }
    })
  }

  sort_comments_byScore_asc() {
    if(this.state.sort === 'ASC') {
      return;
    }

    var keys = Object.keys(this.props.comments);
    var comments = keys.map(key => this.props.comments[key]);
    comments.sort((a, b) => {
      if (a.voteScore < b.voteScore) {
        return -1;
      }
      if (a.voteScore > b.voteScore) {
        return 1;
      }
      return 0;
    });

    this.setState({sort: 'ASC', sorted_comments: comments})
  }

  sort_comments_byScore_desc() {
    if(this.state.sort === 'DESC') {
      return;
    }

    var keys = Object.keys(this.props.comments);
    var comments = keys.map(key => this.props.comments[key]);
    comments.sort((a, b) => {
      if (a.voteScore > b.voteScore) {
        return -1;
      }
      if (a.voteScore < b.voteScore) {
        return 1;
      }
      return 0;
    });

    this.setState({sort: 'DESC', sorted_comments: comments})
  }

  sortChanged() {
    this.setState({sort: "CHANGED"});
  }

  childChanged(){
    this.forceUpdate();
  }

  getRenderKeys() {
    if(this.state.sorted_comments){
      return this.state.sorted_comments.length > 0 ? this.state.sorted_comments.filter(comment => comment.deleted === false && comment.parentId === this.props.post.id) : false;
    }

    if(this.props.comments) {
      var array = [];
      Object.keys(this.props.comments).forEach((item, index) => {
        if( this.props.comments[item].parentId === this.props.post.id && this.props.comments[item].deleted === false ) {
          array.push(this.props.comments[item]);
        }
      });
      return array.length > 0 ? array : false;
    }
    else {
      return false;
    }
  }

  render(){
    var keys = this.getRenderKeys();
    return (
      <div>
      <div className="card mb-4">
        <div className="card-body">
          <h2 className="card-title"><Link to={ "/" +this.props.post.category + "/" + this.props.post.id} >{this.props.post.title}</Link></h2>
          <p className="card-text">{this.props.post.body}</p>
          <div className="vote-container">
          Votes: {this.props.post.voteScore}<br />
          Comments: {this.props.comments && this.getCommentsLength()}
          </div>
        </div>
        <div className="card-footer text-muted">
          Posted on {new Date(this.props.post.timestamp).toString().substr(0,16)} by 
          <a ><em> {this.props.post.author}</em></a>
          <div className="post-buttons-div float-right">
            <button className="post-buttons btn btn-info btn-sm transition" onClick={() => {this.toggleEditor()}}>Edit</button>
            <button className="post-buttons btn btn-info btn-sm transition" onClick={() => {this.deletePost()}}>Delete</button>
            <button className="post-buttons btn btn-info btn-sm transition" onClick={() => {this.upvotePost()}}>UpVote</button>
            <button className="post-buttons btn btn-info btn-sm transition" onClick={() => {this.downvotePost()}}>DownVote</button>
            <button className="post-buttons btn btn-info btn-sm transition"><Link to={"/posts/" + this.props.post.id + "/create_comment"}>Create Comment</Link></button>
          </div>
          <Modal
            className='modal'
            overlayClassName='overlay'
            isOpen={this.state.postEditor}
            onRequestClose={this.closePostEditor}
            contentLabel='Modal'
          >
            <div>
              <div className='search-container'>
                <div style={{display: this.state.displayEditor}}>
                  <p className="post-edit-title">Title</p>
                  <textarea className="editor form-control title-editor" value={this.state.titleInput}
                    onChange={(event) => this.updateTitleInput(event.target.value)}></textarea>

                  <p className="post-edit-body">Body</p>
                  <textarea className="editor form-control" value={this.state.bodyInput}
                    onChange={(event) => this.updateBodyInput(event.target.value)}></textarea>
                  <div className="button-container">
                    <button className="middlr btn btn-success btn-sm transition" onClick={() => {this.confirmPostEdits()}}>Confirm Edit</button>
                  </div>
                </div>
              </div>
            </div>
          </Modal>
        </div>
      </div>
      <div className="comment-section">
        {this.props.showComments && keys && keys.length > 0 && (
          <h4 className="">Comments</h4>
        )}
        {this.props.showComments && keys && keys.length > 0 && keys.map((comment) => (
          <Comment key={comment.id} alertParent={this.childChanged} sortChanged={this.sortChanged} comment={comment} />
        ))}
      </div>
      </div>
    )
  }
}

function mapStateToProps ({ posts, comments }) {
  return {
    posts,
    comments
  }
}

function mapDispatchToProps (dispatch) {
  return {
    build_comments: (data) => dispatch(actions.build_comments(data)),
    edit_post: (data) => dispatch(actions.edit_post(data)),
    delete_post: (data) => dispatch(actions.delete_post(data)),
    upvote_post: (data) => dispatch(actions.upvote_post(data)),
    downvote_post: (data) => dispatch(actions.downvote_post(data)),
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Post)
