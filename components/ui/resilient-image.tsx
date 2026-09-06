"use client";

import Image, { type ImageProps } from "next/image";
import { useState } from "react";

type Props = ImageProps & {
  fallbackSrc?: string;
};

const DEFAULT_FALLBACK = "/property-placeholder.svg";

export default function ResilientImage({
  fallbackSrc = DEFAULT_FALLBACK,
  src,
  alt,
  onError,
  ...props
}: Props) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return <Image {...props} src={fallbackSrc} alt={alt} />;
  }

  return (
    <Image
      {...props}
      src={src}
      alt={alt}
      onError={(event) => {
        setFailed(true);
        onError?.(event);
      }}
    />
  );
}
