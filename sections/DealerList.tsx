import { Section } from "$live/blocks/section.ts";
import { notUndefined } from "$live/engine/core/utils.ts";
import { renderSection } from "apps/website/pages/Page.tsx";

export interface Props {
  sections: Section[];
}

export default function DealerList({ sections }: Props) {

  return (
    <>
      {(sections ?? []).filter(notUndefined).map(renderSection)}
    </>
  );
}
