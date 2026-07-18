import { useQuery } from '@tanstack/react-query';
import {
  getPage,
  getPages,
  getProfessional,
  getProfessionalCategories,
  getProfessionalLocations,
  getProfessionals,
} from '../services/wordpressApi';
import { QUERY_KEYS } from '../utils/constants';

export function usePages() {
  return useQuery({
    queryKey: QUERY_KEYS.pages,
    queryFn: () => getPages(),
    staleTime: 5 * 60 * 1000,
  });
}

export function usePage(slug) {
  return useQuery({
    queryKey: QUERY_KEYS.page(slug),
    queryFn: () => getPage(slug),
    enabled: Boolean(slug),
    staleTime: 5 * 60 * 1000,
  });
}

export function useProfessionals(params = {}) {
  return useQuery({
    queryKey: [...QUERY_KEYS.professionals, params],
    queryFn: () => getProfessionals(params),
    staleTime: 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnMount: 'always',
    refetchOnWindowFocus: true,
  });
}

export function useProfessional(id) {
  return useQuery({
    queryKey: QUERY_KEYS.professional(id),
    queryFn: () => getProfessional(id),
    enabled: Boolean(id),
    staleTime: 60 * 1000,
    refetchOnMount: 'always',
    refetchOnWindowFocus: true,
  });
}

export function useProfessionalCategories() {
  return useQuery({
    queryKey: QUERY_KEYS.professionalCategories,
    queryFn: () => getProfessionalCategories(),
    staleTime: 10 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
  });
}

export function useProfessionalLocations() {
  return useQuery({
    queryKey: QUERY_KEYS.professionalLocations,
    queryFn: () => getProfessionalLocations(),
    staleTime: 10 * 60 * 1000,
    refetchOnMount: 'always',
  });
}
