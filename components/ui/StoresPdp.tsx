
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
  showPrice: boolean;
  showPriceText?: boolean;
  priceText?: string;
  vehicleDescription?: HTML;
  showVehicleOptional?: boolean;
  vehicleOptionalTitle?: string;
  /** @description Show WhatsApp Float Button */
  whatsFloatButton?: boolean;
  page: PdpReturn;
}

export default function StoresPdp(
  {
    page,
    whatsFloatButton = false,
    whatsNormalButton,
    showPriceText,
    priceText,
    vehicleDescription,
    showVehicleOptional,
    vehicleOptionalTitle,
  }: Props,
) {

  if (page) {
    console.log(page);
    const vehicle = page.result[0];
    const { storeDataFromApi, idLoja } = page;
    
    // Inicializa o array de imagens com a imagem principal
    const images:Array<string> = [...vehicle["g:image_link"]];
    // Checa se há imagens adicionais e as trata adequadamente
    if (vehicle["g:additional_image_link"] && vehicle["g:additional_image_link"][0]) {
      const additionalImagesStr = vehicle["g:additional_image_link"][0];
      // Verifica se há múltiplas imagens adicionais
      if (additionalImagesStr.includes(", ")) {
        // Divide as imagens adicionais e as adiciona ao array de imagens
        const additionalImages:Array<string> = additionalImagesStr.split(", ");
        additionalImages.forEach((image: string) => images.push(image));
      } else {
        // Caso contrário, adiciona a única imagem adicional ao array de imagens
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
          <div class="max-w-[1280px] py-[96px] sm:py-[112px] mx-auto flex flex-col sm:flex-row">
            <div
              class={`w-full sm:w-1/2 px-5 pt-5 sm:px-0 flex gap-3 sm:flex-wrap sm:pt-10 overflow-auto scrollbar-none ${
                vehicle["g:image_link"].length == 1 && "items-center"
              }`}
            >
              <GalleryProductPage
                images={images}
              />
              <div class="hidden sm:flex sm:flex-col">
                <VehicleOptional
                  vehicle={vehicle}
                  showVehicleOptional={showVehicleOptional}
                  vehicleOptionalTitle={vehicleOptionalTitle}
                  />
                <VehicleDescription
                  description={vehicleDescription}
                />
              </div>
            </div>

            <div class="w-full px-5 sm:px-0 sm:w-1/2 sm:max-w-[450px] mx-auto pt-6 top-0 self-start">
              <Form
                vehicle={vehicle}
                idLoja={idLoja}
                whatsNormalButton={whatsNormalButton}
                showPrice={showPrice}
                showPriceText={showPriceText}
                priceText={priceText}
              />

              <div class="flex flex-col mt-5 sm:hidden">
                <VehicleOptional
                  vehicle={vehicle}
                  showVehicleOptional={showVehicleOptional}
                  vehicleOptionalTitle={vehicleOptionalTitle}
                />
                
                <VehicleDescription
                  description={vehicleDescription}
                />
              </div>
            </div>
          </div>
        </div>
        {whatsFloatButton && <WhatsAppFloatButton />}
      </>
    );
  }

  return <h1>Product Not Found</h1>;
}

function GalleryProductPage({ images }: { images: string[] }) {
  const id = useId();

  return (
    <div
      id={id}
      class="grid grid-cols-[48px_1fr_48px] sm:grid-cols-[120px_1fr_120px] grid-rows-[1fr_48px_1fr_64px]"
    >
      <Slider class="carousel carousel-center w-full col-span-full row-span-full gap-2">
        {images?.map((image, index) => (
          <Slider.Item
            index={index}
            class="carousel-item w-full flex items-center"
          >
            <Image
              class="w-full h-max"
              src={image}
              width={550}
            />
          </Slider.Item>
        ))}
      </Slider>

      {images?.length! > 1 ? <Buttons /> : null}

      <Dots images={images} />

      <SliderJS rootId={id} infinite />
    </div>
  );
}

function Dots({ images }: { images: string[] }) {
  return (
    <>
      <ul class="carousel justify-center col-span-full gap-2 z-10 pt-5">
        {images?.map((image, index) => (
          <li class="carousel-item">
            <Slider.Dot index={index}>
              <div class="w-14 h-12 py-5 border-[1px] border-black flex justify-center items-center opacity-40 group-disabled:opacity-100">
                <Image
                  class="w-[40px] h-max"
                  src={image}
                  width={80}
                />
              </div>
            </Slider.Dot>
          </li>
        ))}
      </ul>
    </>
  );
}

function Buttons() {
  return (
    <>
      <div class="flex items-center justify-center z-10 col-start-1 row-start-2">
        <Slider.PrevButton>
          <Icon
            class="text-white"
            size={26}
            id="ChevronLeft"
            strokeWidth={5}
          />
        </Slider.PrevButton>
      </div>
      <div class="flex items-center justify-center z-10 col-start-3 row-start-2">
        <Slider.NextButton>
          <Icon
            class="text-white"
            size={26}
            id="ChevronRight"
            strokeWidth={5}
          />
        </Slider.NextButton>
      </div>
    </>
  );
}

