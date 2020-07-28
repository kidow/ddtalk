import React from 'react'
import {
  Timeline,
  Content,
  ContentYear,
  ContentBody,
  Description
} from 'vertical-timeline-component-react'
import { useStore } from 'services'
import { IChangelogState } from 'types'
import { Divider } from 'semantic-ui-react'

interface Props {}
interface State {}

const ReChangeLog: React.FunctionComponent<Props> = () => {
  const { changelogs } = useStore<IChangelogState>('changelog')
  if (!changelogs.length) return null
  return (
    <>
      <Divider horizontal>변경 사항</Divider>
      <Timeline>
        {changelogs.map((timeline, i) => (
          <Content key={i}>
            <ContentYear
              startMonth={timeline.year}
              startDay={timeline.month}
              startYear={timeline.day}
            />
            <ContentBody title={timeline.title}>
              {timeline.descriptions.map((description, index) => (
                <Description
                  key={index}
                  text={description.text}
                  optional={description.optional}
                />
              ))}
            </ContentBody>
          </Content>
        ))}
      </Timeline>
    </>
  )
}

export default ReChangeLog
