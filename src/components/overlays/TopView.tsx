import React, {Children, Component, PureComponent} from 'react'
import md5 from 'md5'
import eventEmitter from '../../utils/events'

function randomString() {
  let str = new Date() + Math.random().toString(36).substr(2)
  return md5(str)
}

class StaticContainer extends Component {
  props: any
  shouldComponentUpdate(nextProps, nextState, nextContext) {
    return nextProps.shouldUpdate;
  }

  render() {
    return this.props.children || null
  }
}

export default class TopView extends PureComponent {
  state: any
  props: any
  constructor(props) {
    super(props);

    this.state = {
      elements: [],
    };
    this._show = this._show.bind(this)
    this._update = this._update.bind(this)
    // 必须在willMount中，如果开始运行后马上显示，在didMount中就无法显示出来，需要延迟显示
    eventEmitter.addListener("showOverlay", this._show);
    eventEmitter.addListener("updateOverlay", this._update);
  }

  componentWillUnmount() {
    eventEmitter.removeListener("showOverlay", this._show);
    eventEmitter.removeListener("updateOverlay", this._update);
  }

  static show(element) {
    let _key = randomString()
    setImmediate(() => eventEmitter.emit("showOverlay", {_key, element}))
    return _key;
  }

  static update(key, element) {
    setImmediate(() => eventEmitter.emit("updateOverlay", {key, element}))
  }

  static hideTop() {
    setImmediate(() => eventEmitter.emit("hideOverlayTop", {}))
  }

  static hideWithKey(_key) {
    setImmediate(() => eventEmitter.emit("hideOverlayWithKey", {_key}))
  }

  static hideAll() {
    setImmediate(() => eventEmitter.emit("hideAllOverlay", {}))
  }

  _show(e) {
    let elements = [...this.state.elements];
    elements.push(e);
    this.setState({elements});
  }

  _update(e) {
    let elements = [...this.state.elements];
    elements.forEach(item => {
      if (item._key === e.key) {
        item.element = e.element
      }
    })
    this.setState({elements})
  }

  _hideWithKey(_key) {
    let elements = [...this.state.elements];
    for (let i = elements.length - 1; i >= 0; --i) {
      if (elements[i]._key === _key) {
        elements.splice(i, 1);
        break;
      }
    }
    this.setState({elements});
  }

  render() {
    let {elements} = this.state;

    let elementComponents = []
    elements.forEach((item) => {
      elementComponents.push(
        <div
          key={'topView' + item._key}
          style={styles.overlay}
        >
          {
            React.cloneElement(item.element, {
              _key: item._key,
              allKeys: elements.map((item) => item._key),
              onDisappearCompleted: () => {
                this._hideWithKey(item._key)
              }
            })
          }
        </div>
      )
    })

    return (
      <div style={{backgroundColor: 'transparent', flex: 1}}>
        {/* 不允许更新 否则app页面会强制刷新 */}
        <StaticContainer shouldUpdate={false}>
          {this.props.children}
        </StaticContainer>

        {elementComponents}
      </div>
    );
  }
}

let styles: any = {
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0)',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    pointerEvents: 'none',
    zIndex: 999
  },
}
