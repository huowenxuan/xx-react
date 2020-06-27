import React, {Component} from 'react'
import MediaItem from "../components/MediaItem";
const post = require('../tmp/post.json')
export default class Detail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      post
    }
  }

  componentDidMount() {
    const {id} = this.props.match.params
  }

  _renderMedia(media) {
    return media.map(data => <MediaItem key={data.id} data={data}/>)
  }

  render() {
    const {post} = this.state
    return (
      <div>
        <a href='#/'>回到Home</a>
        <button onClick={() => this.props.history.goBack()}>back</button>

        <header>
          <h1 id='title'>{post.title}</h1>
        </header>

        <p>{post.description}</p>
        {this._renderMedia(post.media)}
      </div>
    )
  }
}