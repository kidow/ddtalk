import React from 'react'
import { ModalProps, Modal, TextArea, Form, Button } from 'semantic-ui-react'
import { useStore, useObject, toastSuccess, createDoc } from 'services'
import { IAuthState } from 'types'

interface Props extends ModalProps {
  onClose: () => void
}
interface State {
  content: string
  loading: boolean
}

const ReModalImprove: React.FunctionComponent<Props> = ({ open, onClose }) => {
  if (!open) return null
  const { uid, email, isLoggedIn } = useStore<IAuthState>('auth')
  const [{ content, loading }, setState] = useObject<State>({
    content: '',
    loading: false
  })
  const onSubmit = async () => {
    if (!isLoggedIn) return
    setState({ loading: true })
    try {
      await createDoc('improvements', { content, uid, email })
      toastSuccess('보내주셔서 감사합니다!')
      onClose()
    } catch (err) {
      console.log('err', err)
      setState({ loading: false })
    }
  }
  return (
    <Modal open={open} onClose={onClose} size="small">
      <Modal.Header>개선점을 알려주세요!</Modal.Header>
      <Modal.Content>
        <Form>
          <TextArea
            value={content}
            name="content"
            autoFocus
            rows={8}
            onChange={(e, { value }) => setState({ content: value as string })}
            placeholder="버그가 생겼거나, 개선되었으면 하는 아이디어가 있다면 알려주세요! 응원의 메세지도 좋습니다."
          />
        </Form>
      </Modal.Content>
      <Modal.Actions>
        <Button
          loading={loading}
          positive
          content="보내기"
          onClick={onSubmit}
        />
      </Modal.Actions>
    </Modal>
  )
}

export default ReModalImprove
