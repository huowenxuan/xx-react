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

  _onClick() {

  }

  _renderButton(key) {
    return (
      <button
        id='test'
        ref={key === this.state.refKey ? this.view : null}
        onClick={() => {
          this.setState({
            refKey: key
          }, () => {
            let rect = this.view.current.getBoundingClientRect()
            console.log(rect)
            let key = overlays.show(
              <OverlayViewFade style={{backgroundColor: 'transparent'}}>
                <div
                  onClick={(e) => {
                    e.stopPropagation()
                    overlays.dismiss(key)
                  }}
                  onTouchStart={(e) => {
                    overlays.dismiss(key)
                  }}
                  style={{overflow: 'scroll', width: '100%', height: '100%'}}
                >
                  <div
                    onClick={(e)=>{
                      e.stopPropagation()
                    }}
                    onTouchStart={e => e.stopPropagation()}
                    id='overlay-test'
                    style={{
                      top: rect.top + rect.height,
                      left: rect.left + rect.width / 2 - 276 / 2
                    }}
                  />
                </div>
              </OverlayViewFade>
            )

          })
        }}
      />
    )
  }

  render() {
    return (
      <div>
        <a href='#/detail/1'>去detail</a>
        <button onClick={() => this.props.history.push('detail/1')}>go</button>
        <div className='test-container'>
          {this._renderButton(1)}
          {this._renderButton(2)}
          {this._renderButton(3)}
          {this._renderButton(4)}
          {this._renderButton(5)}
        </div>


      </div>
    )
  }
}