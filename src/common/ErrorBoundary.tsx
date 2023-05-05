import React, { Component } from 'react';

class ErrorBoundary extends Component {
  state = {
    hasError: false
  }

  componentDidCatch(error:any, info:any) {
    this.setState(state => ({...state, hasError: true}))
    console.log(error, info)
  }

  render() {
    if (this.state.hasError) {
      return <div>ErrorBoundary: something went wrong, fallback UI</div>
    } else {
      return this.props.children
    }
  }
}

export default ErrorBoundary
