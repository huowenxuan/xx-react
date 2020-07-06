'use strict'

import React, {PureComponent} from 'react';

export default class OverlayView extends PureComponent {
  constructor(props) {
    super(props)
    this.emitter = props.emitter

    this.hideWithKey = this.hideWithKey.bind(this)
    this.hideTop = this.hideTop.bind(this)
    this.disappear = this.disappear.bind(this)
    this.emitter.addListener("hideOverlayWithKey", this.hideWithKey);
    this.emitter.addListener("hideOverlayTop", this.hideTop);
    this.emitter.addListener("hideAllOverlay", this.disappear);

    this.onBackAndroidDisappear = this.onBackAndroidDisappear.bind(this)
    this.onBackAndroidNothing = this.onBackAndroidNothing.bind(this)

    // if (this.props.shouldBackPressDisappear) {
    //   BackHandler.addEventListener('hardwareBackPress', this.onBackAndroidDisappear);
    // } else {
    //   BackHandler.addEventListener('hardwareBackPress', this.onBackAndroidNothing);
    // }
  }

  static defaultProps = {
    shouldBackPressDisappear: true
  }

  componentWillMount() {
    this.appear()
  }

  componentWillUnmount() {
    this.emitter.removeListener("hideOverlayWithKey", this.hideWithKey);
    this.emitter.removeListener("hideOverlayTop", this.hideTop);
    this.emitter.removeListener("hideAllOverlay", this.disappear);

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
    console.log('sbbbb')
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

let styles = {
  container: {
    backgroundColor: 'transparent',
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
  }
}