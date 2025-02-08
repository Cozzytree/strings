import { basicColors } from "canvas/config";
import { useActiveObject } from "canvas/store/active_obj";
import ColorOptions from "./color_options";
import { useState } from "react";
import OptionLayout from "./option_layout";

type props = {
   handleColor: (v: string) => void;
};

const colors = basicColors.map((c) => c + "50");

const BackgroundOption = ({ handleColor }: props) => {
   const { obj } = useActiveObject();
   const [background, setBackground] = useState(
      obj.length === 1 ? obj[0].get("fill") : ""
   )

   return (
      <OptionLayout label="Background">
         <div className="flex w-full justify-between">
            <div className="flex gap-1">
               {colors.map((c) => (
                  <button
                     onClick={() => {
                        handleColor(c);
                     }}
                     key={c}
                     style={{ background: c, width: "1.4em", height: "1.4em" }}
                     className="cursor-pointer rounded-sm border border-foreground/20"
                  />
               ))}
            </div>
            <ColorOptions
               fn={(v) => {
                  handleColor(v);
                  setBackground(v)
               }}
               color={background}
            />
         </div>
      </OptionLayout>
   );
};

export default BackgroundOption;
