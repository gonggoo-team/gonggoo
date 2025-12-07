/**
 * 서울 주요 지역 데이터
 * 공구 거래 장소로 사용될 실제 지하철역 정보
 */

export interface Location {
  id: string;
  name: string;           // "강남역 10번 출구"
  address: string;        // "서울 강남구 강남대로 지하 396"
  latitude: number;
  longitude: number;
}

/**
 * 서울 주요 지역 20곳
 * 실제 좌표값 기준
 */
export const SEOUL_LOCATIONS: Location[] = [
  {
    id: 'gangnam',
    name: '강남역 10번 출구',
    address: '서울 강남구 강남대로 지하 396',
    latitude: 37.4979,
    longitude: 127.0276,
  },
  {
    id: 'hongdae',
    name: '홍대입구역 9번 출구',
    address: '서울 마포구 양화로 지하 160',
    latitude: 37.5572,
    longitude: 126.9224,
  },
  {
    id: 'jamsil',
    name: '잠실역 2번 출구',
    address: '서울 송파구 올림픽로 지하 265',
    latitude: 37.5133,
    longitude: 127.1000,
  },
  {
    id: 'sinchon',
    name: '신촌역 3번 출구',
    address: '서울 서대문구 신촌역로 지하 25',
    latitude: 37.5559,
    longitude: 126.9364,
  },
  {
    id: 'itaewon',
    name: '이태원역 1번 출구',
    address: '서울 용산구 이태원로 지하 177',
    latitude: 37.5344,
    longitude: 126.9947,
  },
  {
    id: 'kondae',
    name: '건대입구역 5번 출구',
    address: '서울 광진구 아차산로 지하 272',
    latitude: 37.5402,
    longitude: 127.0695,
  },
  {
    id: 'sillim',
    name: '신림역 1번 출구',
    address: '서울 관악구 신림로 지하 340',
    latitude: 37.4842,
    longitude: 126.9297,
  },
  {
    id: 'nowon',
    name: '노원역 3번 출구',
    address: '서울 노원구 동일로 지하 1414',
    latitude: 37.6553,
    longitude: 127.0610,
  },
  {
    id: 'sadang',
    name: '사당역 4번 출구',
    address: '서울 동작구 남부순환로 지하 2089',
    latitude: 37.4765,
    longitude: 126.9815,
  },
  {
    id: 'wangsimni',
    name: '왕십리역 7번 출구',
    address: '서울 성동구 왕십리로 지하 410',
    latitude: 37.5612,
    longitude: 127.0372,
  },
  {
    id: 'suyu',
    name: '수유역 2번 출구',
    address: '서울 강북구 도봉로 지하 398',
    latitude: 37.6381,
    longitude: 127.0255,
  },
  {
    id: 'snue',
    name: '서울대입구역 3번 출구',
    address: '서울 관악구 남부순환로 지하 1820',
    latitude: 37.4813,
    longitude: 126.9527,
  },
  {
    id: 'jongno3',
    name: '종로3가역 5번 출구',
    address: '서울 종로구 종로 지하 120',
    latitude: 37.5710,
    longitude: 126.9918,
  },
  {
    id: 'guro',
    name: '구로디지털단지역 2번 출구',
    address: '서울 구로구 디지털로 지하 273',
    latitude: 37.4852,
    longitude: 126.9016,
  },
  {
    id: 'gyodae',
    name: '교대역 11번 출구',
    address: '서울 서초구 서초중앙로 지하 194',
    latitude: 37.4936,
    longitude: 127.0142,
  },
  {
    id: 'seolleung',
    name: '선릉역 4번 출구',
    address: '서울 강남구 테헤란로 지하 427',
    latitude: 37.5045,
    longitude: 127.0488,
  },
  {
    id: 'jonggak',
    name: '종각역 3번 출구',
    address: '서울 종로구 종로 지하 19',
    latitude: 37.5695,
    longitude: 126.9828,
  },
  {
    id: 'sindorim',
    name: '신도림역 1번 출구',
    address: '서울 구로구 새말로 지하 97',
    latitude: 37.5087,
    longitude: 126.8913,
  },
  {
    id: 'yeoksam',
    name: '역삼역 7번 출구',
    address: '서울 강남구 테헤란로 지하 151',
    latitude: 37.5004,
    longitude: 127.0366,
  },
  {
    id: 'mokdong',
    name: '목동역 5번 출구',
    address: '서울 양천구 목동동로 지하 293',
    latitude: 37.5264,
    longitude: 126.8747,
  },
];

/**
 * ID로 지역 정보 가져오기
 */
export const getLocationById = (id: string): Location | undefined => {
  return SEOUL_LOCATIONS.find((loc) => loc.id === id);
};

/**
 * 인덱스로 지역 정보 가져오기 (순환)
 */
export const getLocationByIndex = (index: number): Location => {
  return SEOUL_LOCATIONS[index % SEOUL_LOCATIONS.length];
};
