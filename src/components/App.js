import React, { Component } from 'react';
import logo from '../logo.svg';
import '../App.css';
import '../blog-home.css';
import '../bootstrap.min.css';

class App extends Component {
  render() {
    return (
    <div>
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top">
      <div className="container">
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarResponsive" aria-controls="navbarResponsive" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarResponsive">
          <ul className="navbar-nav ml-auto">
            <li className="nav-item active">
              <a className="nav-link" >Home
                <span className="sr-only">(current)</span>
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" >About</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" >Services</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" >Contact</a>
            </li>
          </ul>
        </div>
      </div>
    </nav>

    <div className="container">

      <div className="row">

        <div className="col-md-8">

          <h1 className="my-4">Page Heading
            <small>Secondary Text</small>
          </h1>

          <div className="card mb-4">
            <div className="card-body">
              <h2 className="card-title">Post Title</h2>
              <p className="card-text">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Reiciendis aliquid atque, nulla? Quos cum ex quis soluta, a laboriosam. Dicta expedita corporis animi vero voluptate voluptatibus possimus, veniam magni quis!</p>
              <a  className="btn btn-primary">Read More &rarr;</a>
            </div>
            <div className="card-footer text-muted">
              Posted on January 1, 2017 by
              <a >Start Bootstrap</a>
            </div>
          </div>

          <ul className="pagination justify-content-center mb-4">
            <li className="page-item">
              <a className="page-link" >&larr; Older</a>
            </li>
            <li className="page-item disabled">
              <a className="page-link" >Newer &rarr;</a>
            </li>
          </ul>

        </div>

        <div className="col-md-4">
          <div className="card my-4">
            <h5 className="card-header">Categories</h5>
            <div className="card-body">
              <div className="row">
                <div className="col-lg-6">
                  <ul className="list-unstyled mb-0">
                    <li>
                      <a >Web Design</a>
                    </li>
                    <li>
                      <a >HTML</a>
                    </li>
                    <li>
                      <a >Freebies</a>
                    </li>
                  </ul>
                </div>
                <div className="col-lg-6">
                  <ul className="list-unstyled mb-0">
                    <li>
                      <a >JavaScript</a>
                    </li>
                    <li>
                      <a >CSS</a>
                    </li>
                    <li>
                      <a >Tutorials</a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="card my-4">
            <h5 className="card-header">Side Widget</h5>
            <div className="card-body">
              You can put anything you want inside of these side widgets. They are easy to use, and feature the new Bootstrap 4 card containers!
            </div>
          </div>

        </div>

      </div>

    </div>

    <footer className="py-5 bg-dark">
      <div className="container">
        <p className="m-0 text-center text-white">Copyright &copy; Your Website 2017</p>
      </div>
    </footer>
    </div>
    );
  }
}

export default App;
