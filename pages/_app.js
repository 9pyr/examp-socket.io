import React from 'react'
import GlobalStyled from 'components/styles/styles.js'

function MyApp({ Component, pageProps }) {
  return (
    <React.Fragment>
      <GlobalStyled />
      <Component {...pageProps} />
    </React.Fragment>
  )
}

export default MyApp
