import { useEffect, useState } from "react";

interface RequestFunction {
  (options: { signal: AbortSignal }): Promise<any>;
}

const useRequest = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [controller, setController] = useState<AbortController | null>(null);

  const runRequest = async (func: RequestFunction) => {
    const newController = new AbortController();
    setController(newController);

    try {
      setIsLoading(true);
      const response = await func({ signal: newController.signal });
      setIsLoading(false);
      return response;
    } catch (error: unknown) {
      setIsLoading(false);
      if (error instanceof Error && error.name !== "AbortError") {
        throw error;
      }
    } finally {
      setController(null);
    }
  };

  const cancelRequest = () => {
    if (controller) {
      controller.abort();
    }
  }

  useEffect(() => {
    return () => {
      controller?.abort();
    };
  }, [controller]);

  return {
    isLoading,
    runRequest,
    cancelRequest
  };
};

export default useRequest;
