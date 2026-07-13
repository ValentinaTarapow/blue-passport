import { motion } from 'framer-motion';
import styled from 'styled-components';
import { fadeInUp } from '../styles/animations';

const Container = styled(motion.div)`
  width: 100%;
`;

export default function ScrollReveal({
  children,
  className,
  delay = 0,
  as = 'div',
  ...props
}) {
  return (
    <Container
      as={as}
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-80px' }}
      variants={{
        hidden: fadeInUp.hidden,
        visible: {
          ...fadeInUp.visible,
          transition: {
            ...fadeInUp.visible.transition,
            delay,
          },
        },
      }}
      {...props}
    >
      {children}
    </Container>
  );
}
