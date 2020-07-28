import React from 'react'
import {
  ModalProps,
  Modal,
  Button,
  Icon,
  Confirm,
  Tab,
  Comment,
  Label,
  Header
} from 'semantic-ui-react'
import {
  useStore,
  googleLogin,
  useObject,
  deleteUser,
  toastSuccess,
  cookieSet,
  requestPermission,
  getToken,
  toastInfo,
  deleteToken
} from 'services'
import { IAuthState, ISettingState } from 'types'
import { useDispatch } from 'react-redux'
import { AuthActions, SettingActions } from 'store'
import { ReRadio, ReSwitch } from 'components'
import moment from 'moment'

export interface Props extends ModalProps {
  onClose: () => void
}
interface State {
  resignOpen: boolean
  size: ISettingState['size']
  alarmChecked: boolean
}

const ReModalSetting: React.FunctionComponent<Props> = ({ open, onClose }) => {
  if (!open) return null
  const { isLoggedIn } = useStore<IAuthState>('auth')
  const settingState = useStore<ISettingState>('setting')
  const [{ resignOpen, size, alarmChecked }, setState] = useObject<State>({
    resignOpen: false,
    size: settingState.size,
    alarmChecked: !!settingState.fcm_token
  })
  const dispatch = useDispatch()
  const onResign = async () => {
    await deleteUser()
    toastSuccess('다음에 봐요.')
    dispatch(AuthActions.INITIALIZE())
    setState({ resignOpen: false })
    onClose()
  }
  const onSave = () => {
    cookieSet('setting', { ...settingState, size })
    dispatch(SettingActions.SET_SETTING({ size }))
    toastSuccess('설정이 변경되었습니다.')
    onClose()
  }
  const onAlarmChange = async (alarmChecked: boolean) => {
    try {
      if (!alarmChecked) {
        await deleteToken(settingState.fcm_token)
        cookieSet('setting', { ...settingState, fcm_token: '' })
        setState({ alarmChecked: false })
        toastSuccess('알림이 비활성화되었습니다.')
      } else {
        await requestPermission()
        const fcm_token = await getToken()
        if (!fcm_token) return
        cookieSet('setting', { ...settingState, fcm_token })
        dispatch(SettingActions.SET_SETTING({ fcm_token }))
        toastSuccess('알림이 허용되었습니다.')
        setState({ alarmChecked: true })
      }
    } catch (err) {
      console.dir(err)
      if (err.code === 'messaging/permission-blocked')
        toastInfo('알림을 차단하셨습니다. 알림  권한을 다시 허용해 주세요.')
    }
  }
  const list = [
    'mini',
    'tiny',
    'small',
    'large',
    'big',
    'huge',
    'massive'
  ].map((item) => ({ label: item, value: item }))
  return (
    <>
      <Modal open={open} size="tiny" onClose={onClose}>
        <Modal.Header>설정</Modal.Header>
        <Modal.Content>
          <Tab
            menu={{ secondary: true }}
            panes={[
              {
                menuItem: '기본',
                render: () => (
                  <Tab.Pane as="div">
                    <ReRadio
                      value={size}
                      label="채팅 사이즈"
                      list={list}
                      onChange={(size) => setState({ size })}
                    >
                      <Comment.Group size={size}>
                        <Comment>
                          <Comment.Avatar src="https://react.semantic-ui.com/images/avatar/small/matt.jpg" />
                          <Comment.Content>
                            <Comment.Author as="a">유저네임</Comment.Author>
                            <Comment.Metadata>
                              <div>{moment().format('HH:mm A')}</div>
                            </Comment.Metadata>
                            <Comment.Text>메세지</Comment.Text>
                            <Comment.Actions>
                              <Comment.Action>
                                <Label size="mini" image>
                                  라벨
                                </Label>
                              </Comment.Action>
                            </Comment.Actions>
                          </Comment.Content>
                        </Comment>
                      </Comment.Group>
                    </ReRadio>
                    <div style={{ textAlign: 'right' }}>
                      <Button color="orange" onClick={onSave}>
                        저장
                      </Button>
                    </div>
                  </Tab.Pane>
                )
              },
              {
                menuItem: '내 정보',
                render: () => (
                  <Tab.Pane as="div">
                    {isLoggedIn ? (
                      <Button
                        color="red"
                        onClick={() => setState({ resignOpen: true })}
                      >
                        회원 탈퇴
                      </Button>
                    ) : (
                      <Button color="google plus" onClick={googleLogin}>
                        <Icon name="google" /> 구글 로그인
                      </Button>
                    )}
                  </Tab.Pane>
                )
              },
              {
                menuItem: '알림',
                render: () => (
                  <Tab.Pane as="div">
                    <Header size="small">
                      알림을 설정하면 멘션이 올 때 알람을 받을 수 있습니다.
                    </Header>
                    <ReSwitch checked={alarmChecked} onChange={onAlarmChange} />
                  </Tab.Pane>
                )
              }
            ]}
          />
        </Modal.Content>
      </Modal>
      <Confirm
        size="mini"
        open={resignOpen}
        cancelButton="아니요"
        confirmButton="예"
        content="정말 탈퇴하시겠습니까?"
        onCancel={() => setState({ resignOpen: false })}
        onConfirm={onResign}
      />
    </>
  )
}

export default ReModalSetting
