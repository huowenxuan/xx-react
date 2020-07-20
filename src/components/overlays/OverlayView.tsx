import React, {PureComponent} from 'react';
import eventEmitter from './events'
export default class OverlayView extends PureComponent {
  props: any
  constructor(props) {
    super(props)

    this.hideWithKey = this.hideWithKey.bind(this)
    this.hideTop = this.hideTop.bind(this)
    this.disappear = this.disappear.bind(this)
    eventEmitter.addListener("hideOverlayWithKey", this.hideWithKey);
    eventEmitter.addListener("hideOverlayTop", this.hideTop);
    eventEmitter.addListener("hideAllOverlay", this.disappear);

    this.onBackAndroidDisappear = this.onBackAndroidDisappear.bind(this)
    this.onBackAndroidNothing = this.onBackAndroidNothing.bind(this)

    // if (this.props.shouldBackPressDisappear) {
    //   BackHandler.addEventListener('hardwareBackPress', this.onBackAndroidDisappear);
    // } else {
    //   BackHandler.addEventListener('hardwareBackPress', this.onBackAndroidNothing);
    // }
  }

  static defaultProps = {
  }

  componentDidMount() {
    this.appear()
  }

  componentWillUnmount() {
    eventEmitter.removeListener("hideOverlayWithKey", this.hideWithKey);
    eventEmitter.removeListener("hideOverlayTop", this.hideTop);
    eventEmitter.removeListener("hideAllOverlay", this.disappear);

    // if (this.props.shouldBackPressDisappear) {
    //   BackHandler.removeEventListener('hardwareBackPress', this.onBackAndroidDisappear);
    // } else {
    //   BackHandler.removeEventListener('hardwareBackPress', this.onBackAndroidNothing);
    // }
  }

  onBackAndroidDisappear() {
    this.disappear()
    return true
  }

  onBackAndroidNothing() {
    return true
  }

  hideWithKey(e) {
    const {_key} = this.props
    if (e._key === _key) {
      this.disappear()
    }
  }

  hideTop() {
    // hideTop两次隐藏的间隔一定要小于消失动画的间隔
    // 否则第一个还没销毁，第二个就要隐藏，隐藏的都是第一个，导致第二个隐藏不掉
    const {_key, allKeys} = this.props
    if (allKeys[allKeys.length - 1] === _key) {
      this.disappear()
    }
  }

  // 子类写了appear会自动调用子类的appear
  appear() {
  }

  disappear() {
    this.onDisappearCompleted()
  }

  onDisappearCompleted() {
    const {onDisappearCompleted} = this.props
    onDisappearCompleted && onDisappearCompleted()
  }

  render() {
    return (
      <div style={styles.container}>
        {this.props.children}
      </div>
    )
  }
}

let styles: any = {
  container: {
    backgroundColor: 'transparent',
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
  }
}