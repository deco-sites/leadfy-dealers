import type { Vehicle } from "deco-sites/leadfy-dealers/components/types.ts";

import { normalizePhoneNumber } from "deco-sites/leadfy-dealers/sdk/mask.ts";

import { useSignal } from "@preact/signals";

import { formatPrice } from "deco-sites/leadfy-dealers/sdk/format.ts";

import WhatsAppNormalButton from "deco-sites/leadfy-dealers/components/ui/WhatsAppNormalButton.tsx";

import type { WhatsNormalButton } from "deco-sites/leadfy-dealers/components/ui/StoresPdp.tsx";

export default function Form(
  { vehicle, idLoja, phone, whatsNormalButton, showPriceText, priceText }: {
    vehicle: Vehicle;
    idLoja: string;
    phone?: string;
    whatsNormalButton: WhatsNormalButton;
    showPriceText?: boolean;
    priceText?: string;
  },
) {
  const nome = useSignal("");
  const telefone = useSignal("");
  const email = useSignal("");
  const buttonText = useSignal("Tenho interesse");
  const buttonDisabled = useSignal(false);

  function clearFields() {
    nome.value = "";
    telefone.value = "";
    email.value = "";
  }

  function saveLead() {
    if (telefone.value.length < 15) {
      alert("Insira um telefone válido");
      return null
    }

    buttonText.value = "Enviando...";
    const data = {
      "records": [
        {
          "fields": {
            "Nome": nome.value,
            "Telefone": telefone.value,
            "Email": email.value,
            "Carro": vehicle["g:title"][0],
          },
        },
      ],
    };

    const options = {
      "method": "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    };

    fetch(`/api/airtable?idLoja=${idLoja}`, options)
      .then((response) => {
        if (response.status == 200) {
          buttonText.value = "Enviado!";
          buttonDisabled.value = true;
          clearFields();
          setTimeout(() => {
            buttonText.value = "Tenho interesse";
            buttonDisabled.value = false;
          }, 2000);
        }
      });
  }

  return (
    <div>
      <h1 class="text-[34px] text-primary louis-bold">
        {vehicle["g:title"][0].toUpperCase()}
      </h1>
      <div>
        <p
          class="text-[20px]"
          dangerouslySetInnerHTML={{ __html: vehicle["g:description"][0] }}
        >
        </p>
      </div>
      <div class="flex flex-col py-2">
        {showPriceText && (
          <span class="w-[150px] font-semibold">{priceText}</span>
        )}
        <span class="text-[32px] font-bold text-secondary">
          {formatPrice(Number(vehicle["g:price"][0]))}
        </span>
      </div>

      <form
        action=""
        class="py-4 flex flex-col gap-4"
        onSubmit={(e) => {
          saveLead();
          e.preventDefault();
        }}
      >
        <Input
          label={"Nome"}
          placeholder={"Seu Nome aqui"}
          value={nome.value}
          changeState={(value) => {
            nome.value = value;
          }}
        />
        <div class="flex flex-col gap-2">
          <label for="telefone" class="text-[14px] uppercase tracking-[1px]">
            Telefone
          </label>
          <input
            type="tel"
            value={telefone.value}
            name="telefone"
            id="telefone"
            placeholder="Seu Telefone aqui"
            minLength={15}
            maxLength={15}
            required
            onChange={(e) => {
              telefone.value = normalizePhoneNumber((e.target as HTMLInputElement).value);
              (e.target as HTMLInputElement).value = telefone.value
            }}
            class="border-[1px] border-[#cccccc] py-2 px-3 focus-visible:border-[#3898ec] focus-visible:outline-none"
          />
        </div>

        <label>
  E-mail
</label>
<input
  type="email"
  value={email.value}
  name="email"
  id="email"
  placeholder="Seu E-mail aqui"
  required
  onChange={(e) => {
    email.value = normalizeEmail((e.target as HTMLInputElement).value); // Normaliza o e-mail
    (e.target as HTMLInputElement).value = email.value; // Atualiza o valor do input
    email.isValid = validateEmail(email.value); // Valida o e-mail
  }}
  class="border-[1px] border-[#cccccc] py-2 px-3 focus-visible:border-[#3898ec] focus-visible:outline-none"
/>

{!email.isValid && email.value !== "" && (
  <span style={{ color: "red", fontSize: "0.875rem" }}>E-mail inválido</span>
)}

        <button
          class="btn bg-accent text-base-200 tracking-[3px] w-full py-2.5 flex justify-center items-center font-bold whitespace-nowrap"
          disabled={buttonDisabled.value}
        >
          {buttonText.value}
        </button>
      </form>
      <WhatsAppNormalButton
        text={whatsNormalButton.textWhatsButton}
        image={whatsNormalButton.whatsImage}
        vehicle={vehicle["g:title"][0].toUpperCase()}
      />
    </div>
  );
}

function Input(
  { label, placeholder, value, changeState }: {
    label: string;
    value: string;
    placeholder: string;
    changeState(value: string): void;
  },
) {
  return (
    <div class="flex flex-col gap-2">
      <label htmlFor={label} class="text-[14px] uppercase tracking-[1px]">
        {label}
      </label>
      <input
        type="text"
        value={value}
        name={label}
        id={label}
        placeholder={placeholder}
        required={true}
        onChange={(e) => {
          changeState((e.target as HTMLInputElement)?.value);
        }}
        class="border-[1px] border-[#cccccc] py-2 px-3 focus-visible:border-[#3898ec] focus-visible:outline-none"
      />
    </div>
  );
}
