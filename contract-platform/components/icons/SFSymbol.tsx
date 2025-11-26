import React from 'react';

export type SFSymbolName =
  | 'doc.text'
  | 'doc.text.fill'
  | 'person'
  | 'person.fill'
  | 'person.2'
  | 'gear'
  | 'magnifyingglass'
  | 'plus'
  | 'plus.circle'
  | 'plus.circle.fill'
  | 'checkmark'
  | 'checkmark.circle'
  | 'checkmark.circle.fill'
  | 'xmark'
  | 'xmark.circle'
  | 'arrow.left'
  | 'arrow.right'
  | 'chevron.left'
  | 'chevron.right'
  | 'chevron.down'
  | 'chevron.up'
  | 'ellipsis'
  | 'slider.horizontal.3'
  | 'line.3.horizontal'
  | 'square.and.pencil'
  | 'trash'
  | 'paperplane'
  | 'paperplane.fill'
  | 'clock'
  | 'folder'
  | 'folder.fill'
  | 'tag'
  | 'tag.fill'
  | 'bell'
  | 'bell.fill'
  | 'star'
  | 'star.fill'
  | 'square.and.arrow.up'
  | 'eye'
  | 'eye.slash'
  | 'envelope'
  | 'the-lock'
  | 'square.grid';

interface SFSymbolProps {
  name: SFSymbolName;
  size?: number;
  className?: string;
  weight?: 'light' | 'regular' | 'medium' | 'semibold' | 'bold';
}

const symbolPaths: Record<SFSymbolName, string> = {
  'doc.text': 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm4 18H6V4h7v5h5v11z M8 13h8 M8 17h8 M8 9h2',
  'doc.text.fill': 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm4 16H6V4h7v5h5v9z M8 13h8 M8 17h5',
  'person': 'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2 M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z',
  'person.fill': 'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2h16z M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z',
  'person.2': 'M17 21v-2a4 4 0 0 0-3-3.87 M9 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2 M13 7a4 4 0 1 0 0-8 4 4 0 0 0 0 8z M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z',
  'gear': 'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z',
  'magnifyingglass': 'M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16z M21 21l-4.35-4.35',
  'plus': 'M12 5v14 M5 12h14',
  'plus.circle': 'M22 12c0 5.523-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2s10 4.477 10 10z M12 8v8 M8 12h8',
  'plus.circle.fill': 'M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2z M12 8v8 M8 12h8',
  'checkmark': 'M20 6L9 17l-5-5',
  'checkmark.circle': 'M22 11.08V12a10 10 0 1 1-5.93-9.14 M22 4L12 14.01l-3-3',
  'checkmark.circle.fill': 'M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2z M16 9l-5 5-3-3',
  'xmark': 'M18 6L6 18 M6 6l12 12',
  'xmark.circle': 'M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z M15 9l-6 6 M9 9l6 6',
  'arrow.left': 'M19 12H5 M12 19l-7-7 7-7',
  'arrow.right': 'M5 12h14 M12 5l7 7-7 7',
  'chevron.left': 'M15 18l-6-6 6-6',
  'chevron.right': 'M9 18l6-6-6-6',
  'chevron.down': 'M6 9l6 6 6-6',
  'chevron.up': 'M18 15l-6-6-6 6',
  'ellipsis': 'M12 13a1 1 0 1 0 0-2 1 1 0 0 0 0 2z M19 13a1 1 0 1 0 0-2 1 1 0 0 0 0 2z M5 13a1 1 0 1 0 0-2 1 1 0 0 0 0 2z',
  'slider.horizontal.3': 'M4 21v-7 M4 10V3 M12 21v-9 M12 8V3 M20 21v-5 M20 12V3 M1 14h6 M9 8h6 M17 16h6',
  'line.3.horizontal': 'M3 12h18 M3 6h18 M3 18h18',
  'square.and.pencil': 'M17 3a2.83 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z',
  'trash': 'M3 6h18 M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2',
  'paperplane': 'M22 2L11 13 M22 2l-7 20-4-9-9-4 20-7z',
  'paperplane.fill': 'M22 2L11 13 M22 2l-7 20-4-9-9-4z',
  'clock': 'M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z M12 6v6l4 2',
  'folder': 'M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2v11z',
  'folder.fill': 'M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z',
  'tag': 'M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z M7 7h.01',
  'tag.fill': 'M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z',
  'bell': 'M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9 M13.73 21a2 2 0 0 1-3.46 0',
  'bell.fill': 'M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9z M13.73 21a2 2 0 0 1-3.46 0',
  'star': 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z',
  'star.fill': 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z',
  'square.and.arrow.up': 'M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4 M17 8l-5-5-5 5 M12 3v12',
  'eye': 'M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z',
  'eye.slash': 'M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24 M1 1l22 22',
  'envelope': 'M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z M22 6l-10 7L2 6',
  'the-lock': 'M19 11h-1V7a6 6 0 0 0-12 0v4H5c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-8c0-1.1-.9-2-2-2zm-7 5c-.6 0-1-.4-1-1s.4-1 1-1 1 .4 1 1-.4 1-1 1zm-2-5V7c0-1.1.9-2 2-2s2 .9 2 2v4h-4z',
  'square.grid': 'M10 3H3v7h7V3zM21 3h-7v7h7V3zM21 14h-7v7h7v-7zM10 14H3v7h7v-7z',
};

export const SFSymbol: React.FC<SFSymbolProps> = ({
  name,
  size = 20,
  className = '',
  weight = 'regular'
}) => {
  const strokeWidth = {
    light: 1.5,
    regular: 2,
    medium: 2.25,
    semibold: 2.5,
    bold: 3,
  }[weight];

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {symbolPaths[name].split(' M ').map((path, index) => (
        <path key={index} d={index === 0 ? path : `M ${path}`} />
      ))}
    </svg>
  );
};
