interface BrandLogoProps {
  size?: number;
  className?: string;
}

export default function BrandLogo({ size = 64, className }: BrandLogoProps) {
  return (
    <img
      src={`${import.meta.env.BASE_URL}image.png`}
      alt="K.Gaureeha Food Industry Logo"
      width={size}
      height={size}
      className={className}
      style={{ width: size, height: size, objectFit: 'contain' }}
    />
  );
}
