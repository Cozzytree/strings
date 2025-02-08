import { useActiveObject } from "canvas/store/active_obj";
import OptionLayout from "./option_layout";

import {
   AlignCenter,
   AlignLeft,
   AlignRight,
   CaseUpper,
   Code,
   LucideIcon,
   Pencil,
} from "lucide-react";
import { Button } from "~/components/ui/button";
import { useState } from "react";

type props = {
   handleFontSize: (v: number) => void;
   handleFontFamily: (v: string) => void;
   handleTextAlign: (v: "left" | "center" | "right") => void;
};

const fontFamily = [
   { family: "'Caveat', serif", I: Pencil },
   { family: "Arial", I: CaseUpper },
   { family: "Jetbrains Mono", I: Code },
];

const fontSizes = [
   { size: 10, label: "S" },
   { size: 15, label: "M" },
   { size: 20, label: "L" },
   { size: 25, label: "XL" },
];

const aligns: { allign: "left" | "center" | "right"; I: LucideIcon }[] = [
   { allign: "left", I: AlignLeft },
   { allign: "center", I: AlignCenter },
   { allign: "right", I: AlignRight },
];

const TextOption = ({
   handleFontFamily,
   handleFontSize,
   handleTextAlign,
}: props) => {
   const { obj } = useActiveObject();
   const [allign, setAlign] = useState(obj[0].get("textAlign"));
   const [fsize, setSize] = useState(obj[0].get("fontSize"));

   return (
      <>
         <OptionLayout label="Font family">
            <div className="flex gap-1">
               {fontFamily.map((f) => (
                  <Button
                     onClick={() => {
                        handleFontFamily(f.family);
                     }}
                     className="bg-foreground/5"
                     variant={"outline"}
                     size={"sm"}
                     key={f.family}
                  >
                     <f.I className="w-[1em] h-[1em]" />
                  </Button>
               ))}
            </div>
         </OptionLayout>

         <div className="w-ful border border-foreground/10 my-2" />

         <OptionLayout label="Font size">
            <div className="flex gap-1">
               {fontSizes.map((f) => (
                  <Button
                     onClick={() => {
                        handleFontSize(f.size);
                        setSize(f.size);
                     }}
                     style={{ width: "2.4em", height: "2em" }}
                     className={`${fsize === f.size
                        ? "bg-foreground/20 border border-foreground/20"
                        : "bg-foreground/5"
                        } rounded-sm`}
                     variant={"outline"}
                     size={"sm"}
                     key={f.size}
                  >
                     {f.label}
                  </Button>
               ))}
            </div>
         </OptionLayout>

         <div className="w-ful border border-foreground/10 my-2" />
         <OptionLayout label="Text Align">
            <div className="w-full flex gap-1">
               {aligns.map((f) => (
                  <Button
                     onClick={() => {
                        handleTextAlign(f.allign);
                        setAlign(f.allign);
                     }}
                     style={{
                        width: "2.1rem",
                        height: "1.8rem"
                     }}
                     className={`${allign === f.allign
                        ? "bg-foreground/20 border border-foreground/20"
                        : "bg-foreground/5"
                        }`}
                     variant={"outline"}
                     size={"sm"}
                     key={f.allign}
                  >
                     <f.I />
                  </Button>
               ))}
            </div>
         </OptionLayout>
      </>
   );
};

export default TextOption;
