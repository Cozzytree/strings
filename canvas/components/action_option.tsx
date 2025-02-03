import { Button } from "~/components/ui/button";
import OptionLayout from "./option_layout";
import { Copy, Trash } from "lucide-react";

type props = {
  handleRemove: () => void;
  handleDuplicate: () => void;
};

const ActionOption = ({ handleDuplicate, handleRemove }: props) => {
  return (
    <OptionLayout label="Actions">
      <div>
        <Button
          onClick={handleDuplicate}
          className="bg-foreground/5"
          variant={"outline"}
          size={"sm"}
        >
          <Copy />
        </Button>

        <Button
          onClick={handleRemove}
          className="bg-foreground/5"
          variant={"outline"}
          size={"sm"}
        >
          <Trash />
        </Button>
      </div>
    </OptionLayout>
  );
};

export default ActionOption;
