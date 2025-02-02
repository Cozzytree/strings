import {
  Folder,
  Image,
  MenuIcon,
  MoonIcon,
  Save,
  SunIcon,
  Trash,
} from "lucide-react";
import { Theme, useTheme } from "remix-themes";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import CanvasBackground from "./canvasBackground";

const menus = [
  { label: "Open", I: Folder },
  { label: "Save to..", I: Save },
  { label: "Export image", I: Image },
  { label: "Reset the canvas", I: Trash },
];

const CanvasMenu = () => {
  const [theme, setTheme] = useTheme();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <MenuIcon />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[200px] z-[999999]">
        {menus.map((m, i) => (
          <DropdownMenuItem key={i}>
            <m.I /> {m.label}
          </DropdownMenuItem>
        ))}
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
