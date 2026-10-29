const mix = (hex, target, amount) => '#' + hex.slice(1).match(/../g).map((value, i) => Math.round(parseInt(value, 16) * (1 - amount) + target[i] * amount).toString(16).padStart(2, '0')).join('');

export function customPalette(color, dark) {
  const accent = mix(color, dark ? [255, 255, 255] : [0, 0, 0], dark ? 0.4 : 0.2);
  const channels = accent.slice(1).match(/../g).map(value => {
    const c = parseInt(value, 16) / 255;
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  const luminance = channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722;
  return {
    '--page': mix(color, dark ? [16, 16, 18] : [255, 255, 255], 0.97),
    '--surface': mix(color, dark ? [25, 25, 28] : [255, 255, 255], 0.97),
    '--soft': mix(color, dark ? [29, 29, 32] : [255, 255, 255], 0.9),
    '--line': mix(color, dark ? [65, 65, 68] : [220, 220, 224], 0.85),
    '--ink': dark ? '#f3f3f5' : '#202024',
    '--muted': dark ? '#b9b9c0' : '#62626b',
    '--accent': accent,
    '--on-accent': luminance > 0.179 ? '#000000' : '#ffffff',
  };
}
