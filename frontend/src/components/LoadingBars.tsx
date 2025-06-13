import LinearProgress from "@mui/material/LinearProgress";
import Stack from "@mui/material/Stack";
import { useEffect, useState } from "react";

interface LoadingBarProps {
  barCount: number;
}

export const LoadingBars: React.FC<LoadingBarProps> = ({ barCount }) => {
  const [renderCount, setRenderCount] = useState(0);

  useEffect(() => {
    if (renderCount < barCount) {
      const timer = setTimeout(() => setRenderCount(renderCount + 1), 200);
      return () => clearTimeout(timer);
    }
  }, [renderCount, barCount]);

  return (
    <div className="flex flex-col w-full gap-2">
      {Array.from({ length: renderCount }).map((_, idx) => (
        <Stack
          sx={{ width: "100%", color: "grey.500" }}
          spacing={0}
          style={{ opacity: "0.5" }}
          key={idx}
        >
          <LinearProgress color="inherit" />
          <LinearProgress color="inherit" />
          <LinearProgress color="inherit" />
        </Stack>
      ))}
    </div>
  );
};
