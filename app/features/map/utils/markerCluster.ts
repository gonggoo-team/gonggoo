/**
 * 마커 클러스터링 및 겹침 처리 유틸리티
 *
 * 동일한 위치에 여러 마커가 있을 때 spiral 형태로 offset을 적용하여
 * 마커들이 겹치지 않고 보이도록 처리
 */

// 개발 환경에서만 console.log 활성화
const __DEV__ = process.env.NODE_ENV === 'development';

interface MarkerPosition {
  id: string;
  latitude: number;
  longitude: number;
}

/**
 * 두 좌표가 거의 동일한지 확인 (약 1m 이내)
 * @param lat1 위도 1
 * @param lng1 경도 1
 * @param lat2 위도 2
 * @param lng2 경도 2
 * @returns 동일한 위치인지 여부
 */
const isSameLocation = (lat1: number, lng1: number, lat2: number, lng2: number): boolean => {
  // 약 1m 차이 (0.00001도 = 약 1.1m)
  const THRESHOLD = 0.00001;
  return Math.abs(lat1 - lat2) < THRESHOLD && Math.abs(lng1 - lng2) < THRESHOLD;
};

/**
 * Spiral 형태로 offset 계산
 * @param index 마커 인덱스 (0부터 시작)
 * @param radius 기본 반경 (미터 단위, 기본값: 15m)
 * @returns { latOffset, lngOffset } (degree 단위)
 */
const getSpiralOffset = (
  index: number,
  radius: number = 15,
  centerLat: number = 37.5
): { latOffset: number; lngOffset: number } => {
  if (index === 0) {
    // 첫 번째 마커는 원래 위치
    return { latOffset: 0, lngOffset: 0 };
  }

  // Spiral 패턴: 각도와 반경을 증가시키며 배치
  // index 1: 0도, index 2: 120도, index 3: 240도 (삼각형)
  // index 4: 45도 (반경 증가), index 5: 135도, ...
  const angleIncrement = 137.5; // Golden angle (황금각) - 자연스러운 분산
  const angle = (index * angleIncrement * Math.PI) / 180;
  const spiralRadius = Math.sqrt(index) * radius; // 반경을 점진적으로 증가

  // 미터를 위도/경도로 변환
  // 위도 1도 ≈ 111,320m
  const latPerMeter = 1 / 111320;
  // 경도 1도는 위도에 따라 다름 (한국 위도 37도 기준)
  const lngPerMeter = 1 / (111320 * Math.cos((centerLat * Math.PI) / 180));

  const latOffset = spiralRadius * Math.sin(angle) * latPerMeter;
  const lngOffset = spiralRadius * Math.cos(angle) * lngPerMeter;

  return { latOffset, lngOffset };
};

/**
 * 마커들을 그룹화하고 겹치는 마커에 offset 적용
 * @param markers 마커 배열
 * @returns offset이 적용된 마커 배열
 */
export const applyMarkerOffsets = <T extends MarkerPosition>(markers: T[]): T[] => {
  // 위치별로 마커 그룹화
  const locationGroups = new Map<string, T[]>();

  markers.forEach((marker) => {
    // 위치 키 생성 (소수점 5자리까지 = 약 1m 정밀도)
    const locationKey = `${marker.latitude.toFixed(5)}_${marker.longitude.toFixed(5)}`;

    if (!locationGroups.has(locationKey)) {
      locationGroups.set(locationKey, []);
    }
    locationGroups.get(locationKey)!.push(marker);
  });

  // offset 적용된 마커 배열
  const result: T[] = [];
  let overlappingMarkersCount = 0;

  locationGroups.forEach((group, locationKey) => {
    if (group.length === 1) {
      // 단일 마커: 그대로 사용
      result.push(group[0]);
    } else {
      // 겹치는 마커들: spiral offset 적용
      if (__DEV__) {
        console.log(`[MarkerCluster] 동일 위치에 ${group.length}개 마커 발견:`, locationKey);
      }
      overlappingMarkersCount += group.length;

      group.forEach((marker, index) => {
        const { latOffset, lngOffset } = getSpiralOffset(index, 15, marker.latitude);

        result.push({
          ...marker,
          latitude: marker.latitude + latOffset,
          longitude: marker.longitude + lngOffset,
        });
      });
    }
  });

  if (__DEV__ && overlappingMarkersCount > 0) {
    console.log(`[MarkerCluster] ✨ ${overlappingMarkersCount}개 마커에 offset 적용 완료`);
  }

  return result;
};

/**
 * 동일 위치 마커 개수 계산
 * @param markers 마커 배열
 * @returns 동일 위치 마커 그룹 정보
 */
export const getOverlappingMarkerStats = (markers: MarkerPosition[]): {
  totalGroups: number;
  overlappingGroups: number;
  maxGroupSize: number;
} => {
  const locationGroups = new Map<string, number>();

  markers.forEach((marker) => {
    const locationKey = `${marker.latitude.toFixed(5)}_${marker.longitude.toFixed(5)}`;
    locationGroups.set(locationKey, (locationGroups.get(locationKey) || 0) + 1);
  });

  let overlappingGroups = 0;
  let maxGroupSize = 0;

  locationGroups.forEach((count) => {
    if (count > 1) {
      overlappingGroups++;
      maxGroupSize = Math.max(maxGroupSize, count);
    }
  });

  return {
    totalGroups: locationGroups.size,
    overlappingGroups,
    maxGroupSize,
  };
};
