/**
 * Neighborhood Filter Hook
 *
 * 동네 정보 기반 필터링을 제공하는 훅
 */

import { useMemo } from 'react';
import { useAuth } from '@/app/shared/contexts';

interface NeighborhoodInfo {
  neighborhood: string;
  range: 2 | 5 | 10;
  coordinates: {
    lat: number;
    lng: number;
  };
}

interface NeighborhoodFilterParams {
  neighborhood: string;
  range: number;
  lat: number;
  lng: number;
}

export function useNeighborhoodFilter() {
  const { user } = useAuth();

  /**
   * 동네 정보 추출
   */
  const neighborhoodInfo = useMemo<NeighborhoodInfo | null>(() => {
    if (!user?.location) {
      return null;
    }

    return {
      neighborhood: user.location.neighborhood,
      range: user.location.range,
      coordinates: {
        lat: user.location.latitude,
        lng: user.location.longitude,
      },
    };
  }, [user?.location]);

  /**
   * API 호출용 필터 파라미터 생성
   */
  const getFilterParams = useMemo<(() => NeighborhoodFilterParams | null)>(() => {
    return () => {
      if (!neighborhoodInfo) {
        return null;
      }

      return {
        neighborhood: neighborhoodInfo.neighborhood,
        range: neighborhoodInfo.range,
        lat: neighborhoodInfo.coordinates.lat,
        lng: neighborhoodInfo.coordinates.lng,
      };
    };
  }, [neighborhoodInfo]);

  return {
    neighborhoodInfo,
    getFilterParams,
  };
}
