import React, {Children, Component, PureComponent} from 'react'
import md5 from 'md5'

function randomString() {
  let str = new Date() + Math.random().toString(36).substr(2)
  return md5(str)
}

class StaticContainer extends Component {
  shouldComponentUpdate(nextProps, nextState, nextContext) {
    return nextProps.shouldUpdate;
  }

  render() {
    return this.props.children || null
  }
}

export default class TopView extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      elements: [],
    };
    this.emitter = props.emitter
    this._show = this._show.bind(this)
    this._update = this._update.bind(this)
    // 必须在willMount中，如果开始运行后马上显示，在didMount中就无法显示出来，需要延迟显示
    this.emitter.addListener("showOverlay", this._show);
    this.emitter.addListener("updateOverlay", this._update);
  }

  componentWillUnmount() {
    this.emitter.removeListener("showOverlay", this._show);
    this.emitter.removeListener("updateOverlay", this._update);
  }

  static show(emitter, element) {
    let _key = randomString()
    setImmediate(() => emitter.emit("showOverlay", {_key, element}))
    return _key;
  }

  static update(emitter, key, element) {
    setImmediate(() => emitter.emit("updateOverlay", {key, element}))
  }

  static hideTop(emitter) {
    setImmediate(() => emitter.emit("hideOverlayTop", {}))
  }

  static hideWithKey(emitter, _key) {
    setImmediate(() => emitter.emit("hideOverlayWithKey", {_key}))
  }

  static hideAll(emitter) {
    setImmediate(() => emitter.emit("hideAllOverlay", {}))
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

let styles = {
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0)',
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
}
