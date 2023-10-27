import { useSearchParams } from "react-router-dom";

export function useUrlPosition() {
  const [urlPosition] = useSearchParams();
  const lat = urlPosition.get("lat");
  const lng = urlPosition.get("lng");
  return [lat, lng];
}
