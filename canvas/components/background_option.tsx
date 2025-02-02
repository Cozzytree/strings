import { basicColors } from "canvas/config";
import { useActiveObject } from "canvas/store/active_obj";
import ColorOptions from "./color_options";

type props = {
  handleColor: (v: string) => void;
};

const colors = basicColors.map((c) => c + "50");

const BackgroundOption = ({ handleColor }: props) => {
  const { obj } = useActiveObject();
  const background = obj.length === 1 ? obj[0].get("fill") : "";
  console.log(background);

  return (
    <div className="flex flex-col gap-2 px-2">
      <h6 className="text-sm font-bold">Background</h6>
      <div className="flex justify-between">
        <div className="flex gap-1">
          {colors.map((c) => (
            <button
              onClick={() => {
                handleColor(c);
              }}
              key={c}
              style={{ background: c, width: "1.6em", height: "1.6em" }}
              className="cursor-pointer rounded-sm border border-foreground/20"
            />
          ))}
        </div>
        <ColorOptions
          fn={(v) => {
            handleColor(v);
          }}
          color={background}
        />
      </div>
    </div>
  );
};

export default BackgroundOption;
