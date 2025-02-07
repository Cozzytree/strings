import Canvas from "canvas/canvas"
import OptionLayout from "./option_layout"

import { Button } from "~/components/ui/button"
import { Slider } from "~/components/ui/slider"
import { useState } from "react"
import { BrushType } from "canvas/types"
import { BrushIcon, LucideIcon } from "lucide-react"
import { basicColors } from "canvas/config"
import { cn } from "~/lib/utils"
import { setStyle } from "node_modules/fabric/dist/src/util"
import ColorOptions from "./color_options"

type props = {
  fabricRef: React.MutableRefObject<Canvas | null>
}

const brushType: { b_type: BrushType, I: LucideIcon }[] = [
  {
    I: BrushIcon, b_type: "spray",
  },
  {
    I: BrushIcon, b_type: "pencil",
  },
  {
    I: BrushIcon, b_type: "circle",
  },
]

const DrawOptions = ({ fabricRef }: props) => {
  const [strokeSize, setStrokeSize] = useState(fabricRef.current ? fabricRef.current.brush_stroke_size : 0)
  const [strokeColor, setStrokeColor] = useState(
    fabricRef.current ? fabricRef.current.brush_stroke_color : ""
  )

  return (
    <div className="flex flex-col gap-1 bg-secondary px-2 rounded-md py-4">

      <OptionLayout label="Colors">
        <div className="flex gap-1">
          {basicColors.map((c) => (
            <Button
              variant={"outline"}
              size={"sm"}
              onClick={() => {
                if (!fabricRef.current) return;
                fabricRef.current.setBrushStroke(c)
              }}
              className={cn("rounded-sm")}
              key={c}
              style={{ background: c, width: "1.6em", height: "2.2em" }}
            />
          ))}
          <ColorOptions
            color={strokeColor}
            fn={(c) => {
              if (!fabricRef.current) return;
              fabricRef.current.setBrushStroke(c)
              setStrokeColor(c)
            }}
          />
        </div>
      </OptionLayout>

      <div className="w-full border border-foreground/10 my-2" />

      <OptionLayout label="Brush type">
        <div className="flex gap-1">
          {brushType.map((b) =>
            <Button onClick={() => {
              if (!fabricRef.current) return;
              fabricRef.current.setBrushType(b.b_type)
            }} className="bg-secondary" key={b.b_type} variant={"outline"} size="sm" >
              <b.I />
            </Button>
          )}
        </div>
      </OptionLayout >

      <div className="w-full border border-foreground/10 my-2" />

      <OptionLayout label="Stroke width">
        <Slider
          max={100}
          min={0}
          onValueChange={(e) => {
            if (isNaN(e[0]) || !fabricRef.current) return;
            fabricRef.current.setBrushWidth(e[0])
            setStrokeSize(e[0])
          }}
          defaultValue={[strokeSize]}
        />
      </OptionLayout>

    </div >)
}

export default DrawOptions
