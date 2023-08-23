import { useUI } from "deco-sites/leadfy-dealers/sdk/useUI.ts";

import Image from "deco-sites/std/components/Image.tsx";

export default function WhatsAppHeaderButton(
  { logo, alt }: { logo: string; alt: string },
) {
  const { displayWhatsAppModal, whatsAppModalInformation } = useUI();

  return (
    <>
      <button
        onClick={() => {
          whatsAppModalInformation.value.vehicle = "";
          displayWhatsAppModal.value = !displayWhatsAppModal.value;
        }}
      >
        <Image
          src={logo}
          width={40}
          height={40}
          alt={alt}
        />
      </button>
    </>
  );
}