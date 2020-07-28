import * as React from 'react'
import TextAreaAutoSize, {
  TextareaAutosizeProps
} from 'react-textarea-autosize'
import './index.scss'
import { ReMentions } from 'components'
import { Image, Icon } from 'semantic-ui-react'
import { useStore, placeholder, isAuthRequired } from 'services'
import { IChatState, IAuthState } from 'types'
import { useDispatch } from 'react-redux'
import { ChatActions } from 'store'
import { isBrowser } from 'react-device-detect'

export interface Props extends TextareaAutosizeProps {
  onEnter?: () => void
}
interface State {}

const ReTextArea: React.FunctionComponent<Props> = ({
  value,
  onChange,
  name,
  onEnter
}) => {
  const onKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && onEnter && !e.shiftKey) {
      e.preventDefault()
      onEnter()
    }
  }
  const { images } = useStore<IChatState>('chat')
  const { isLoggedIn } = useStore<IAuthState>('auth')
  const dispatch = useDispatch()
  return (
    <div className="textarea__container">
      <div className="textarea__wrapper">
        <div className="textarea__control">
          <div className="highlighter__container">
            <span className="highlighter" />
          </div>
          <ReMentions />
          <TextAreaAutoSize
            onChange={onChange}
            placeholder={
              isBrowser
                ? isLoggedIn
                  ? placeholder
                  : isAuthRequired
                : isLoggedIn
                ? '매너 채팅부탁!'
                : isAuthRequired
            }
            value={value}
            disabled={!isLoggedIn}
            onKeyPress={onKeyPress}
            name={name}
            style={{ border: 'none' }}
          />
          {!!images.length && (
            <Image.Group size="mini" style={{ fontSize: 'unset' }}>
              {images.map((item, i) => (
                <div
                  key={i}
                  style={{ display: 'inline-block', position: 'relative' }}
                >
                  <Image src={item} alt="thumbnail" />
                  <Icon
                    name="close"
                    style={{
                      position: 'absolute',
                      top: -9,
                      right: -9,
                      cursor: 'pointer'
                    }}
                    onClick={() =>
                      dispatch(
                        ChatActions.SET_CHAT({
                          images: images.filter((_, index) => index !== i)
                        })
                      )
                    }
                  />
                </div>
              ))}
            </Image.Group>
          )}
        </div>
      </div>
    </div>
  )
}

export default ReTextArea
