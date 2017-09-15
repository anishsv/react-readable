import React, { Component } from 'react';
import '../App.css';
import * as actions from '../actions'
import { connect } from 'react-redux'
import * as api from '../utils/api'
import { Link } from 'react-router-dom'
import * as tools from '../tools'
import Navbar from './navbar.js'

class CreatePage extends Component {
  constructor(props) {
    super(props);
    this.getCategories();
  }

  state = {
    displayEditor: 'none',
    title: '',
    body: '',
    owner: 'thingthree',
    category: ''
  }

  toggleEditor() {
    var value = this.state.displayEditor === 'none' ? "block" : "none";
    this.setState({displayEditor: value});
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

  updateFormTitle(value) {
    this.setState({title: value});
  }

  updateFormBody(value) {
    this.setState({body: value});
  }

  updateFormCategory(value) {
    this.setState({category: value});
  }

  validateNewPostInputs() {
    if(this.state.title.length < 5) {
      return null;
    }
    if(this.state.body.length < 5) {
      return null;
    }
    if(this.state.category === '') {
      return null;
    }

    var obj = {
      id: tools.randomValue(),
      timestamp: Date.now(),
      title: this.state.title.trim(),
      body: this.state.body.trim(),
      author: this.state.owner,
      category: this.state.category
    }

    return JSON.stringify(obj);
  }

  createPost() {
    var body = this.validateNewPostInputs();
    if(body === null) {
      alert("Check All Input Fields.\nTitle And Body Must Be a Minimum of 5 Characters.\nCategory Must Be Selected");
      return;
    }

    fetch("http://localhost:5001/posts/",
    {method: "POST", body: body, headers: api.headers_one()})
    .then((resp) => {
      resp.json().then((data) => {
        var obj = {
          type: actions.ADD_POST,
          id: data.id,
          timestamp: data.timestamp,
          title: data.title,
          body: data.body,
          author: this.state.owner,
          category: data.category,
          deleted: data.deleted,
          voteScore: data.voteScore
        }

        this.props.add_post(obj);
        window.location.href = "/";
      })
    })
  }

  render() {
    return (
      <div className="App">
        <Navbar />
        <div className="Main post-creation">
          <h3>Create Post</h3>
          <div className="col-md-4">
            <div className="form-group">
              <input type="text" className="input-s1 form-control" placeholder="Title" value={this.state.title} onChange={(event) => this.updateFormTitle(event.target.value)}/>
            </div>
            <div className="form-group">
              <textarea type="text" className="input-s1 form-control" placeholder="Body" value={this.state.body} onChange={(event) => this.updateFormBody(event.target.value)}></textarea>
            </div>
            <div className="form-group">
              <select value={this.state.category} className="input-s1 form-control" onChange={(event) => this.updateFormCategory(event.target.value)}>
                <option disabled>Select Category</option>
                {this.props.categories && this.props.categories.map((category) => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
            <button className="btn btn-success btn-sm transition" onClick={() => {this.createPost()}}>Submit</button>
            <button className="btn btn-danger btn-sm transition"><a href="/">Cancel</a></button>
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
    add_post: (data) => dispatch(actions.add_post(data)),
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CreatePage)
