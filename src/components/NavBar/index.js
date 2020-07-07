import React, {PureComponent} from "react";
import './index.css'

export default class NavBar extends PureComponent {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className='nav-wrapper'>
        {/* 浮动的nav */}
        <nav className='nav-wrapper'>
        </nav>
        {/* 撑开navbar的高度，让其他元素不占据navbar的位置 */}
        <div className='nav-height'/>
      </div>
    )
  }
}