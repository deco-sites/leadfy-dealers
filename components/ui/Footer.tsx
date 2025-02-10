import type { HTMLWidget } from "apps/admin/widgets.ts";
import Quilltext from "deco-sites/std/components/QuillText.tsx";

import Icon from "deco-sites/leadfy-dealers/components/ui/Icon.tsx";
import Slider from "deco-sites/leadfy-dealers/components/ui/Slider.tsx";
import SliderJS from "deco-sites/leadfy-dealers/islands/SliderJS.tsx";
import { Picture, Source } from "apps/website/components/Picture.tsx";
import { useId } from "deco-sites/leadfy-dealers/sdk/useId.ts";
import type { ImageWidget as LiveImage } from "apps/admin/widgets.ts";

import { clearWhatsApp } from "deco-sites/leadfy-dealers/sdk/format.ts";

export interface Store {
  content: HTMLWidget;
  labelPhone?: string;
  phoneNumber?: string;
}

export interface Props {
  stores: Store[];
  interval?: 0;
}

export default function Footer({ stores, interval }: Props) {
  const id = useId();
  return (
    <div class="w-full bg-base-300 text-white">
      <div
        id={id}
        class="relative grid grid-cols-[48px_1fr_48px] sm:grid-cols-[120px_1fr_120px] grid-rows-[1fr_48px_1fr_64px] py-12 max-w-[1280px] mx-auto"
      >
        <Slider
          class={`carousel carousel-center w-full col-span-full row-span-full ${
            stores.length < 5 ? "sm:justify-center" : ""
          }`}
        >
          {stores?.map((store, index) => (
            <Slider.Item
              index={index}
              class="carousel-item justify-center w-full sm:w-[256px]"
            >
              <div class="flex flex-col gap-4">
                <div>
                  <Quilltext html={store.content} />
                </div>
                <div>
                  <a
                    href={`tel:${clearWhatsApp(store.phoneNumber || "")}`}
                    class="text-white"
                  >
                    {store.labelPhone + " "}
                    <span class="underline">{store.phoneNumber}</span>
                  </a>
                </div>
              </div>
            </Slider.Item>
          ))}
        </Slider>

        <div class={`block ${stores.length <= 5 ? "sm:hidden" : ""}`}>
          <Buttons />
        </div>
        <SliderJS rootId={id} interval={interval && interval * 1e3} infinite />
      </div>
      <div class="flex justify-between max-w-[1280px] mx-auto py-4 border-t-[1px] border-white px-5">
        <span class="text-[14px] font-bold">
          © 2k25 Todos os Direitos Reservados
        </span>
      </div>
    </div>
  );
}

function Buttons() {
  return (
    <>
      <div class="flex items-center justify-center z-10 absolute left-4 sm:left-[-16px] top-1/2">
        <Slider.PrevButton>
          <Icon
            class="text-base-200"
            size={16}
            id="ChevronLeft"
            strokeWidth={2}
          />
        </Slider.PrevButton>
      </div>
      <div class="flex items-center justify-center z-10 absolute right-4 sm:right-[-16px] top-1/2">
        <Slider.NextButton>
          <Icon
            class="text-base-200"
            size={16}
            id="ChevronRight"
            strokeWidth={2}
          />
        </Slider.NextButton>
      </div>
    </>
  );
}
