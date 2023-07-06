import React from 'react'

import Container from './container'
import * as styles from './welcome-message.module.css'

const WelcomeMessage = () => {


  return (
    <Container>
        <div className={styles.content}>
            <h1>Welcome</h1>
            <p>I'm delighted to have you join me on this exciting journey into the world of web development. As a female web developer based in the UK, I'm passionate about all things tech and creativity. When I'm not immersed in coding courses or devouring tech articles, you'll often find me with a pencil in hand, sketching away.</p>
            <p>This blog is my platform to share my insights, experiences, and the occasional doodle. Whether you're a fellow developer, an aspiring techie, or simply curious about the wonders of technology, you've come to the right place.</p>
            <p>Join me as we explore the ever-evolving landscape of web development, unravel complex concepts, and discover innovative solutions. Together, we'll celebrate the joy of learning and uncover the artistic side of coding.</p>
            <p>So, grab a cup of tea, get comfortable, and let's embark on this exciting adventure together!</p>
            <p>Happy coding and creating,</p>
            <p>Dide</p>
        </div>
    </Container>
  )
}

export default WelcomeMessage
