import { clearWhatsApp } from "deco-sites/leadfy-dealers/sdk/format.ts";
import { asset } from "$fresh/runtime.ts";
import { normalizePhoneNumber } from "deco-sites/leadfy-dealers/sdk/mask.ts";

import { useSignal } from "@preact/signals";
import { useUI } from "deco-sites/leadfy-dealers/sdk/useUI.ts";

import Image from "apps/website/components/Image.tsx";
import type { ImageWidget as LiveImage } from "apps/admin/widgets.ts";
import { useRef } from "preact/hooks";

export default function WhatsAppModal(
  { phone, logo, idLoja }: {
    phone: string;
    logo: LiveImage;
    idLoja: string;
  },
) {
  const {
    displayWhatsAppModal,
    whatsAppModalInformation,
    whatsAppModalPosition,
  } = useUI();

  const nome = useSignal("");
  const telefone = useSignal("");

  const loading = useSignal(false);

  const isMouseDown = useSignal(false);
  const initX = useSignal(0);
  const initY = useSignal(0);

  const ref = useRef<HTMLDivElement>(null);

  function saveLead() {
    if (telefone.value.length < 15) {
      alert("Insira um telefone válido");
      loading.value =  false;
      return null
    }

    const data = {
      "records": [
        {
          "fields": {
            "Nome": nome.value,
            "Telefone": telefone.value,
            "Carro": whatsAppModalInformation.value.vehicle || "",
            "Email": telefone.value + "@leadfy.me",
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
          window.open(
            `https://api.whatsapp.com/send?text=Olá meu nome é ${nome.value}, gostaria de mais informações sobre as ofertas imperdíveis! Esses são os meus contatos:%0D%0A Telefone: ${telefone.value}&phone=${
              clearWhatsApp(phone)
            }`,
            "_blank",
          );
        }
        loading.value = false;
      });
  }

  return (
    <>
      <div>
        <div
          id="draggable"
          ref={ref}
          class={`form-wpp flex flex-col fixed z-50 max-[720px]:modal-whatsapp-mobile  w-[350px] h-[350px] shadow rounded ${
            displayWhatsAppModal.value ? "block" : "hidden"
          }`}
          style={{
            left: whatsAppModalPosition.value.left,
            top: whatsAppModalPosition.value.top,
          }}
        >
          <div
            class="head-wpp bg-[#0c6156] flex items-center justify-between p-4 cursor-move"
            onMouseDown={(e) => {
              isMouseDown.value = true;
              document.body.style.userSelect = "none";
              initX.value = e.offsetX;
              initY.value = e.offsetY;
            }}
            onMouseMove={(e) => {
              if (isMouseDown.value) {
                let cx = e.clientX - initX.value,
                  cy = e.clientY - initY.value;
                if (cx < 0) {
                  cx = 0;
                }
                if (cy < 0) {
                  cy = 0;
                }
                if (window.innerWidth - e.clientX + initX.value < 350) {
                  cx = window.innerWidth - 350;
                }
                if (e.clientY > window.innerHeight - 350 + initY.value) {
                  cy = window.innerHeight - 350;
                }
                ref.current!.style.left = cx + "px";
                ref.current!.style.top = cy + "px";
              }
            }}
            onMouseUp={() => {
              isMouseDown.value = false;
              document.body.style.userSelect = "auto";
            }}
          >
            <div class="flex gap-2 items-center pointer-events-none">
              <Image
                src={logo}
                width={50}
                alt="Imagem perfil"
                class="rounded-full"
              />
              <h3 class="text-white font-semibold">Chame no WhatsApp</h3>
            </div>

            <button
              type="button"
              class="cursor-pointer"
              onClick={() => {
                displayWhatsAppModal.value = false;
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="white"
                height="16px"
                width="16px"
                version="1.1"
                id="Capa_1"
                viewBox="0 0 460.775 460.775"
              >
                <path d="M285.08,230.397L456.218,59.27c6.076-6.077,6.076-15.911,0-21.986L423.511,4.565c-2.913-2.911-6.866-4.55-10.992-4.55  c-4.127,0-8.08,1.639-10.993,4.55l-171.138,171.14L59.25,4.565c-2.913-2.911-6.866-4.55-10.993-4.55  c-4.126,0-8.08,1.639-10.992,4.55L4.558,37.284c-6.077,6.075-6.077,15.909,0,21.986l171.138,171.128L4.575,401.505  c-6.074,6.077-6.074,15.911,0,21.986l32.709,32.719c2.911,2.911,6.865,4.55,10.992,4.55c4.127,0,8.08-1.639,10.994-4.55  l171.117-171.12l171.118,171.12c2.913,2.911,6.866,4.55,10.993,4.55c4.128,0,8.081-1.639,10.992-4.55l32.709-32.719  c6.074-6.075,6.074-15.909,0-21.986L285.08,230.397z" />
              </svg>
            </button>
          </div>

          <div
            class="form-content bg-[#e9e0d7] bg-center bg-cover flex flex-col gap-2 p-4 rounded h-full"
            style="background-image: url(https://decoims.com/leadfy-dealers/0b2d6c49-4a87-4374-bf6d-45a126fcaa4a/442cc4ad_442cc4adefd9dda954d0316c962df546.png)"
          >
            <p class="buss-msg bg-[white] w-5/6 p-2 rounded text-base relative">
              Olá, quer saber mais sobres nossas ofertas exclusivas? Me informe
              seus dados, por favor.
            </p>

            <form
              action="/"
              method="post"
              id="wpp-form"
              class="flex flex-col gap-2 items-end"
              onSubmit={(e) => {
                loading.value = true;
                saveLead();
                e.preventDefault();
              }}
            >
              <div class="campo w-5/6">
                <label for="nome" class="hidden">Nome</label>
                <span class="form-control-wrap">
                  <input
                    type="text"
                    name="nome"
                    aria-required="true"
                    placeholder="Nome"
                    required
                    class="w-full rounded-tl rounded-bl px-4 py-2 bg-[#e7ffe7] border border-[#e7ffe7] text-base"
                    value={nome.value}
                    onChange={(e) =>
                      nome.value = (e.target as HTMLInputElement)?.value}
                  />
                </span>
              </div>
              <div class="campo w-5/6">
                <label for="telefone" class="hidden">Telefone</label>
                <span class="form-control-wrap">
                  <input
                    type="text"
                    name="telefone"
                    id="telefone"
                    aria-required="true"
                    placeholder="Telefone"
                    minLength={15}
                    maxLength={15}
                    title="Insira um telefone válido com DDD"
                    required
                    class="w-full px-4 py-2 bg-[#e7ffe7] border border-[#e7ffe7] text-base"
                    value={telefone.value}
                    onChange={(e) => {
                      telefone.value = normalizePhoneNumber((e.target as HTMLInputElement).value);
                      (e.target as HTMLInputElement).value = telefone.value
                    }}
                  />
                </span>
              </div>
              <div class="">
                <button
                  type="submit"
                  disabled={loading.value}
                  class="transition-all bg-[#0c6156] border border-[#0c6156] text-white font-semibold rounded px-6 py-3"
                >
                  {loading.value
                    ? <div>Aguarde...</div>
                    : (
                      <div class="flex items-center gap-2">
                        Iniciar conversa
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="white"
                          height="16px"
                          width="16px"
                          version="1.1"
                          id="Layer_1"
                          viewBox="0 0 512.001 512.001"
                        >
                          <g>
                            <g>
                              <path d="M483.927,212.664L66.967,25.834C30.95,9.695-7.905,42.023,1.398,80.368l21.593,89.001    c3.063,12.622,11.283,23.562,22.554,30.014l83.685,47.915c6.723,3.85,6.738,13.546,0,17.405l-83.684,47.915    c-11.271,6.452-19.491,17.393-22.554,30.015l-21.594,89c-9.283,38.257,29.506,70.691,65.569,54.534l416.961-186.83    C521.383,282.554,521.333,229.424,483.927,212.664z M359.268,273.093l-147.519,66.1c-9.44,4.228-20.521,0.009-24.752-9.435    c-4.231-9.44-0.006-20.523,9.434-24.752l109.37-49.006l-109.37-49.006c-9.44-4.231-13.665-15.313-9.434-24.752    c4.229-9.44,15.309-13.666,24.752-9.435l147.519,66.101C373.996,245.505,374.007,266.49,359.268,273.093z" />
                            </g>
                          </g>
                        </svg>
                      </div>
                    )}
                </button>
              </div>
            </form>
          </div>
        </div>
        <div class="mask transition-all"></div>
      </div>
    </>
  );
}
