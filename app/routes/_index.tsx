import type { LinksFunction, MetaFunction } from "@remix-run/node";
import { LoaderCircleIcon } from "lucide-react";
import React, { lazy, Suspense } from "react";

const CanvasDraw = lazy(() => import("canvas"));

export const links: LinksFunction = () => {
  return [
    { rel: "preconnect", href: "https://fonts.googleapis.com" },

    {
      rel: "preconnect",
      href: "https://fonts.gstatic.com",
      crossOrigin: "anonymous",
    },
    {
      rel: "stylesheet",
      href: "https://fonts.googleapis.com/css2?family=Caveat:wght@400..700&display=swap",
    },
    {
      rel: "stylesheet",
      href: "https://fonts.googleapis.com/css2?family=JetBrains+Mono:ital,wght@0,100..800;1,100..800&display=swap",
    },
  ];
};

export const meta: MetaFunction = () => {
  return [
    { title: "Str" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

function Loader() {
  return (
    <div className="w-full h-screen flex justify-center items-center">
      <LoaderCircleIcon className="animate-spin" />
    </div>
  );
}

const Canvas = React.memo(CanvasDraw)

export default function Index() {
  return (
    <div className="w-full min-h-screen">
      <Suspense fallback={Loader()}>
        <Canvas />
      </Suspense>
    </div>
  );
}
