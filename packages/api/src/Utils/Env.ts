import {SafeExecute} from './Helpers';

export const FIREBASE_SERVICE_ACCOUNT = SafeExecute(
  () => JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON ?? ''),
  'FIREBASE_SERVICE_ACCOUNT_JSON env is not valid JSON',
);
