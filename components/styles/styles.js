import styled, { createGlobalStyle } from 'styled-components'

const GlobalStyled = createGlobalStyle`
  html,
  body {
    padding: 0;
    margin: 0;
    font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen,
      Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
  }

  a {
    color: inherit;
    text-decoration: none;
  }

  * {
    box-sizing: border-box;
  }
`
export default GlobalStyled
export const Container = styled.div`
  min-height: 100vh;
  padding: 0 0.5rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
`

export const Button = styled.button`
  margin: 0 0 0 1rem;
  padding: 0.5rem 1rem;
  border: 1px solid;
  border-radius: 8px;

  background: ${(props) => {
    switch (props.status) {
      case 'alert':
        return '#ff000061'
      case 'active':
        return '#40ff0060'
      default:
        return ''
    }
  }};
  pointer-events: ${(props) => (props.status === 'active' ? 'none' : '')};
  cursor: ${(props) => (props.status === 'active' ? 'not-allowed' : '')};
`

export const ListHorizontal = styled.div`
  display: flex;
  margin-top: 1rem;
`
