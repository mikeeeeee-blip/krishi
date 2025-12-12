/**
 * Custom image loader for Next.js Image component
 * This loader bypasses Next.js optimization for CloudFront images to avoid 403 errors
 */
export default function imageLoader({ src, width, quality }: { src: string; width: number; quality?: number }) {
  // If the image is from CloudFront or agribegri.com, return it as-is (unoptimized)
  // This prevents 403 errors when Next.js tries to optimize these images
  if (src.includes('cloudfront.net') || src.includes('agribegri.com')) {
    return src;
  }
  
  // For local images, use Next.js default optimization path
  // Local images starting with / are handled by Next.js default loader
  if (src.startsWith('/')) {
    return `/_next/image?url=${encodeURIComponent(src)}&w=${width}&q=${quality || 75}`;
  }
  
  // For other external images, return as-is
  return src;
}

