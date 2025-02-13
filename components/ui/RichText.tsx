import type { HTMLWidget } from "apps/admin/widgets.ts";
import Quilltext from "deco-sites/std/components/QuillText.tsx";

export interface Props {
  content: HTMLWidget[];
}

export default function RichText({ content }: Props) {
  return (
    <div class="container text-center mt-8">
      <div>
        {content.map((content) => {
          return <Quilltext html={content} />;
        })}
      </div>
    </div>
  );
}
