import { AppProps } from 'next/app'

import '../styles/global.css'
import 'highlight.js/styles/railscasts.css'

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}