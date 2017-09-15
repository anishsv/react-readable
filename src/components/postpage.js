import React, { Component } from 'react';
import '../App.css';
import * as actions from '../actions'
import { connect } from 'react-redux';
import * as api from '../utils/api';
import { Link } from 'react-router-dom';
import Navbar from './navbar.js';
import Post from '../components/post'

class PostPage extends Component {
  constructor(props) {
    super(props);
    this.childChanged = this.childChanged.bind(this);
    this.getPosts();
    this.getCategories();
  }

  getCategories() {
    fetch("http://localhost:5001/categories/", {method: "GET", headers: api.headers_one()})
    .then((resp) => {
      resp.json().then((data) => {
        var obj = {
          type: actions.LOAD_POSTS,
          categories: data.categories
        }
        this.props.load_categories(obj);
      })
    })
  }

  getPosts() {
    fetch("http://localhost:5001/posts/", {method: "GET", headers: api.headers_one()})
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

  getRenderKey() {
    if(this.props.posts) {
      if(Array.isArray(this.props.posts)) {
        return this.props.posts.length > 0 ? this.props.posts.filter(post => post.id === this.props.match.params.id)[0] : false;
      }
      else {
        var array = [];
        Object.keys(this.props.posts).forEach((key, index) => {
          if(this.props.posts[key].deleted === false) {
            array.push(this.props.posts[key]);
          }
        });
        return array.length > 0 ? array.filter(post => post.id === this.props.match.params.id)[0] : false;
      }
    }
    else {
      return false;
    }
  }

  childChanged(){
    window.location.href = '/';
  }

  render() {
    var key = this.getRenderKey();
    return (
      <div className="App">
        <Navbar />  
        <div className="container post-container">
          <div className="row">
            <div className="col-md-9">
              {this.props.match.params.id && this.props.posts && key &&
                <Post showComments={true} alertParent={this.childChanged} post={key} />}
            </div>
            <div className="col-md-3">
              <div className="card">
                <h5 className="card-header">Categories</h5>
                <div className="card-body">
                  <div className="row">
                    <div className="col-lg-6">
                      <ul className="list-unstyled mb-0">
                        {this.props.categories && key && this.props.categories.map((category) => (
                          <li key={category}><Link to={"/" + category}>{category}</Link></li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
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
    load_categories: (data) => dispatch(actions.load_categories(data)),
    load_posts: (data) => dispatch(actions.load_posts(data)),
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PostPage)
