import React from 'react'
import { ModalProps, Modal } from 'semantic-ui-react'
import { ReIntro } from 'components'

interface Props extends ModalProps {
  onClose: () => void
}
interface State {}

const ReModalIntro: React.FunctionComponent<Props> = ({ open, onClose }) => {
  return (
    <Modal size="fullscreen" open={open} onClose={onClose}>
      <ReIntro />
    </Modal>
  )
}

export default ReModalIntro
