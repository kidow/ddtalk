import React, { FunctionComponent } from 'react'
import {
  Modal,
  ModalProps,
  Tab,
  List,
  Image,
  Button,
  Input
} from 'semantic-ui-react'
import {
  useStore,
  createDoc,
  useObject,
  upload,
  toBase64,
  updateDoc,
  dataURLtoFile
} from 'services'
import { IRoomState, IRoom } from 'types'

export interface Props extends ModalProps {
  onClose: () => void
}
interface State {
  room: string
  newImage: string
}
const blankImage = 'https://react.semantic-ui.com/images/wireframe/image.png'

const ReModalAdmin: FunctionComponent<Props> = ({ open, onClose }) => {
  if (!open) return null
  const [{ room, newImage }, setState, onChange] = useObject<State>({
    room: '',
    newImage: blankImage
  })
  const { rooms } = useStore<IRoomState>('room')
  const createRoom = async () => {
    if (!window.confirm('정말 만드시겠습니까?')) return
    if (!newImage || !room) return
    try {
      const file = dataURLtoFile(newImage)
      const thumbnail = await upload({
        file,
        child: `room/${room}-${new Date().getTime()}`
      })
      await createDoc('rooms', {
        name: room,
        thumbnail
      })
      window.location.reload()
    } catch (err) {
      console.log(err)
    }
  }
  const imageChange = (i?: number) => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    input.onchange = async () => {
      if (!input.files) return
      const file = input.files[0]
      const newImage = await toBase64(file)
      setState({ newImage })
    }
    input.click()
  }
  const updateRoom = async (item: IRoom) => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    input.onchange = async () => {
      if (!input.files) return
      const file = input.files[0]
      const name = window.prompt('수정할 이름')
      if (!window.confirm('수정하시겠습니까?')) return
      const thumbnail = await upload({
        file,
        child: `room/${name}-${new Date().getTime()}`
      })
      await updateDoc('rooms', item.id, { thumbnail, name })
      window.location.reload()
    }
    input.click()
  }
  const deleteRoom = async (id: string) => {
    if (window.prompt('비밀번호를 입력') !== process.env.REACT_APP_PASSWORD)
      return
  }
  const panes = [
    {
      menuItem: '채팅방',
      render: () => (
        <List size="small" verticalAlign="middle">
          {rooms.map((item, i) => (
            <List.Item key={i}>
              <Image
                avatar
                src={item.thumbnail}
                onClick={() => imageChange(i)}
              />
              <List.Content>
                <List.Header>{item.name}</List.Header>
              </List.Content>
              <List.Content floated="right">
                <Button
                  circular
                  icon="pencil"
                  onClick={() => updateRoom(item)}
                />
                <Button
                  circular
                  icon="remove"
                  color="red"
                  onClick={() => deleteRoom(item.id)}
                />
              </List.Content>
            </List.Item>
          ))}
          <List.Item>
            <Image src={newImage} alt="add" avatar onClick={imageChange} />
            <List.Content>
              <Input
                value={room}
                placeholder="새 채팅방 이름"
                onChange={onChange}
                name="room"
              />
              <Button
                circular
                icon="add"
                style={{ marginLeft: 8 }}
                onClick={createRoom}
              />
            </List.Content>
          </List.Item>
        </List>
      )
    }
  ]
  return (
    <Modal open={open} size="mini" onClose={onClose}>
      <Modal.Header>작업 관리자</Modal.Header>
      <Modal.Content>
        <Tab menu={{ secondary: true }} panes={panes} />
      </Modal.Content>
    </Modal>
  )
}

export default ReModalAdmin
