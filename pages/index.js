import React from 'react'
import Link from 'next/link'
import { Container, ListHorizontal, Button } from 'components/styles/styles.js'

const HomePage = () => {
  console.log('🔥 start: ', process.env.NEXT_PUBLIC_BASE_URL)
  return (
    <Container>
      <div>Select user:</div>
      <ListHorizontal>
        {userValue.map((item, i) => {
          return (
            <Link key={i} href={'/user/' + item} passHref>
              <Button>{item}</Button>
            </Link>
          )
        })}
      </ListHorizontal>
    </Container>
  )
}

export default HomePage

const userValue = ['B1234', 'C1234']
