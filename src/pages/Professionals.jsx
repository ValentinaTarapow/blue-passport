import { useMemo, useState } from 'react';
import styled from 'styled-components';
import HeroSection from '../components/HeroSection';
import MemberCard from '../components/MemberCard';
import ProfessionalSearchBar from '../components/ProfessionalSearchBar';
import LoadingState from '../components/LoadingState';
import ErrorState from '../components/ErrorState';
import PageTransition from '../components/PageTransition';
import {
  useProfessionalCategories,
  useProfessionalLocations,
  useProfessionals,
} from '../hooks/useWordPress';
import { getCountryOptions, professionalMatchesCountry } from '../utils/countries';
import { withResolvedTaxonomies } from '../utils/helpers';
import { buildCategoryOptions, buildProfessionalSearchParams } from '../utils/search';
import { useTranslation } from '../i18n/LanguageContext';
import { Container, Grid } from '../styles/shared';
import { media } from '../styles/theme';

const SearchSection = styled.section`
  padding: 0 0 ${({ theme }) => theme.space.sm};
  margin-top: -2rem;
  position: relative;
  z-index: 2;
`;

const ResultsSection = styled.section`
  padding: 0 0 ${({ theme }) => theme.space['2xl']};
  background: ${({ theme }) => theme.colors.offWhite};
`;

const ResultsToolbar = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space.sm};
  margin-bottom: ${({ theme }) => theme.space.md};

  ${media.md} {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
`;

const ResultCount = styled.p`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.textMuted};
  margin: 0;
`;

const SortField = styled.div`
  display: flex;
  align-items: center;
  gap: 0.625rem;
`;

const SortLabel = styled.label`
  font-size: 0.8125rem;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.textMuted};
  white-space: nowrap;
`;

const SortSelect = styled.select`
  min-width: 10.5rem;
  padding: 0.55rem 2.25rem 0.55rem 0.85rem;
  font-family: inherit;
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.text};
  background: ${({ theme }) => theme.colors.white};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.sm};
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8' fill='none'%3E%3Cpath d='M1 1.5L6 6.5L11 1.5' stroke='%231b365d' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 0.75rem center;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.aqua};
    box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.15);
  }
`;

const LocationGroup = styled.section`
  & + & {
    margin-top: ${({ theme }) => theme.space.xl};
  }
`;

const LocationHeading = styled.h2`
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: 1.375rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.deepBlue};
  margin: 0 0 ${({ theme }) => theme.space.md};
  padding-bottom: 0.5rem;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const EmptyState = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.space['2xl']};
  color: ${({ theme }) => theme.colors.textMuted};
