import React from 'react'
import { Helmet } from 'react-helmet'

interface Props {
  title: string
  description?: string
  image?: string
}
interface State {}

const ReSEO: React.FunctionComponent<Props> = ({
  title,
  description,
  image
}) => {
  const metaTitle = title ? `${title} ㆍ 디디톡` : '디디톡 ㆍ 개발자 채팅방'
  return (
    <Helmet>
      <title>{metaTitle}</title>
      <meta name="description" content={description} />
      <meta name="image" content={image} />
      <meta property="og:title" content={metaTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={window.location.href} />
      <meta property="twitter:title" content={metaTitle} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={image} />
      <meta property="twitter:domain" content={window.location.href} />
    </Helmet>
  )
}

ReSEO.defaultProps = {
  title: '디디톡 ㆍ 개발자 채팅방',
  description: 'Develpoer Chatting Room',
  image:
    'https://firebasestorage.googleapis.com/v0/b/ddtalk-65a8c.appspot.com/o/room%2Fddtalk.png?alt=media&token=79eba356-349f-4353-8082-ee9d147dfb29'
}

export default ReSEO
