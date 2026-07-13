import { motion } from 'framer-motion';
import styled from 'styled-components';
import { pageTransition } from '../styles/animations';

const Wrapper = styled(motion.div)`
  width: 100%;
`;

export default function PageTransition({ children }) {
  return (
    <Wrapper
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageTransition}
    >
      {children}
    </Wrapper>
  );
}
