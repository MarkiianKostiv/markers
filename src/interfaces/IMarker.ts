export interface IMarker {
  quest: number;
  location: { _lat: number; _long: number };
  // next: string;
  timestamp: Date;
}
