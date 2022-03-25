import '../styles/globals.scss';
import '../styles/form.scss';
import '../styles/login.scss';

import type { AppProps } from 'next/app';

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}

export default MyApp
