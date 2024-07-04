import { Dimensions } from "react-native";

export type BoundType = {
  northeast: {
    lat: number;
    lng: number;
  };
  southwest: {
    lat: number;
    lng: number;
  };
};

function calculateBounds(
  centerLat: number,
  centerLng: number,
  zoom: number
): BoundType {
  const scale = Math.pow(2, 14 - zoom);
  const latDelta = (0.1 / scale) * 2;
  const lngDelta = (0.1 / scale) * Math.cos((centerLat * Math.PI) / 180) * 2;

  return {
    northeast: {
      lat: centerLat + latDelta / 2,
      lng: centerLng + lngDelta / 2,
    },
    southwest: {
      lat: centerLat - latDelta / 2,
      lng: centerLng - lngDelta / 2,
    },
  };
}

export default function getInitialRegion(
  latitude: number,
  longitude: number,
  heightPercentage: number
) {
  const { width, height } = Dimensions.get("screen");
  const bounds = calculateBounds(latitude, longitude, heightPercentage);
  const northeastLat = bounds.northeast.lat,
    southwestLat = bounds.southwest.lat;
  const northeastLng = bounds.northeast.lng,
    southwestLng = bounds.southwest.lng;
  return {
    latitude: (northeastLat + southwestLat) / 2,
    longitude: (northeastLng + southwestLng) / 2,
    latitudeDelta:
      Math.max(northeastLat, southwestLat) -
      Math.min(northeastLat, southwestLat),
    longitudeDelta:
      ((Math.max(northeastLng, southwestLng) -
        Math.min(northeastLng, southwestLng)) *
        (height * heightPercentage)) /
      width,
  };
}
