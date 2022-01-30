/**
 * Put here all you need to store for all users in local Storage
 */
// import { useCommonStorageValueTemplate } from './other-stores/common-storage-store';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface CommonStoredData {
  username: string;
  tocken?: string;
}

/**
 * Use this hook to obtain real value from CommonStoredData
 */
// export const useCommonStorageValue: <
//   T extends CommonStoredData,
//   P extends keyof CommonStoredData = keyof CommonStoredData
// >(
//   key: P,
// ) => [CommonStoredData[P] | undefined, (value: CommonStoredData[P]) => void] = useCommonStorageValueTemplate;
