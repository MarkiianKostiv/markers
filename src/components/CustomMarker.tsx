export const createCustomMarkerIcon = (text: string) => {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="50" height="60" viewBox="0 0 50 60">
      <rect x="5" y="5" width="45" height="25" fill="blue" rx="5" ry="5"/>
      <text x="27" y="22" font-size="14" fill="white" text-anchor="middle" font-family="Arial" font-weight="bold">${text}</text>
      <polygon points="27,40 15,30 38,30" fill="blue"/>
    </svg>
  `;

  return {
    url: "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(svg),
    scaledSize: new window.google.maps.Size(50, 60),
    anchor: new window.google.maps.Point(25, 55),
  };
};
