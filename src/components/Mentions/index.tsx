import React from 'react'
import { IChatState } from 'types'
import { useStore } from 'services'
import { Label, Icon } from 'semantic-ui-react'
import { useDispatch } from 'react-redux'
import { ChatActions } from 'store'

interface Props {}
interface State {}

const ReMentions: React.FunctionComponent<Props> = () => {
  const { mentions } = useStore<IChatState>('chat')
  const dispatch = useDispatch()
  return (
    <>
      {mentions.map((item, i) => (
        <Label style={{ display: 'inline-block' }} image key={i} size="mini">
          <img
            src={
              item.avatar ||
              'https://react.semantic-ui.com/images/wireframe/square-image.png'
            }
          />
          {item.username}
          <Icon
            style={{ fontSize: 'unset' }}
            name="delete"
            onClick={() =>
              dispatch(
                ChatActions.SET_CHAT({
                  mentions: mentions.filter((_, index) => index !== i)
                })
              )
            }
          />
        </Label>
      ))}
    </>
  )
}

export default ReMentions
