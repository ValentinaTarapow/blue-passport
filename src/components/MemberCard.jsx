import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import { useTranslation } from '../i18n/LanguageContext';
import { truncate } from '../utils/helpers';
import { media } from '../styles/theme';

const Card = styled(motion.article)`
  display: flex;
  flex-direction: column;
  height: 100%;
  background: ${({ theme }) => theme.colors.white};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.lg};
  overflow: hidden;
  box-shadow: ${({ theme }) => theme.shadows.sm};
  transition:
    transform ${({ theme }) => theme.transition},
    box-shadow ${({ theme }) => theme.transition};

  &:hover {
    transform: translateY(-4px);
    box-shadow: ${({ theme }) => theme.shadows.md};
  }
`;

const ImageWrapper = styled.div`
  position: relative;
  flex-shrink: 0;
  aspect-ratio: 4 / 3;
  overflow: hidden;
  background: ${({ theme }) => theme.colors.skyLight};
`;

const Image = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center top;
  transition: transform 0.5s ease;

  ${Card}:hover & {
    transform: scale(1.04);
  }
`;

const Placeholder = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  font-size: 2.5rem;
  opacity: 0.2;
`;

const ImageCurve = styled.div`
  position: absolute;
  bottom: -1px;
  left: -8%;
  width: 116%;
  height: 1.75rem;
  background: ${({ theme }) => theme.colors.white};
  border-radius: 50% 50% 0 0;
  z-index: 1;
  pointer-events: none;
`;

const CategoryBadge = styled.span`
  position: absolute;
  top: 0.75rem;
  left: 0.75rem;
  z-index: 2;
  max-width: calc(100% - 1.5rem);
  padding: 0.3rem 0.65rem;
  font-size: 0.625rem;
  font-weight: 600;
  letter-spacing: 0.05em;
  line-height: 1.3;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.white};
  background: rgba(27, 54, 93, 0.92);
  border-radius: 999px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const Body = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  padding: 0.875rem 1.125rem 1.125rem;
  gap: 0.35rem;
`;

const Name = styled.h3`
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: 1.0625rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.deepBlue};
  line-height: 1.25;
`;

const Location = styled.p`
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  font-size: 0.8125rem;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.aqua};
`;

const PinIcon = styled.svg`
  width: 0.8rem;
  height: 0.8rem;
  flex-shrink: 0;
`;

const Description = styled.p`
  font-size: 0.8125rem;
  color: ${({ theme }) => theme.colors.textMuted};
  line-height: 1.55;
  flex: 1;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const ViewLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  margin-top: 0.5rem;
  font-size: 0.8125rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.ocean};
  transition:
    gap ${({ theme }) => theme.transition},
    color ${({ theme }) => theme.transition};

  &:hover {
    gap: 0.5rem;
    color: ${({ theme }) => theme.colors.aqua};
  }

  ${media.md} {
    font-size: 0.875rem;
  }
`;

export default function MemberCard({ professional }) {
  const { t } = useTranslation();
  const { id, name, category, location, featuredImage, description } = professional;

  return (
    <Card whileTap={{ scale: 0.99 }}>
      <ImageWrapper>
        {featuredImage ? (
          <Image src={featuredImage} alt={name} loading="lazy" />
        ) : (
          <Placeholder aria-hidden="true">⚓</Placeholder>
        )}
        {category && <CategoryBadge title={category}>{category}</CategoryBadge>}
        <ImageCurve aria-hidden="true" />
      </ImageWrapper>

      <Body>
        <Name>{name}</Name>
        {location && (
          <Location>
            <PinIcon viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 110-5 2.5 2.5 0 010 5z" />
            </PinIcon>
            {location}
          </Location>
        )}
        {description && <Description>{truncate(description, 120)}</Description>}
        <ViewLink to={`/professionals/${id}`}>
          {t.memberCard.viewProfile} <span aria-hidden="true">→</span>
        </ViewLink>
      </Body>
    </Card>
  );
}
