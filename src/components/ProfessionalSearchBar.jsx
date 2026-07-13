import styled from 'styled-components';
import { useTranslation } from '../i18n/LanguageContext';
import { media } from '../styles/theme';

const Form = styled.form`
  position: relative;
  z-index: 2;
  display: grid;
  grid-template-columns: 1fr;
  gap: ${({ theme }) => theme.space.md};
  width: 100%;
  padding: ${({ theme }) => theme.space.lg};
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.radius.lg};
  border: 1px solid ${({ theme }) => theme.colors.border};
  box-shadow: ${({ theme }) => theme.shadows.md};

  ${media.md} {
    grid-template-columns: 1.4fr 1fr 1fr auto;
    align-items: end;
  }
`;

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
  min-width: 0;
`;

const Label = styled.label`
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: 1.125rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.deepBlue};
`;

const fieldStyles = ({ theme }) => `
  width: 100%;
  padding: 0.85rem 1rem;
  font-family: inherit;
  font-size: 0.9375rem;
  color: ${theme.colors.text};
  background: ${theme.colors.offWhite};
  border: 1px solid rgba(52, 152, 219, 0.35);
  border-radius: ${theme.radius.sm};
  transition: border-color 0.2s ease, box-shadow 0.2s ease;

  &::placeholder {
    color: ${theme.colors.textMuted};
  }

  &:focus {
    outline: none;
    border-color: ${theme.colors.aqua};
    box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.15);
    background: ${theme.colors.white};
  }
`;

const Input = styled.input`
  ${fieldStyles}
`;

const Select = styled.select`
  ${fieldStyles}
  appearance: none;
  padding-right: 2.5rem;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8' fill='none'%3E%3Cpath d='M1 1.5L6 6.5L11 1.5' stroke='%231b365d' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 1rem center;
  cursor: pointer;
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 0.95rem 1.5rem;
  font-size: 0.875rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.white};
  background: ${({ theme }) => theme.colors.deepBlue};
  border-radius: ${({ theme }) => theme.radius.sm};
  transition:
    background ${({ theme }) => theme.transition},
    transform ${({ theme }) => theme.transition};

  ${media.md} {
    width: auto;
    min-width: 160px;
    white-space: nowrap;
  }

  &:hover {
    background: ${({ theme }) => theme.colors.ocean};
    transform: translateY(-1px);
  }

  &:active {
    transform: scale(0.98);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export default function ProfessionalSearchBar({
  query,
  categoryId,
  locationId,
  categories = [],
  locations = [],
  isSearching = false,
  onQueryChange,
  onCategoryChange,
  onLocationChange,
  onSubmit,
}) {
  const { t } = useTranslation();
  const s = t.directory.search;

  return (
    <Form
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit();
      }}
    >
      <Field>
        <Label htmlFor="professional-search">{s.queryLabel}</Label>
        <Input
          id="professional-search"
          type="search"
          placeholder={s.queryPlaceholder}
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
        />
      </Field>

      <Field>
        <Label htmlFor="professional-category">{s.specialtyLabel}</Label>
        <Select
          id="professional-category"
          value={categoryId}
          onChange={(event) => onCategoryChange(event.target.value)}
        >
          <option value="">{s.allCategories}</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.label}
            </option>
          ))}
        </Select>
      </Field>

      <Field>
        <Label htmlFor="professional-location">{s.locationLabel}</Label>
        <Select
          id="professional-location"
          value={locationId}
          onChange={(event) => onLocationChange(event.target.value)}
        >
          <option value="">{s.allLocations}</option>
          {locations.map((location) => (
            <option key={location.id} value={location.id}>
              {location.name}
            </option>
          ))}
        </Select>
      </Field>

      <SubmitButton type="submit" disabled={isSearching}>
        {s.submit}
      </SubmitButton>
    </Form>
  );
}
