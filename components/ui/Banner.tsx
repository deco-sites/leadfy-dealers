import Image from "apps/website/components/Image.tsx";
import type { ImageWidget as LiveImage } from "apps/admin/widgets.ts";
import { Picture, Source } from "apps/website/components/Picture.tsx";

export interface Props {
  bannerDesktop: LiveImage;
  bannerMobile: LiveImage;
  alt: string;
}

export default function Banner({ bannerDesktop, bannerMobile, alt }: Props) {
  return (
    <div class="container pt-[96px] sm:pt-[112px]">
      <Picture preload={true}>
        <Source
          media="(max-width: 1024px)"
          fetchPriority={"high"}
          loading={"eager"}
          preload={true}
          src={bannerMobile}
          width={414}
          height={165}
        />
        <Source
          media="(min-width: 1025px)"
          fetchPriority={"high"}
          loading={"eager"}
          preload={true}
          src={bannerDesktop}
          width={1280}
          height={512}
        />
        <img
          class="w-full"
          loading={"eager"}
          src={bannerDesktop}
          alt={alt}
        />
      </Picture>
    </div>
  );
}
