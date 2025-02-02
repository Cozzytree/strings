import { ReactNode } from "react";

type props = {
  label: string;

  children: ReactNode;
};

const OptionLayout = ({ label, children }: props) => {
  return (
    <div className="flex flex-col gap-2 px-2">
      <h6 className="font-bold text-sm">{label}</h6>
      <div className="flex justify-between">{children}</div>
    </div>
  );
};

export default OptionLayout;
