import {
  Folder,
  Image,
  ImportIcon,
  MenuIcon,
  MoonIcon,
  SunIcon,
} from "lucide-react";
import { Theme, useTheme } from "remix-themes";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import CanvasBackground from "./canvasBackground";
import { useEffect, useState } from "react";

type props = {
  handleToImage: () => void;
  handleToJson: () => void;
  handleImportfromFile: (s: string) => void;
}

const CanvasMenu = ({ handleToImage, handleToJson, handleImportfromFile }: props) => {
  const [theme, setTheme] = useTheme();
  const [file, setFile] = useState<File | null>(null)

  useEffect(() => {
    if (!file) return;
    file.text().then((d) => {
      handleImportfromFile(d)
    })
  }, [file])

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <MenuIcon />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[200px] z-[999999] py-1">
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            Current Page
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent sideOffset={10}>
            Pages
          </DropdownMenuSubContent>
        </DropdownMenuSub>
        <div className="px-2">
          <label className="flex items-center gap-2" htmlFor="file-input">
            <ImportIcon className="w-4 h-4" /> Import from file
          </label>
          <input
            id="file-input"
            className="hidden"
            type="file"
            onChange={(e) => {
              if (!e.target.files) return
              setFile(e.target.files[0])
            }}
          />
        </div>
        <DropdownMenuItem onClick={handleToJson}>
          <Folder /> Save as
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleToImage}>
          <Image /> Export image
        </DropdownMenuItem>
        {/* {menus.map((m, i) => (
          <DropdownMenuItem key={i}>
            <m.I /> {m.label}
          </DropdownMenuItem>
        ))} */}
        <DropdownMenuSeparator />
        <div className="w-full flex items-center justify-between">
          <span>Theme</span>
          <div className="flex items-center">
            <Button
              onClick={() => {
                setTheme(Theme.LIGHT);
              }}
              className={`${theme === "light" && "bg-accent"}`}
              size={"sm"}
              variant={"outline"}
            >
              <SunIcon className={`w-5 h-5`} />
            </Button>

            <Button
              onClick={() => {
                setTheme(Theme.DARK);
              }}
              className={`${theme === "dark" && "bg-accent"}`}
              size={"sm"}
              variant={"outline"}
            >
              <MoonIcon className={`w-5 h-5`} />
            </Button>
          </div>
        </div>

        <DropdownMenuSeparator />

        <CanvasBackground />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default CanvasMenu;
