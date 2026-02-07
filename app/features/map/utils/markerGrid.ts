/**
 * Grid 기반 공간 인덱싱
 * O(n²) → O(n) 최적화
 *
 * 마커 간 거리 계산 시 모든 마커 쌍을 검사하는 대신,
 * 공간을 그리드로 나누어 인접한 셀만 검사함으로써 성능을 대폭 개선
 */

type GridKey = string; // "lat_lng" 형식

export interface MapMarker {
  latitude: number;
  longitude: number;
  id: string;
}

/**
 * 위도/경도를 그리드 셀 좌표로 변환
 * @param lat 위도
 * @param lng 경도
 * @param cellSizeMeters 셀 크기 (미터 단위)
 * @returns 그리드 셀 키 (예: "123_456")
 */
const getGridCell = (lat: number, lng: number, cellSizeMeters: number): GridKey => {
  // 위도 1도 = 약 111,320m
  const latPerMeter = 1 / 111320;
  // 경도 1도는 위도에 따라 다름 (한국 위도 37도 기준)
  const lngPerMeter = 1 / (111320 * Math.cos((lat * Math.PI) / 180));

  // 셀 크기를 도(degree) 단위로 변환
  const cellLatDegrees = cellSizeMeters * latPerMeter;
  const cellLngDegrees = cellSizeMeters * lngPerMeter;

  // 그리드 셀 인덱스 계산
  const cellLat = Math.floor(lat / cellLatDegrees);
  const cellLng = Math.floor(lng / cellLngDegrees);

  return `${cellLat}_${cellLng}`;
};

/**
 * 마커들을 그리드 셀에 배치
 * @param markers 마커 배열
 * @param cellSizeMeters 셀 크기 (미터 단위, 기본값: 30m)
 * @returns 그리드 인덱스 (셀 키 → 마커 배열)
 */
export const createGridIndex = (
  markers: MapMarker[],
  cellSizeMeters: number = 30
): Map<GridKey, MapMarker[]> => {
  const gridIndex = new Map<GridKey, MapMarker[]>();

  markers.forEach((marker) => {
    const cellKey = getGridCell(marker.latitude, marker.longitude, cellSizeMeters);

    if (!gridIndex.has(cellKey)) {
      gridIndex.set(cellKey, []);
    }

    gridIndex.get(cellKey)!.push(marker);
  });

  return gridIndex;
};

/**
 * 그리드를 사용하여 마커와 가장 가까운 다른 마커와의 거리 계산
 * 인접 9개 셀(3x3)만 검사하여 성능 최적화
 *
 * @param marker 대상 마커
 * @param gridIndex 그리드 인덱스
 * @param calculateDistance 거리 계산 함수
 * @param cellSizeMeters 셀 크기 (미터 단위, 기본값: 30m)
 * @returns 가장 가까운 마커와의 거리 (미터)
 */
export const getMinDistanceFromGrid = (
  marker: MapMarker,
  gridIndex: Map<GridKey, MapMarker[]>,
  calculateDistance: (lat1: number, lng1: number, lat2: number, lng2: number) => number,
  cellSizeMeters: number = 30
): number => {
  let minDistance = Infinity;

  // 현재 마커가 속한 셀 찾기
  const cellKey = getGridCell(marker.latitude, marker.longitude, cellSizeMeters);
  const [cellLat, cellLng] = cellKey.split('_').map(Number);

  // 인접 9개 셀 검사 (3x3 그리드: 현재 셀 + 주변 8개)
  // dLat, dLng: -1, 0, 1 (총 9가지 조합)
  for (let dLat = -1; dLat <= 1; dLat++) {
    for (let dLng = -1; dLng <= 1; dLng++) {
      const neighborKey = `${cellLat + dLat}_${cellLng + dLng}`;
      const neighbors = gridIndex.get(neighborKey);

      if (neighbors) {
        // 인접 셀의 모든 마커와 거리 계산
        neighbors.forEach((otherMarker) => {
          // 자기 자신은 제외
          if (otherMarker.id !== marker.id) {
            const distance = calculateDistance(
              marker.latitude,
              marker.longitude,
              otherMarker.latitude,
              otherMarker.longitude
            );

            if (distance < minDistance) {
              minDistance = distance;
            }
          }
        });
      }
    }
  }

  return minDistance;
};
