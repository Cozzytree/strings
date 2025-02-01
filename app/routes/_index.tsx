import type { MetaFunction } from "@remix-run/node";
import Canvasdraw from "canvas";

export const meta: MetaFunction = () => {
  return [
    { title: "Str" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export default function Index() {
  return (
    <div className="w-full min-h-screen">
      <Canvasdraw />
    </div>
  );
}
