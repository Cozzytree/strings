import { Slider } from "~/components/ui/slider";
import OptionLayout from "./option_layout";
import { useActiveObject } from "canvas/store/active_obj";
import { useState } from "react";

type props = {
  handleOpacity: (v: number) => void;
};

const OpacityOption = ({ handleOpacity }: props) => {
  const { obj } = useActiveObject();
  const opacity = obj.length === 1 ? obj[0].get("opacity") : null;

  return (
    <>
      {opacity !== null && (
        <OptionLayout label="Opacity">
          <div className="w-full">
            <Slider
              max={100}
              min={0}
              onValueChange={(e) => {
                if (isNaN(e[0])) return;
                handleOpacity(e[0] / 100);
              }}
              defaultValue={[opacity * 100]}
            />
          </div>
        </OptionLayout>
      )}
    </>
  );
};

export default OpacityOption;
