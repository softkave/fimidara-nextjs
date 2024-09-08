import React, { useCallback } from "react";

export function useHandledEventTraker() {
  /**
   * - ensure evts are handled once, in bubbling phase
   * - ensure evts "exclusively" handled by a child node is not handled by a
   *   parent node
   */
  const handledEvtTrackerRef = React.useRef<Record<number, true>>({});

  const shouldHandleEvent = useCallback((evt: React.BaseSyntheticEvent) => {
    console.log(evt.eventPhase);
    if (
      evt.eventPhase === Event.BUBBLING_PHASE ||
      evt.eventPhase === Event.AT_TARGET
    ) {
      const isHandled = handledEvtTrackerRef.current[evt.timeStamp];
      handledEvtTrackerRef.current[evt.timeStamp] = true;
      console.log({ isHandled });
      return !isHandled;
    } else {
      delete handledEvtTrackerRef.current[evt.timeStamp];
      return false;
    }
  }, []);

  const markExclusivelyHandled = useCallback(
    (evt: React.BaseSyntheticEvent) => {
      handledEvtTrackerRef.current[evt.timeStamp] = true;
    },
    []
  );

  return { shouldHandleEvent, markExclusivelyHandled };
}
