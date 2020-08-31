import React, { FunctionComponent } from 'react'
import { Modal, Button } from 'semantic-ui-react'
import { useHistory } from 'react-router-dom'
import { useStore } from 'services'
import { IAuthState } from 'types'
import { useDispatch } from 'react-redux'
import { AuthActions } from 'store'

export interface Props {}

const ReModalAuth: FunctionComponent<Props> = () => {
  const { open } = useStore<IAuthState>('auth')
  if (!open) return null
  const dispatch = useDispatch()
  const { push } = useHistory()
  const onClose = () => dispatch(AuthActions.SET_OPEN(false))
  return (
    <Modal dimmer="inverted" centered size="mini" open={open} onClose={onClose}>
      <Modal.Content>로그인이 필요합니다.</Modal.Content>
      <Modal.Actions>
        <Button size="mini" onClick={onClose}>
          취소
        </Button>
        <Button
          size="mini"
          color="orange"
          onClick={() => {
            push('/login')
            onClose()
          }}
        >
          로그인
        </Button>
      </Modal.Actions>
    </Modal>
  )
}

export default ReModalAuth