`;

const INITIAL_FILTERS = {
  query: '',
  categoryId: '',
  location: '',
};

function getLocationLabel(professional, fallback) {
  const label = (professional.location || professional.address || '').trim();
  return label || fallback;
}

export default function Professionals() {
  const { t, lang } = useTranslation();
  const d = t.directory;
  const [draftFilters, setDraftFilters] = useState(INITIAL_FILTERS);
  const [appliedFilters, setAppliedFilters] = useState(INITIAL_FILTERS);
  const [sortBy, setSortBy] = useState('default');

  const countryOptions = useMemo(() => getCountryOptions(lang), [lang]);
  const locationOptions = useMemo(
    () => countryOptions.map((country) => ({ id: country.value, name: country.label })),
    [countryOptions],
  );

  const searchParams = useMemo(
    () => buildProfessionalSearchParams(appliedFilters),
    [appliedFilters],
  );

  const {
    data: professionals,
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useProfessionals(searchParams);

  const { data: categories = [] } = useProfessionalCategories();
  const { data: locations = [] } = useProfessionalLocations();

  const categoryOptions = useMemo(() => buildCategoryOptions(categories), [categories]);

  const filteredProfessionals = useMemo(() => {
    if (!professionals) return [];

    const resolved = professionals.map((professional) =>
      withResolvedTaxonomies(professional, categories, locations),
    );

    if (!appliedFilters.location) return resolved;

    const country = countryOptions.find(
      (option) => option.value === appliedFilters.location,
    );
    if (!country) return resolved;

    return resolved.filter((professional) =>
      professionalMatchesCountry(professional, country),
    );
  }, [professionals, categories, locations, appliedFilters.location, countryOptions]);

  const locationGroups = useMemo(() => {
    if (sortBy !== 'location') return null;

    const unknown = d.results.unknownLocation;
    const groups = new Map();

    for (const professional of filteredProfessionals) {
      const key = getLocationLabel(professional, unknown);
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key).push(professional);
    }

    return [...groups.entries()].sort((a, b) => {
      if (a[0] === unknown) return 1;
      if (b[0] === unknown) return -1;
      return a[0].localeCompare(b[0], lang, { sensitivity: 'base' });
    });
  }, [filteredProfessionals, sortBy, d.results.unknownLocation, lang]);

  const handleSearch = () => {
    setAppliedFilters({ ...draftFilters });
  };

  const hasActiveFilters =
    appliedFilters.query || appliedFilters.categoryId || appliedFilters.location;

  return (
    <PageTransition>
      <HeroSection
        compact
        tagline={d.hero.tagline}
        title={d.hero.title}
        subtitle={d.hero.subtitle}
      />

      <SearchSection>
        <Container>
          <ProfessionalSearchBar
            query={draftFilters.query}
            categoryId={draftFilters.categoryId}
            locationId={draftFilters.location}
            categories={categoryOptions}
            locations={locationOptions}
            isSearching={isFetching}
            onQueryChange={(query) =>
              setDraftFilters((current) => ({ ...current, query }))
            }
            onCategoryChange={(categoryId) =>
              setDraftFilters((current) => ({ ...current, categoryId }))
            }
            onLocationChange={(location) =>
              setDraftFilters((current) => ({ ...current, location }))
            }
            onSubmit={handleSearch}
          />
        </Container>
      </SearchSection>

      <ResultsSection>
        <Container>
          {isLoading && <LoadingState fullPage message={d.loading} />}
          {isError && (
            <ErrorState
              fullPage
              title={d.errorTitle}
              message={d.errorMessage}
              onRetry={refetch}
              showHomeLink
            />
          )}

          {!isLoading && !isError && (
            <>
              <ResultsToolbar>
                <ResultCount>
                  {filteredProfessionals.length === 1
                    ? d.results.one
                    : d.results.many.replace('{{count}}', filteredProfessionals.length)}
                </ResultCount>

                <SortField>
                  <SortLabel htmlFor="professional-sort">{d.results.sortLabel}</SortLabel>
                  <SortSelect
                    id="professional-sort"
                    value={sortBy}
                    onChange={(event) => setSortBy(event.target.value)}
                  >
                    <option value="default">{d.results.sortDefault}</option>
                    <option value="location">{d.results.sortByLocation}</option>
                  </SortSelect>
                </SortField>
              </ResultsToolbar>

              {filteredProfessionals.length > 0 ? (
                sortBy === 'location' && locationGroups ? (
                  locationGroups.map(([location, items]) => (
                    <LocationGroup key={location}>
                      <LocationHeading>{location}</LocationHeading>
                      <Grid $cols={1} $colsLg={3}>
                        {items.map((professional) => (
                          <MemberCard key={professional.id} professional={professional} />
                        ))}
                      </Grid>
                    </LocationGroup>
                  ))
                ) : (
                  <Grid $cols={1} $colsLg={3}>
                    {filteredProfessionals.map((professional) => (
                      <MemberCard key={professional.id} professional={professional} />
                    ))}
                  </Grid>
                )
              ) : (
                <EmptyState>
                  <p>
                    {hasActiveFilters ? d.results.emptyFiltered : d.results.empty}
                  </p>
                </EmptyState>
              )}
            </>
          )}
        </Container>
      </ResultsSection>
    </PageTransition>
  );
}
