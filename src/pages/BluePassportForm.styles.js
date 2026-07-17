import styled from 'styled-components';
import { media } from '../styles/theme';

export const FormPage = styled.div`
  padding-top: ${({ theme }) => theme.layout.navbarHeight};
  padding-bottom: clamp(3rem, 8vw, 5rem);
`;

export const FormHero = styled.div`
  text-align: center;
  max-width: 36rem;
  margin: 0 auto 2rem;
  padding: clamp(1.5rem, 4vw, 2.5rem) ${({ theme }) => theme.layout.containerPadding} 0;

  ${media.md} {
    padding-inline: 2rem;
  }
`;

export const FormEyebrow = styled.span`
  display: block;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.aqua};
  margin-bottom: 0.5rem;
`;

export const FormTitle = styled.h1`
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: clamp(1.5rem, 3.5vw, 2rem);
  color: ${({ theme }) => theme.colors.deepBlue};
  margin-bottom: 0.5rem;
`;

export const FormLead = styled.p`
  font-size: 0.9375rem;
  line-height: 1.65;
  color: ${({ theme }) => theme.colors.textMuted};
`;

export const FormShell = styled.div`
  max-width: 40rem;
  margin: 0 auto;
  padding: 0 ${({ theme }) => theme.layout.containerPadding};

  ${media.md} {
    padding: 0 2rem;
  }

  ${media.lg} {
    max-width: min(92rem, calc(100% - 2rem));
    padding: 0 1.5rem;
  }
`;

export const FormCard = styled.div`
  padding: clamp(1.5rem, 4vw, 2rem);
  border-radius: ${({ theme }) => theme.radius.xl};
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.white};
  box-shadow: ${({ theme }) => theme.shadows.md};
`;

export const WizardSteps = styled.ol`
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  list-style: none;
  flex-wrap: wrap;
`;

export const WizardStep = styled.li`
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  padding: 0.35rem 0.75rem;
  border-radius: 999px;
  color: ${({ $active, $done, theme }) => {
    if ($active) return theme.colors.white;
    if ($done) return theme.colors.ocean;
    return theme.colors.textMuted;
  }};
  background: ${({ $active, $done, theme }) => {
    if ($active) return theme.colors.deepBlue;
    if ($done) return 'rgba(52, 152, 219, 0.1)';
    return theme.colors.offWhite;
  }};
  border: 1px solid
    ${({ $active, $done, theme }) => {
      if ($active) return theme.colors.deepBlue;
      if ($done) return 'rgba(52, 152, 219, 0.25)';
      return theme.colors.border;
    }};
`;

export const Form = styled.form`
  display: grid;
  gap: 1rem;
`;

export const FieldRow = styled.div`
  display: grid;
  gap: 1rem;

  ${media.md} {
    grid-template-columns: ${({ $columns }) =>
      $columns === 3 ? '1fr' : '1fr 1fr'};
  }

  ${media.lg} {
    grid-template-columns: ${({ $columns }) =>
      $columns === 3 ? 'repeat(3, 1fr)' : '1fr 1fr'};
  }
`;

export const FieldGroup = styled.div`
  display: grid;
  gap: 0.375rem;
  align-content: start;
`;

export const FieldMessage = styled.div`
  min-height: 1.25rem;
  margin-top: 0.15rem;
`;

export const Label = styled.label`
  font-size: 0.875rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.deepBlue};
`;

export const LabelWithError = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 0.5rem 0.75rem;
`;

export const RequiredMark = styled.span`
  color: ${({ theme }) => theme.colors.aqua};
`;

export const Input = styled.input`
  width: 100%;
  padding: 0.85rem 1rem;
  font-family: inherit;
  font-size: 0.9375rem;
  color: ${({ theme }) => theme.colors.text};
  background: ${({ theme }) => theme.colors.offWhite};
  border: 1px solid
    ${({ $invalid, theme }) => ($invalid ? theme.colors.error : theme.colors.border)};
  border-radius: ${({ theme }) => theme.radius.sm};
  transition: border-color 0.2s ease, box-shadow 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${({ $invalid, theme }) => ($invalid ? theme.colors.error : theme.colors.aqua)};
    box-shadow: 0 0 0 3px
      ${({ $invalid }) =>
        $invalid ? 'rgba(231, 76, 60, 0.15)' : 'rgba(52, 152, 219, 0.15)'};
    background: ${({ theme }) => theme.colors.white};
  }
