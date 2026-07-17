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
import { buildCategoryOptions, buildProfessionalSearchParams } from '../utils/search';
import { useTranslation } from '../i18n/LanguageContext';
import { Container, Grid } from '../styles/shared';

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

const ResultCount = styled.p`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.textMuted};
  margin-bottom: ${({ theme }) => theme.space.sm};
`;

const EmptyState = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.space['2xl']};
  color: ${({ theme }) => theme.colors.textMuted};
`;

const INITIAL_FILTERS = {
  query: '',
  categoryId: '',
  locationId: '',
};

export default function Professionals() {
  const { t } = useTranslation();
  const d = t.directory;
  const [draftFilters, setDraftFilters] = useState(INITIAL_FILTERS);
  const [appliedFilters, setAppliedFilters] = useState(INITIAL_FILTERS);

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

  const handleSearch = () => {
    setAppliedFilters({ ...draftFilters });
  };

  const hasActiveFilters =
    appliedFilters.query || appliedFilters.categoryId || appliedFilters.locationId;

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
            locationId={draftFilters.locationId}
            categories={categoryOptions}
            locations={locations}
            isSearching={isFetching}
            onQueryChange={(query) =>
              setDraftFilters((current) => ({ ...current, query }))
            }
            onCategoryChange={(categoryId) =>
              setDraftFilters((current) => ({ ...current, categoryId }))
            }
            onLocationChange={(locationId) =>
              setDraftFilters((current) => ({ ...current, locationId }))
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
              <ResultCount>
                {(professionals?.length ?? 0) === 1
                  ? d.results.one
                  : d.results.many.replace('{{count}}', professionals?.length ?? 0)}
              </ResultCount>

              {professionals?.length > 0 ? (
                <Grid $cols={1} $colsLg={3}>
                  {professionals.map((professional) => (
                    <MemberCard key={professional.id} professional={professional} />
                  ))}
                </Grid>
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
