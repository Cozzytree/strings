import OptionLayout from "./option_layout";

import { Group, Ungroup } from "lucide-react";
import { Button } from "~/components/ui/button";
import { useState } from "react";

type props = {
  handleGroup: (type: "group" | "ungroup") => void;
  isGrouped: () => boolean;
};

const GroupOption = ({ handleGroup, isGrouped }: props) => {
  const [grouped, setGrouped] = useState(isGrouped());
  return (
    <OptionLayout label="Group">
      <div className="flex gap-1">
        <Button
          disabled={grouped}
          onClick={() => {
            handleGroup("group");
            setGrouped(true);
          }}
          className={`bg-foreground/10`}
          variant={"outline"}
          size={"sm"}
        >
          <Group />
        </Button>

        <Button
          disabled={!grouped}
          onClick={() => {
            handleGroup("ungroup");
            setGrouped(false);
          }}
          className="bg-foreground/10"
          variant={"outline"}
          size={"sm"}
        >
          <Ungroup />
        </Button>
      </div>
    </OptionLayout>
  );
};

export default GroupOption;
