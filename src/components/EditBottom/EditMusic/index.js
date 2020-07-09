import React, {PureComponent} from "react";
import images from "../../../assets/images";
import './index.css'
import NavBar from "../../NavBar";
import {get, post, API} from '../../../request'

export default class EditMusic extends PureComponent {

  componentDidMount() {
    this._initData()
  }

  async _initData() {
    let result = await get(`${API.audioCategory}`)
    console.log(result)
  }

  _renderTypes() {
    return (
      <div
        id='audio-types'
      >
      </div>
    )
  }

  render() {
    return (
      <div id='edit-music-container'>
        <NavBar
          title='背景音乐'
        />
        <img
          id='music-img-bg'
          src={images.MUSIC_BG}
        />

        <div id='edit-music-box'>
          {this._renderTypes()}
          <p id='music-hot-text'>共有 50 首乐曲</p>
        </div>
      </div>
    )
  }
}