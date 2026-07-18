import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import SocialIcon from './ui/SocialIcon';
import CertificateBadge from './CertificateBadge';
import { useTranslation } from '../i18n/LanguageContext';
import { useProfessionalCategories } from '../hooks/useWordPress';
import {
  formatProfessionalCategories,
  withResolvedCategories,
} from '../utils/helpers';
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
  min-width: 0;
  flex: 1;
`;

const ContactIcons = styled.div`
  display: flex;
  flex-shrink: 0;
  align-items: center;
  gap: 0.3rem;
  height: 1.75rem;
`;

const IconTip = styled.span`
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;

  &:hover .card-tooltip,
  &:focus-within .card-tooltip {
    opacity: 1;
    visibility: visible;
    transform: translate(-50%, 0);
  }
`;

const Tooltip = styled.span`
  position: absolute;
  left: 50%;
  bottom: calc(100% + 0.4rem);
  z-index: 6;
  padding: 0.35rem 0.55rem;
  border-radius: ${({ theme }) => theme.radius.sm};
  background: ${({ theme }) => theme.colors.deepBlue};
  color: ${({ theme }) => theme.colors.white};
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 0.6875rem;
  font-weight: 600;
  letter-spacing: 0.02em;
  line-height: 1.3;
  white-space: nowrap;
  pointer-events: none;
  opacity: 0;
  visibility: hidden;
  transform: translate(-50%, 0.15rem);
  transition:
    opacity 0.15s ease,
    transform 0.15s ease,
    visibility 0.15s ease;
  box-shadow: ${({ theme }) => theme.shadows.sm};

  &::after {
    content: '';
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    border: 5px solid transparent;
    border-top-color: ${({ theme }) => theme.colors.deepBlue};
  }
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

const CertSlot = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.75rem;
  height: 1.75rem;
`;

const Meta = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
  margin: 0;
`;

const Category = styled.p`
  margin: 0;
  font-size: 0.75rem;
  line-height: 1.35;
  color: ${({ theme }) => theme.colors.ocean};
  font-weight: 600;
`;

const Location = styled.p`
  margin: 0;
  font-size: 0.6875rem;
  line-height: 1.35;
  font-weight: 400;
  color: ${({ theme }) => theme.colors.textMuted};
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
  const { data: taxonomyCategories = [] } = useProfessionalCategories();

  const resolved = useMemo(
    () => withResolvedCategories(professional, taxonomyCategories),
    [professional, taxonomyCategories],
  );

  const {
    id,
    name,
    location,
    featuredImage,
    email,
    phone,
    whatsapp,
    isCertificateHolder,
  } = resolved;

  const categoryLabel = formatProfessionalCategories(resolved);
  const whatsappUrl = toWhatsAppUrl(whatsapp || phone);
  const hasActions = isCertificateHolder || email || whatsappUrl;

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
          {hasActions && (
            <ContactIcons>
              {isCertificateHolder && (
                <IconTip>
                  <CertSlot>
                    <CertificateBadge label={p.certBadge} size="sm" showTooltip={false} />
                  </CertSlot>
                  <Tooltip className="card-tooltip" role="tooltip">
                    {p.certBadge}
                  </Tooltip>
                </IconTip>
              )}
              {email && (
                <IconTip>
                  <IconButton
                    type="button"
                    aria-label={p.email}
                    onClick={(event) => openMail(event, email)}
                  >
                    <SocialIcon name="email" />
                  </IconButton>
                  <Tooltip className="card-tooltip" role="tooltip">
                    {p.email}
                  </Tooltip>
                </IconTip>
              )}
              {whatsappUrl && (
                <IconTip>
                  <IconButton
                    type="button"
                    aria-label={p.whatsapp}
                    onClick={(event) => openExternal(event, whatsappUrl)}
                  >
                    <SocialIcon name="whatsapp" />
                  </IconButton>
                  <Tooltip className="card-tooltip" role="tooltip">
                    {p.whatsapp}
                  </Tooltip>
                </IconTip>
              )}
            </ContactIcons>
          )}
        </TitleRow>

        {(categoryLabel || location) && (
          <Meta>
            {categoryLabel && <Category>{categoryLabel}</Category>}
            {location && <Location>{location}</Location>}
          </Meta>
        )}
      </Body>
    </Card>
  );
}
