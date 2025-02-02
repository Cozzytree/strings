import { Theme, useTheme } from "remix-themes";
import OptionLayout from "./option_layout";
import { Button } from "~/components/ui/button";
import { useCanvasStore } from "canvas/store/canvas_config_store";

const darkColors = ["#302828", "#252020", "#202020", "#101010"];
const lightColors = ["#909090", "#aaaaaa", "#bbbbbb", "#efefef"];

const CanvasBackground = () => {
  const [theme] = useTheme();
  const { handleBackgroundColor } = useCanvasStore();

  return (
    <OptionLayout weight={500} label="Canvas background">
      <div className="flex gap-1">
        {theme === Theme.DARK && (
          <>
            {darkColors.map((d) => (
              <Button
                className="w-7 h-7 rounded-sm"
                variant={"outline"}
                size={"sm"}
                onClick={() => {
                  handleBackgroundColor(d);
                }}
                key={d}
                style={{ background: d }}
              />
            ))}
          </>
        )}
        {theme === Theme.LIGHT && (
          <>
            {lightColors.map((d) => (
              <Button
                className="w-7 h-7 rounded-sm"
                variant={"outline"}
                size={"sm"}
                onClick={() => {
                  handleBackgroundColor(d);
                }}
                key={d}
                style={{ background: d }}
              />
            ))}
          </>
        )}
      </div>
    </OptionLayout>
  );
};

export default CanvasBackground;
