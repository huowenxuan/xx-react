import React, {PureComponent} from "react";
import './index.css'
import overlays from '../overlays/'
import EditBottomOverlay from './EditBottomOverlay/'

export default class EditBottom extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      extend: false
    }
  }

  componentDidMount() {
    // setInterval(() => {
    //   this.setState((prevState) => ({
    //     extend: !prevState.extend
    //   }))
    // }, 1000)
  }

  _show = ()=> {
    overlays.show(<EditBottomOverlay/>)
  }

  render() {
    const {extend} = this.state
    const {onClick} = this.props
    return (
      <div id='edit-bottom' onClick={this._show}>
      </div>
    )
  }
}