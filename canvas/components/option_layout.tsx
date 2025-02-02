import { ReactNode } from "react";

type props = {
  label: string;

  children: ReactNode;
  weight?: number;
};

const OptionLayout = ({ label, children, weight = 600 }: props) => {
  return (
    <div className="flex flex-col gap-2 px-2">
      <h6 style={{ fontWeight: weight }} className={`text-sm`}>
        {label}
      </h6>
      <div className="flex justify-between">{children}</div>
    </div>
  );
};

export default OptionLayout;
