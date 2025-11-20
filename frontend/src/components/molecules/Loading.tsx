import React from "react";

import { FiLoader } from "react-icons/fi";

interface SpinnerLoaderProps {
  size?: number; // icon size in pixels
  message?: string | null;
  fullScreen?: boolean; // center in full viewport when true
}

export default function Loading({
  size = 40,
  message = null,
  fullScreen = true,
}: SpinnerLoaderProps) {
  return (
    <div
      className={
        fullScreen
          ? "flex items-center justify-center h-screen"
          : "flex items-center justify-center"
      }
      role="status"
      aria-live="polite"
    >
      <div className="flex flex-col items-center gap-2">
        <FiLoader
          size={size}
          className={`animate-spin w-${Math.round(size / 4)} h-${Math.round(
            size / 4
          )} text-gray-700`}
          aria-hidden="true"
        />
        {message && (
          <span className="text-sm text-gray-600" aria-hidden="true">
            {message}
          </span>
        )}
      </div>
    </div>
  );
}

/* Usage examples:

// Full-screen centered spinner (default)
<SpinnerLoader message="Loading..." />

// Small inline spinner
<SpinnerLoader size={20} fullScreen={false} />

Notes:
- This component uses Tailwind classes for layout and the `react-icons` package
  (FiLoader from react-icons/fi). If you don't use Tailwind, replace the
  utility classes with your preferred CSS.
- The icon uses `animate-spin` for rotation (Tailwind). If you don't have
  Tailwind, add this CSS:

@keyframes spin { to { transform: rotate(360deg); }}
.spinner { animation: spin 1s linear infinite; }

and change `className` on the icon accordingly.
*/
