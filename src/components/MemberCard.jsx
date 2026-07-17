import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import SocialIcon from './ui/SocialIcon';
import { useTranslation } from '../i18n/LanguageContext';
import { truncate } from '../utils/helpers';
import { media } from '../styles/theme';

const Card = styled(motion(Link))`
  display: flex;
  gap: 0.875rem;
  align-items: flex-start;
  height: 100%;
  padding: 0.875rem;
  background: ${({ theme }) => theme.colors.white};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.md};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  text-decoration: none;
  color: inherit;
  transition:
    transform ${({ theme }) => theme.transition},
    box-shadow ${({ theme }) => theme.transition},
    border-color ${({ theme }) => theme.transition};

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.shadows.md};
    border-color: rgba(52, 152, 219, 0.22);
  }

  ${media.md} {
    padding: 1rem;
    gap: 1rem;
  }
`;

const Photo = styled.div`
  flex-shrink: 0;
  width: 64px;
  height: 64px;
  border-radius: 50%;
  overflow: hidden;
  background: ${({ theme }) => theme.colors.skyLight};
  border: 1px solid ${({ theme }) => theme.colors.border};

  ${media.md} {
    width: 72px;
    height: 72px;
  }
`;

const Image = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center top;
`;

const Placeholder = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  font-size: 1.35rem;
  opacity: 0.25;
`;

const Body = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 0;
  flex: 1;
  gap: 0.2rem;
`;

const TitleRow = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 0.5rem;
`;

const Name = styled.h3`
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: 1rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.deepBlue};
  line-height: 1.25;
  margin: 0;
`;

const ContactIcons = styled.div`
  display: flex;
  flex-shrink: 0;
  align-items: center;
  gap: 0.3rem;
`;

const IconButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.75rem;
  height: 1.75rem;
  padding: 0;
  border-radius: ${({ theme }) => theme.radius.sm};
  border: 1px solid ${({ theme }) => theme.colors.border};
  color: ${({ theme }) => theme.colors.ocean};
  background: ${({ theme }) => theme.colors.white};
  cursor: pointer;
  transition:
    color ${({ theme }) => theme.transition},
    border-color ${({ theme }) => theme.transition},
    background ${({ theme }) => theme.transition};

  svg {
    width: 13px;
    height: 13px;
  }

  &:hover {
    color: ${({ theme }) => theme.colors.aqua};
    border-color: rgba(52, 152, 219, 0.35);
    background: rgba(52, 152, 219, 0.06);
  }
`;

const Meta = styled.p`
  margin: 0;
  font-size: 0.75rem;
  line-height: 1.35;
  color: ${({ theme }) => theme.colors.textMuted};
`;

const Category = styled.span`
  color: ${({ theme }) => theme.colors.ocean};
  font-weight: 600;
`;

const Description = styled.p`
  margin: 0.15rem 0 0;
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.textMuted};
  line-height: 1.45;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

function toWhatsAppUrl(value = '') {
  const trimmed = String(value).trim();
  if (!trimmed) return '';
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  const digits = trimmed.replace(/\D/g, '');
  return digits ? `https://wa.me/${digits}` : '';
}

function openExternal(event, url) {
  event.preventDefault();
  event.stopPropagation();
  window.open(url, '_blank', 'noopener,noreferrer');
}

function openMail(event, address) {
  event.preventDefault();
  event.stopPropagation();
  window.location.href = `mailto:${address}`;
}

export default function MemberCard({ professional }) {
  const { t } = useTranslation();
  const p = t.profile;
  const {
    id,
    name,
    category,
    location,
    featuredImage,
    description,
    email,
    phone,
    whatsapp,
  } = professional;

  const whatsappUrl = toWhatsAppUrl(whatsapp || phone);

  return (
    <Card to={`/professionals/${id}`} whileTap={{ scale: 0.99 }}>
      <Photo>
        {featuredImage ? (
          <Image src={featuredImage} alt="" loading="lazy" />
        ) : (
          <Placeholder aria-hidden="true">⚓</Placeholder>
        )}
      </Photo>

      <Body>
        <TitleRow>
          <Name>{name}</Name>
          {(email || whatsappUrl) && (
            <ContactIcons>
              {email && (
                <IconButton
                  type="button"
                  aria-label={p.email}
                  title={email}
                  onClick={(event) => openMail(event, email)}
                >
                  <SocialIcon name="email" />
                </IconButton>
              )}
              {whatsappUrl && (
                <IconButton
                  type="button"
                  aria-label={p.whatsapp}
                  title={whatsapp || phone}
                  onClick={(event) => openExternal(event, whatsappUrl)}
                >
                  <SocialIcon name="whatsapp" />
                </IconButton>
              )}
            </ContactIcons>
          )}
        </TitleRow>

        {(category || location) && (
          <Meta>
            {category && <Category>{category}</Category>}
            {category && location && ' · '}
            {location}
          </Meta>
        )}

        {description && <Description>{truncate(description, 90)}</Description>}
      </Body>
    </Card>
  );
}
