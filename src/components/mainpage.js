import React, { Component } from 'react';
import '../App.css';
import * as actions from '../actions';
import { connect } from 'react-redux';
import * as api from '../utils/api';
import { Link } from 'react-router-dom';
import Navbar from './navbar.js';
import Post from '../components/post'

class MainPage extends Component {
  constructor(props) {
    super(props);
    this.sortChanged = this.sortChanged.bind(this);
    this.childChanged = this.childChanged.bind(this);
    this.getCategories();
    this.getPosts();
  }

  state = {
    sort: ''
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
      return 0;
    });

    this.setState({sort: 'DESC', sorted_posts: posts})
  }

  childChanged(){
    this.forceUpdate()
  }

  sortChanged() {
    this.setState({sort: "CHANGED"});
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
        <div className="container post-container">
          <div className="row">
            <div className="middlr sort-section">
              <span>Sort by vote</span>
              <button className="btn btn-primary transition" style={{margin: "10px"}} onClick={() => {this.sort_posts_byScore_asc()}}>Ascending</button>
              <button className="btn btn-primary transition" style={{margin: "10px"}} onClick={() => {this.sort_posts_byScore_desc()}}>Descending</button>
            </div>
            <div className="col-md-9">
              {this.props.posts && keys && keys.map((post) => (
                <Post key={post.id} alertParent={this.childChanged} sortChanged={this.sortChanged} post={post} />
              ))}
            </div>
            <div className="col-md-3">
              <div className="card">
                <h5 className="card-header">Categories</h5>
                <div className="card-body">
                  <div className="row">
                    <div className="col-lg-6">
                      <ul className="list-unstyled mb-0">
                        {this.props.categories && keys && this.props.categories.map((category) => (
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
)(MainPage)
