import React, {Component} from 'react'
import './Home.css'
import overlays from '../components/overlays/'
import OverlayViewFade from "../components/overlays/OverlayViewFade";

export default class Home extends Component {

  constructor(props) {
    super(props);
    this.state = {
      style: {
        // display: 'none',
        display: 'inherit',
        top: 0
      },
      refKey: 0
    }

    this.view = React.createRef()
  }

  render() {
    return (
      <div>
        <a href='#/postnew'>去detail</a>
        <button onClick={() => this.props.history.push('postnew/new')}>go</button>
      </div>
    )
  }
}