`;

export const Select = styled.select`
  width: 100%;
  padding: 0.85rem 1rem;
  padding-right: 2.5rem;
  font-family: inherit;
  font-size: 0.9375rem;
  color: ${({ theme }) => theme.colors.text};
  background-color: ${({ theme }) => theme.colors.offWhite};
  border: 1px solid
    ${({ $invalid, theme }) => ($invalid ? theme.colors.error : theme.colors.border)};
  border-radius: ${({ theme }) => theme.radius.sm};
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8' fill='none'%3E%3Cpath d='M1 1.5L6 6.5L11 1.5' stroke='%231b365d' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 1rem center;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${({ $invalid, theme }) => ($invalid ? theme.colors.error : theme.colors.aqua)};
    box-shadow: 0 0 0 3px
      ${({ $invalid }) =>
        $invalid ? 'rgba(231, 76, 60, 0.15)' : 'rgba(52, 152, 219, 0.15)'};
    background-color: ${({ theme }) => theme.colors.white};
  }
`;

export const Textarea = styled.textarea`
  width: 100%;
  min-height: 7rem;
  padding: 0.85rem 1rem;
  font-family: inherit;
  font-size: 0.9375rem;
  line-height: 1.6;
  color: ${({ theme }) => theme.colors.text};
  background: ${({ theme }) => theme.colors.offWhite};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.sm};
  resize: vertical;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.aqua};
    box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.15);
    background: ${({ theme }) => theme.colors.white};
  }
`;

export const PlanGrid = styled.div`
  display: grid;
  gap: 0.75rem;

  ${media.lg} {
    grid-template-columns: repeat(3, 1fr);
    gap: 1rem;
    align-items: stretch;
  }
`;

export const PlanOption = styled.label`
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 0.75rem;
  align-items: stretch;
  height: 100%;
  padding: 1.15rem 1.2rem;
  border-radius: ${({ theme }) => theme.radius.md};
  border: 1px solid
    ${({ $selected, $invalid, theme }) =>
      $invalid ? theme.colors.error : $selected ? theme.colors.aqua : theme.colors.border};
  background: ${({ $selected, $invalid, theme }) =>
    $invalid
      ? 'rgba(231, 76, 60, 0.04)'
      : $selected
        ? 'rgba(52, 152, 219, 0.06)'
        : theme.colors.offWhite};
  cursor: ${({ $disabled }) => ($disabled ? 'not-allowed' : 'pointer')};
  opacity: ${({ $disabled }) => ($disabled ? 0.55 : 1)};
  transition: border-color 0.2s ease;

  input {
    margin-top: 0.35rem;
    align-self: start;
  }

  ${media.lg} {
    padding: 1rem;
    gap: 0.625rem;
  }
`;

export const PlanBody = styled.span`
  display: flex;
  flex-direction: column;
  min-height: 100%;
  height: 100%;
`;

export const PlanFooter = styled.span`
  display: block;
  margin-top: auto;
  padding-top: 1rem;
`;

export const PlanName = styled.span`
  font-weight: 700;
  color: ${({ theme }) => theme.colors.deepBlue};
  display: block;
`;

export const PlanSubtitle = styled.span`
  display: block;
  margin-top: 0.15rem;
  font-size: 0.8125rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.aqua};
`;

export const PlanDesc = styled.span`
  display: block;
  margin-top: 0.5rem;
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.textMuted};
  line-height: 1.55;

  ${media.lg} {
    font-size: 0.8125rem;
    line-height: 1.5;
  }
`;

export const PlanIncludes = styled.ul`
  margin: 0.65rem 0 0;
  padding: 0 0 0 1.1rem;
  display: grid;
  gap: 0.35rem;

  li {
    font-size: 0.875rem;
    color: ${({ theme }) => theme.colors.text};
    line-height: 1.45;
  }

  strong {
    font-weight: 600;
    color: ${({ theme }) => theme.colors.deepBlue};
  }

  ${media.lg} {
    padding-left: 0.95rem;

    li {
      font-size: 0.8125rem;
    }
  }
`;

export const PlanPrice = styled.span`
  font-size: 1rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.ocean};
  margin-top: 0;
  display: block;
`;

export const PlanBreakdown = styled.span`
  display: block;
  margin-top: 0.25rem;
  font-size: 0.8125rem;
  color: ${({ theme }) => theme.colors.textMuted};
  line-height: 1.45;

  ${media.lg} {
    font-size: 0.75rem;
  }
`;

export const ConsentOption = styled.label`
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 0.75rem;
  align-items: start;
  padding: 1rem;
  border-radius: ${({ theme }) => theme.radius.md};
  border: 1px solid
    ${({ $invalid, theme }) => ($invalid ? theme.colors.error : theme.colors.border)};
  background: ${({ $invalid, theme }) =>
    $invalid ? 'rgba(231, 76, 60, 0.04)' : theme.colors.offWhite};
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 0.875rem;
  line-height: 1.55;
  cursor: pointer;

  input {
    margin-top: 0.2rem;
    accent-color: ${({ theme }) => theme.colors.aqua};
  }
