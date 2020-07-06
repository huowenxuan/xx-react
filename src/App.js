import React, {PureComponent} from 'react';
import logo from './logo.svg';
import './App.css';
import Router from './Router'
import Portal from './components/models/Portal'
import TopView from "./components/models/TopView";
import OverlayView from "./components/models/OverlayView";
import {EventEmitter} from 'events';
const emitter = new EventEmitter();

// export default () => (
//   <div>
//     <Router/>
//     <Portal/>
//   </div>
// )

export default class extends PureComponent {
  componentDidMount() {
    setTimeout(() => {
      TopView.show(emitter,
        <OverlayView emitter={emitter}>
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: 300,
            height: 300,
            backgroundColor: 'blue'
          }}>
            实话实说
          </div>
        </OverlayView>
      )

      setTimeout(()=>{
        TopView.show(emitter,
          <OverlayView emitter={emitter}>
            <div style={{
              position: 'absolute',
              left: 0,
              bottom: 0,
              top: 0,
              right: 0,
              backgroundColor: 'red'
            }}>
              实话实说
            </div>
          </OverlayView>
        )

        setTimeout(() => {
          TopView.hideTop(emitter)
          setTimeout(()=>{
            TopView.hideTop(emitter)
          }, 1000)
        }, 1000)
      }, 1000)
    }, 1000)
  }

  render() {
    return (
      <div>
        <Router/>
        <Portal emitter={emitter}/>
      </div>
    )
  }
}
