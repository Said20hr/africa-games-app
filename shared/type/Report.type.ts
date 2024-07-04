export interface IReport {
  date: string;
  initialCash: string;
  finalCash: string;
  information?: string;
}

interface GeoLocation {
  latitude: number;
  longitude: number;
}

export interface IKeyConfirmation {
  identifier: string;
  issue: string;
  key_in: string;
  key_out: string;
  checked: boolean;
}

export interface IShiftAttendance {
  check_in: string;
  geolocation_start: GeoLocation;
  keys_confirmation: IKeyConfirmation[];
  cash_initial: boolean;
}
