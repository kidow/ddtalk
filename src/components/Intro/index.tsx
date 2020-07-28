import React from 'react'
import { Statistic, Modal, Tab } from 'semantic-ui-react'
import { ReTerms, RePrivacy } from 'components'
import { logEvent, useObject, useStore } from 'services'
import { IRoomState } from 'types'
import moment from 'moment'

interface Props {}
interface State {
  open: boolean
}

const ReIntro: React.FunctionComponent<Props> = () => {
  const [{ open }, setState] = useObject<State>({ open: false })
  const { rooms } = useStore<IRoomState>('room')
  return (
    <div style={{ padding: '40px 24px 16px' }}>
      <Statistic.Group style={{ justifyContent: 'center' }}>
        <Statistic
          label="채팅"
          value={rooms
            .map((item) => item.chats.length)
            .reduce((a, b) => a + b, 0)}
        />
        <Statistic label="채팅방" value={rooms.length} />
      </Statistic.Group>
      <div
        style={{
          margin: '16px 40px',
          textAlign: 'center',
          fontSize: 18,
          lineHeight: 1.4,
          wordBreak: 'keep-all',
          fontWeight: 600
        }}
      >
        디디톡은 개발자들이 코드 및 기술에 관련하여 실시간으로 질문하고 대답할
        수 있도록 만든 채팅방 플랫폼입니다.
      </div>

      <div
        style={{
          margin: '16px 40px',
          textAlign: 'center',
          fontSize: 18,
          lineHeight: 1.4,
          wordBreak: 'keep-all',
          fontWeight: 600
        }}
      >
        작성된 지 일주일이 지난 채팅은 전부 삭제됩니다.
      </div>

      <img
        src="https://firebasestorage.googleapis.com/v0/b/ddtalk-65a8c.appspot.com/o/admin%2Fintro-code.gif?alt=media&token=0664eab4-3387-49fd-b652-0952b58c5384"
        alt="intro"
        width="100%"
      />

      <div
        style={{
          margin: '16px 40px',
          textAlign: 'center',
          fontSize: 18,
          lineHeight: 1.4,
          wordBreak: 'keep-all',
          fontWeight: 600
        }}
      >
        VS Code 기반 코드를 올릴 수 있습니다.
      </div>

      <div style={{ textAlign: 'center', cursor: 'pointer', marginBottom: 4 }}>
        <a
          href="mailto:wcgo2ling@gmail.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          문의
        </a>
        {' · '}
        <span
          onClick={() =>
            window.open(
              'https://velog.io/@kidow/%EA%B0%9C%EB%B0%9C%EC%9E%90-%EC%B1%84%ED%8C%85%EB%B0%A9%EC%9D%84-%EB%A7%8C%EB%93%A4%EC%96%B4-%EB%B4%A4%EC%8A%B5%EB%8B%88%EB%8B%A4',
              '_blank'
            )
          }
        >
          소개글
        </span>
        {' · '}
        <span onClick={() => setState({ open: true })}>정책</span>
        {' · '}
        <span
          onClick={() => {
            logEvent('깃허브_클릭')
            window.open('https://github.com/kidow/ddtalk', '_blank')
          }}
        >
          깃허브
        </span>
      </div>

      <div style={{ textAlign: 'center' }}>
      Copyright © {moment().format('YYYY')}. ddtalk all rights reserved.
      </div>

      <Modal open={open} onClose={() => setState({ open: false })}>
        <Modal.Content>
          <Tab
            menu={{ secondary: true, pointing: true }}
            panes={[
              {
                menuItem: '이용약관',
                render: () => (
                  <Tab.Pane as="div">
                    <ReTerms />
                  </Tab.Pane>
                )
              },
              {
                menuItem: '개인정보처리방침',
                render: () => (
                  <Tab.Pane as="div">
                    <RePrivacy />
                  </Tab.Pane>
                )
              }
            ]}
          />
        </Modal.Content>
      </Modal>
    </div>
  )
}

export default ReIntro
