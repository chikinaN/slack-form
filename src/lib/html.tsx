import type { FC } from 'hono/jsx'

const Layout: FC = (props) => {
  return (
    <html>
      <body>{props.children}</body>
    </html>
  )
}

export { Layout };
