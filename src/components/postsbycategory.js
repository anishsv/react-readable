import React, { Component } from 'react';
import '../App.css';
import * as actions from '../actions'
import { connect } from 'react-redux'
import * as api from '../utils/api'
import { Link } from 'react-router-dom'
import Navbar from './navbar.js';
import Post from '../components/post'

class PostsByCategory extends Component {
  constructor(props) {
    super(props);
    this.sortChanged = this.sortChanged.bind(this);
    this.childChanged = this.childChanged.bind(this);
    this.getPosts();
  }

  state = {

  }

  getPosts() {
    fetch("http://localhost:5001/" + this.props.match.params.category + "/posts", {method: "GET", headers: api.headers_one()})
    .then((resp) => {
      resp.json().then((data) => {
        var obj = {
          type: actions.LOAD_POSTS,
          posts: data
        }
        this.props.load_posts(obj);
      })
    })
  }

  sort_posts_byScore_asc() {
    if(this.state.sort === 'ASC') {
      return;
    }

    var keys = Object.keys(this.props.posts);
    var posts = keys.map(key => this.props.posts[key]);
    posts.sort((a, b) => {
      if (a.voteScore < b.voteScore) {
        return -1;
      }
      if (a.voteScore > b.voteScore) {
        return 1;
      }
      // a.voteScore must be equal to b.voteScore
      return 0;
    });

    this.setState({sort: 'ASC', sorted_posts: posts})
  }

  sort_posts_byScore_desc() {
    if(this.state.sort === 'DESC') {
      return;
    }

    var keys = Object.keys(this.props.posts);
    var posts = keys.map(key => this.props.posts[key]);

    posts.sort((a, b) => {
      if (a.voteScore > b.voteScore) {
        return -1;
      }
      if (a.voteScore < b.voteScore) {
        return 1;
      }
      // a.voteScore must be equal to b.voteScore
      return 0;
    });

    this.setState({sort: 'DESC', sorted_posts: posts})
  }

  sortChanged() {
    this.setState({sort: "CHANGED"});
  }

  childChanged(){
    this.forceUpdate()
  }

  getRenderKeys() {
    if(this.state.sorted_posts){
      return this.state.sorted_posts.length > 0 ? this.state.sorted_posts.filter(post => post.deleted === false) : false;
    }

    if(this.props.posts) {
      var array = [];
      Object.keys(this.props.posts).forEach((key, index) => {
        if(this.props.posts[key].deleted === false) {
          array.push(this.props.posts[key]);
        }
      });
      return array.length > 0 ? array : false;
    }
    else {
      return false;
    }
  }

  render() {
    var keys = this.getRenderKeys();
    return (
      <div className="App">
      <Navbar />
      <div className="main-banner category-main-page">
        <h3>Category - {this.props.match.params.category.toUpperCase()}</h3>
      </div>
        <div className="Main">
          <p style={{marginBottom: "75px"}}></p>
          <div className="container post-container">
            <div className="row">
              <div className="middlr sort-section">
                <span>Sort by vote</span>
                <button className="btn btn-primary transition" style={{margin: "10px"}} onClick={() => {this.sort_posts_byScore_asc()}}>Ascending</button>
                <button className="btn btn-primary transition" style={{margin: "10px"}} onClick={() => {this.sort_posts_byScore_desc()}}>Descending</button>
              </div>
              <div className="col-md-12">
                {this.props.posts && keys && keys.map((post) => (
                  <Post key={post.id} alertParent={this.childChanged} sortChanged={this.sortChanged} post={post} />
                ))}
              </div>
            </div>
          </div>
          </div>
      </div>

    );
  }
}

function mapStateToProps ({ posts, comments, categories }) {
  return {
    posts,
    comments,
    categories
  }
}

function mapDispatchToProps (dispatch) {
  return {
    load_posts: (data) => dispatch(actions.load_posts(data)),
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PostsByCategory)
