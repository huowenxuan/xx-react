import React from 'react'
import axios from 'axios'
import moment from 'moment'
import queryString from 'query-string'

class Request {
  get(url, params) {
    url += '?'
    url += queryString.stringify(params)
    return axios.get(url).then(data=>data.data)
  }

  post(url, body) {
    return axios.post(url, body).then(data=>data.data)
  }
}
const request = new Request()
export default class Component extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};

    this.app = {
      axios,
      moment,
      request
    }
  }
}