`;

export const PlanBadge = styled.span`
  display: inline-block;
  margin-top: 0.35rem;
  padding: 0.2rem 0.5rem;
  font-size: 0.6875rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.ocean};
  background: rgba(52, 152, 219, 0.12);
  border-radius: 999px;
`;

export const PricingSection = styled.div`
  display: grid;
  gap: 1rem;
`;

export const PricingGroupLabel = styled.span`
  display: block;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.textMuted};
  margin-bottom: 0.5rem;
`;

export const PricingGrid = styled.div`
  display: grid;
  gap: 0.75rem;
`;

export const PricingCard = styled.div`
  padding: 1rem 1.125rem;
  border-radius: ${({ theme }) => theme.radius.md};
  border: 1px solid
    ${({ $active, theme }) => ($active ? theme.colors.aqua : theme.colors.border)};
  background: ${({ $active, theme }) =>
    $active ? 'rgba(52, 152, 219, 0.06)' : theme.colors.offWhite};
`;

export const PricingCardHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 0.75rem;
  margin-bottom: 0.35rem;
`;

export const PricingCardTitle = styled.span`
  font-weight: 700;
  color: ${({ theme }) => theme.colors.deepBlue};
  font-size: 0.9375rem;
  line-height: 1.4;
`;

export const PricingCardAmount = styled.span`
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: 1.25rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.ocean};
  white-space: nowrap;
`;

export const PricingCardPeriod = styled.span`
  font-size: 0.8125rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textMuted};
`;

export const PricingCardBreakdown = styled.p`
  font-size: 0.8125rem;
  line-height: 1.5;
  color: ${({ theme }) => theme.colors.ocean};
  margin: 0.25rem 0 0;
  font-weight: 600;
`;

export const PricingCardDesc = styled.p`
  font-size: 0.8125rem;
  line-height: 1.55;
  color: ${({ theme }) => theme.colors.textMuted};
  margin: 0.35rem 0 0;
`;

export const PricingSelection = styled.div`
  padding: 1.25rem 1.375rem;
  border-radius: ${({ theme }) => theme.radius.md};
  border: 1px solid ${({ theme }) => theme.colors.aqua};
  background: rgba(52, 152, 219, 0.08);
`;

export const PricingTotalLabel = styled.span`
  display: block;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.ocean};
  margin-bottom: 0.35rem;
`;

export const PricingTotalAmount = styled.div`
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: clamp(1.75rem, 4vw, 2.25rem);
  font-weight: 700;
  color: ${({ theme }) => theme.colors.deepBlue};
  line-height: 1.1;
  margin-bottom: 0.35rem;
`;

export const PricingTotalPeriod = styled.span`
  font-size: 1rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textMuted};
`;

export const PricingTotalNote = styled.p`
  font-size: 0.9375rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.deepBlue};
  margin: 0 0 0.75rem;
`;

export const PricingIncludes = styled.ul`
  margin: 0;
  padding: 0;
  list-style: none;
  display: grid;
  gap: 0.35rem;

  li {
    font-size: 0.875rem;
    line-height: 1.5;
    color: ${({ theme }) => theme.colors.text};
  }
`;

export const PricingReference = styled.p`
  font-size: 0.8125rem;
  line-height: 1.55;
  color: ${({ theme }) => theme.colors.textMuted};
  margin: 0.75rem 0 0;
`;

export const PricingReferenceList = styled.ul`
  margin: 0.5rem 0 0;
  padding-left: 1.1rem;
  display: grid;
  gap: 0.25rem;

  li {
    font-size: 0.8125rem;
    line-height: 1.5;
    color: ${({ theme }) => theme.colors.textMuted};
  }
`;

export const SummaryCard = styled.div`
  padding: 1rem 1.125rem;
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.colors.offWhite};
  border: 1px solid ${({ theme }) => theme.colors.border};
  margin-bottom: 1rem;
`;

export const SummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  font-size: 0.875rem;
  padding: 0.35rem 0;

  dt {
    color: ${({ theme }) => theme.colors.textMuted};
  }

  dd {
    font-weight: 600;
    color: ${({ theme }) => theme.colors.deepBlue};
    text-align: right;
  }
`;

export const Actions = styled.div`
  display: grid;
  gap: 0.75rem;
  margin-top: 0.5rem;
`;

export const FormClosing = styled.div`
  display: grid;
  gap: 1rem;
  width: 100%;
  max-width: 36rem;
  margin: 0.25rem auto 0;
`;

export const Note = styled.p`
  font-size: 0.8125rem;
  line-height: 1.6;
  color: ${({ theme }) => theme.colors.textMuted};
  margin-top: 0.75rem;
`;

export const SuccessIcon = styled.div`
  width: 3.5rem;
  height: 3.5rem;
  margin: 0 auto 1rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  background: rgba(52, 152, 219, 0.12);
  color: ${({ theme }) => theme.colors.ocean};
