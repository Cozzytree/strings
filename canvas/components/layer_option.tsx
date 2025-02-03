import { Button } from "~/components/ui/button";
import OptionLayout from "./option_layout"
import { ArrowDown, ArrowDownToLine, ArrowUp, ArrowUpToLine } from "lucide-react";
import { useActiveObject } from "canvas/store/active_obj";

type props = {
  handleIndex: (v: "up" | "down" | "front" | "back") => void;
}

const LayerOption = ({ handleIndex }: props) => {
  const { obj } = useActiveObject()
  return (
    <OptionLayout label="Layer">
      <div className="flex gap-1 flex-wrap">
        <Button className="bg-foreground/5" variant={"outline"} size={"sm"} onClick={() => {
          handleIndex("front")
        }}>
          <ArrowUpToLine />
        </Button>
        <Button className="bg-foreground/5" variant={"outline"} size={"sm"} onClick={() => {
          handleIndex("up")
        }}>
          <ArrowUp />
        </Button>
        <Button className="bg-foreground/5" variant={"outline"} size={"sm"} onClick={() => {
          handleIndex("down")
        }}>
          <ArrowDown />
        </Button>
        <Button className="bg-foreground/5" variant={"outline"} size={"sm"} onClick={() => {
          handleIndex("back")
        }}>
          <ArrowDownToLine />
        </Button>
      </div>
    </OptionLayout>
  )
}

export default LayerOption
