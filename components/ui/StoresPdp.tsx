import { useState } from "preact/hooks";
import type { LoaderReturnType } from "$live/types.ts";
import type { HTML } from "deco-sites/std/components/types.ts";
import type { PdpReturn } from "deco-sites/leadfy-dealers/components/types.ts";
import type { ImageWidget as LiveImage } from "apps/admin/widgets.ts";
import Form from "deco-sites/leadfy-dealers/islands/Form.tsx";
import WhatsAppFloatButton from "deco-sites/leadfy-dealers/islands/WhatsAppFloatButton.tsx";
import VehicleDescription from "deco-sites/leadfy-dealers/components/ui/vdp/VehicleDescription.tsx";
import VehicleOptional from "deco-sites/leadfy-dealers/components/ui/vdp/VehicleOptional.tsx";
import Image from "apps/website/components/Image.tsx";
import { Head } from "$fresh/runtime.ts";
import Icon from "deco-sites/leadfy-dealers/components/ui/Icon.tsx";
import Slider from "deco-sites/leadfy-dealers/components/ui/Slider.tsx";
import SliderJS from "deco-sites/leadfy-dealers/islands/SliderJS.tsx";
import { useId } from "deco-sites/leadfy-dealers/sdk/useId.ts";

export interface WhatsNormalButton {
  textWhatsButton: string;
  whatsImage?: LiveImage;
}

export interface Props {
  whatsNormalButton: WhatsNormalButton;
  showPriceText?: boolean;
  priceText?: string;
  showPrice?: boolean;
  vehicleDescription?: HTML;
  showVehicleOptional?: boolean;
  vehicleOptionalTitle?: string;
  /** @description Show WhatsApp Float Button */
  whatsFloatButton?: boolean;
  page: PdpReturn;
}

export default function StoresPdp({ ...props }: Props) {
  const [showPrice, setShowPrice] = useState(true);

  if (props.page) {
    const vehicle = props.page.result[0];
    const { storeDataFromApi, idLoja } = props.page;
    
    const images:Array<string> = [...vehicle["g:image_link"]];
    if (vehicle["g:additional_image_link"] && vehicle["g:additional_image_link"][0]) {
      const additionalImagesStr = vehicle["g:additional_image_link"][0];
      if (additionalImagesStr.includes(", ")) {
        const additionalImages:Array<string> = additionalImagesStr.split(", ");
        additionalImages.forEach((image: string) => images.push(image));
      } else {
        images.push(additionalImagesStr);
      }
    }
    
    return (
      <>
        <Head>
          <title>{vehicle["g:title"][0]}</title>
          <link rel="icon" type="image/png" href={storeDataFromApi.logo}></link>
        </Head>
        <div>
          {/* Menu com opção de mostrar/esconder preço */}
          <div class="flex justify-end p-4">
            <label class="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={showPrice}
                onChange={() => setShowPrice(!showPrice)}
                class="w-4 h-4"
              />
              <span>Mostrar Preço</span>
            </label>
          </div>

          <div class="max-w-[1280px] py-[96px] sm:py-[112px] mx-auto flex flex-col sm:flex-row">
            <div class="w-full sm:w-1/2 px-5 pt-5 sm:px-0 flex gap-3 sm:flex-wrap sm:pt-10 overflow-auto scrollbar-none">
              <GalleryProductPage images={images} />
            </div>

            <div class="w-full px-5 sm:px-0 sm:w-1/2 sm:max-w-[450px] mx-auto pt-6 top-0 self-start">
              <Form
                vehicle={vehicle}
                idLoja={idLoja}
                whatsNormalButton={props.whatsNormalButton}
                showPriceText={props.showPriceText}
                priceText={props.priceText}
                showPrice={showPrice}
              />
            </div>
          </div>
        </div>
        {props.whatsFloatButton && <WhatsAppFloatButton />}
      </>
    );
  }

  return <h1>Product Not Found</h1>;
}