`;

export const ReviewNote = styled.div`
  margin-top: 1rem;
  padding: 1rem;
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.colors.skyLight};
  border: 1px solid rgba(52, 152, 219, 0.15);
  font-size: 0.875rem;
  line-height: 1.6;
  color: ${({ theme }) => theme.colors.textMuted};
`;

export const CheckboxPanel = styled.div`
  border-radius: ${({ theme }) => theme.radius.sm};
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.offWhite};
  overflow: hidden;
`;

export const CheckboxSearch = styled(Input)`
  border: none;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 0;
  background: ${({ theme }) => theme.colors.white};

  &:focus {
    box-shadow: none;
    border-bottom-color: ${({ theme }) => theme.colors.aqua};
  }
`;

export const CheckboxGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.5rem;
  max-height: 14rem;
  overflow-y: auto;
  padding: 0.75rem;
  background: ${({ theme }) => theme.colors.offWhite};
`;

export const CheckboxOption = styled.label`
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  padding: 0.5rem 0.625rem;
  border-radius: ${({ theme }) => theme.radius.sm};
  font-size: 0.875rem;
  line-height: 1.4;
  color: ${({ theme }) => theme.colors.text};
  cursor: pointer;
  padding-left: ${({ $isChild }) => ($isChild ? '1.75rem' : '0.625rem')};
  background: ${({ $checked, theme }) =>
    $checked ? 'rgba(52, 152, 219, 0.08)' : 'transparent'};
  border: 1px solid
    ${({ $checked, theme }) => ($checked ? 'rgba(52, 152, 219, 0.25)' : 'transparent')};

  input {
    margin-top: 0.15rem;
    flex-shrink: 0;
    accent-color: ${({ theme }) => theme.colors.aqua};
  }

  &:hover {
    background: rgba(52, 152, 219, 0.05);
  }
`;

export const FileInput = styled(Input)`
  padding: 0.5rem 0.75rem;
  cursor: pointer;

  &::file-selector-button {
    margin-right: 0.75rem;
    padding: 0.35rem 0.75rem;
    border: none;
    border-radius: ${({ theme }) => theme.radius.sm};
    background: ${({ theme }) => theme.colors.ocean};
    color: ${({ theme }) => theme.colors.white};
    font-size: 0.8125rem;
    font-weight: 600;
    cursor: pointer;
  }
`;

export const PhotoPreview = styled.div`
  margin-top: 0.75rem;

  img {
    display: block;
    width: 8rem;
    height: 8rem;
    object-fit: cover;
    border-radius: ${({ theme }) => theme.radius.md};
    border: 1px solid ${({ theme }) => theme.colors.border};
  }
`;

export const PhotoAttachCard = styled.div`
  margin: 1rem 0;
  padding: 1.25rem;
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.colors.offWhite};
  border: 1px solid ${({ theme }) => theme.colors.border};
  text-align: center;

  img {
    display: block;
    width: 7rem;
    height: 7rem;
    object-fit: cover;
    border-radius: ${({ theme }) => theme.radius.md};
    border: 1px solid ${({ theme }) => theme.colors.border};
    margin: 0 auto 0.75rem;
  }

  p {
    font-size: 0.875rem;
    line-height: 1.55;
    color: ${({ theme }) => theme.colors.textMuted};
    margin: 0 0 0.75rem;
  }
`;

export const FileList = styled.ul`
  margin: 0.75rem 0 0;
  padding: 0;
  list-style: none;
  display: grid;
  gap: 0.5rem;

  li {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.75rem;
    padding: 0.625rem 0.75rem;
    border-radius: ${({ theme }) => theme.radius.sm};
    border: 1px solid ${({ theme }) => theme.colors.border};
    background: ${({ theme }) => theme.colors.offWhite};
    font-size: 0.875rem;
    color: ${({ theme }) => theme.colors.text};
  }

  button {
    flex-shrink: 0;
    border: none;
    background: transparent;
    color: ${({ theme }) => theme.colors.ocean};
    font-size: 0.8125rem;
    font-weight: 600;
    cursor: pointer;
    padding: 0;
  }
`;

export const FieldHint = styled.p`
  font-size: 0.8125rem;
  color: ${({ theme }) => theme.colors.textMuted};
  margin: 0;
`;

export const DiscountCodeRow = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: stretch;

  input {
    flex: 1;
    min-width: 0;
  }
`;

export const FieldSuccess = styled.p`
  font-size: 0.8125rem;
  color: ${({ theme }) => theme.colors.ocean};
  margin-top: 0.35rem;
`;

export const FieldError = styled.p`
  font-size: 0.8125rem;
  color: ${({ theme }) => theme.colors.error};
  margin: 0;
  line-height: 1.25rem;
`;
