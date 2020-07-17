import React, {PureComponent, useEffect, useState} from "react";
import images from "../../../assets/images";
import './index.css'
import NavBar from "../../NavBar";
import {get, post, API} from '../../../request'
import overlays from '../../overlays/'
import OverlayViewFade from "../../overlays/OverlayViewFade";

const permissions = [
  {title: '公开', type: 'public', description: '任何用户都可见，首次发布时自动推送到好友动态'},
  {title: '保护', type: 'protect', description: '设置密码问题，只有回答正确才能打开'},
  {title: '私密', type: 'private', description: '仅自己可见'},
]
export default (props) => {
  const [permission, setPermission] = useState(props.permission || permissions[0].type)
  const [question, setQuestion] = useState('')
  const [password, setPassword] = useState('')

  useEffect(() => {
    console.log('componentDidMount')
  }, [])

  const _showProtect = () => {
    let key = overlays.show(
      <OverlayViewFade>
        <EditProtect
          password={password}
          question={question}
          onBack={() => overlays.dismiss(key)}
          onDone={(question, password) => {
            setPermission('protect')
            setPassword(password)
            setQuestion(question)
          }}
        />
      </OverlayViewFade>
    )
  }

  const _onClick = (e, type) => {
    e.stopPropagation()
    if (type === 'protect') {
      _showProtect()
    } else {
      setPermission(type)
    }
  }

  return (
    <ul style={{backgroundColor: 'white'}}>
      {permissions.map(({type, title, description}) => (
        <li
          onClick={(e) => _onClick(e, type)}
          key={type}
          className='permission-item'
        >
          <div className='permission-item-radio-and-title'>

            {permission === type
              ? <img className='permission-item-radio' src={images.icon_check}/>
              : <img className='permission-item-radio' src={images.icon_check_un}/>
            }

            <div>
              <p className='permission-item-title'>
                {title}
              </p>
              <p className='permission-item-description'>
                {description}
              </p>
            </div>

          </div>
          {type === 'protect'
            ? <img src={images.arrow_right} className='protect-right-arrow'/>
            : null}

        </li>
      ))}

    </ul>
  )

}


const EditProtect = (props) => {
  const [password, setPassword] = useState(props.password || '')
  const [question, setQuestion] = useState(props.question || '')

  return (
    <div className='protect-container'>
      <NavBar
        title='设置密码问题'
        onBack={props.onBack}
        rightButtons={[{
          text: '确定',
          onClick: () => {
            if (!question)
              return overlays.showToast('请输入问题')
            if (!password)
              return overlays.showToast('请输入密码')
            props.onDone(question, password)
            props.onBack()
          }
        }]}
      />
      <div className='protect-wrapper'>
        <input
          className='protect-input'
          placeholder='请输入问题'
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        />
        <input
          className='protect-input'
          placeholder='请输入密码'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

    </div>
  )
}