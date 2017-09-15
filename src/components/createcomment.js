import React, { Component } from 'react';
import '../App.css';
import * as actions from '../actions'
import { connect } from 'react-redux'
import * as api from '../utils/api'
import { Link } from 'react-router-dom'
import * as tools from '../tools'
import Navbar from './navbar.js';

class CreateComment extends Component {
  constructor(props) {
    super(props);
  }

  state = {
    body: '',
    owner: 'thingthree'
  }

  updateFormBody(value) {
    this.setState({body: value});
  }

  validateNewCommentInputs() {
    if(this.state.body.length < 5) {
      return null;
    }

    var obj = {
      id: tools.randomValue(),
      timestamp: Date.now(),
      body: this.state.body.trim(),
      author: this.state.owner,
      parentId: this.props.match.params.id
    }
    console.log(obj);

    return JSON.stringify(obj);
  }

  createComment() {
    var body = this.validateNewCommentInputs();
    if(body === null) {
      alert("Check All Input Fields.\nBody Must Be a Minimum of 5 Characters.");
      return;
    }

    fetch("http://localhost:5001/comments",
    {method: "POST", body: body, headers: api.headers_one()})
    .then((resp) => {
      resp.json().then((data) => {
        var obj = {
          type: actions.ADD_COMMENT,
          id: data.id,
          timestamp: data.timestamp,
          body: data.body,
          author: this.state.owner,
          parentId: data.parentId,
          deleted: data.deleted,
          voteScore: data.voteScore,
          parentDeleted: data.parentDeleted
        }

        this.props.add_comment(obj);
        window.location.href = "/posts/" + this.props.match.params.id;
      })
    })
  }

  render() {
    return (
      <div className="App">
        <Navbar />
        <div className="Main comment-creation">
        <div className="col-md-6">
          <br />
          <br/><br/><br/><br/>
          <label >
            <span style={{marginRight: "10px"}}>Comment</span>
          </label>
          <textarea className="input-s1 form-control" value={this.state.body} onChange={(event) => this.updateFormBody(event.target.value)}></textarea>
          <br/>
          <button className="btn btn-success btn-sm transition" onClick={() => {this.createComment()}}>Create Comment</button>
          <button className="btn btn-danger btn-sm transition"><Link to={"/posts/" + this.props.match.params.id}>Back To Post</Link></button>
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
    add_comment: (data) => dispatch(actions.add_comment(data)),
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CreateComment)
