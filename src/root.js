import React from 'react'
import PropTypes from 'prop-types'
import { Provider } from 'react-redux'
import { Route, BrowserRouter,Switch } from 'react-router-dom'
import PostPage from './components/postpage'
import MainPage from './components/mainpage'
import CreatePage from './components/createpage'
import CreateComment from './components/createcomment'
import PostsByCategory from './components/postsbycategory'
import PostByCategory from './components/postbycategory'
import PageNotFound from './components/PageNotFound'

const Root = ({ store }) => (
  <Provider store={store}>
    <BrowserRouter>
      <div>
        <Route exact path='/create/post' component={CreatePage} />
        <Route exact path='/posts/:id/create_comment' component={CreateComment} />
        <Route exact path='/:category/:post_id' component={PostByCategory} />
        <Switch>
          <Route exact path='/' component={MainPage} />
          <Route exact path='/:category' component={PostsByCategory} />
          <Route exact path='/posts/:id' component={PostPage} />
          <Route component={PageNotFound} />
        </Switch>
      </div>
    </BrowserRouter>

  </Provider>
)

Root.propTypes = {
  store: PropTypes.object.isRequired
}

export default Root
