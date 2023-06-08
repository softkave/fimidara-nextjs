import React from "react";

export function useHandledEventTraker() {
  const handledEvtTrackerRef = React.useRef<{ t?: number }>({});
  const shouldHandleEvt = (evt: React.BaseSyntheticEvent) => {
    if (handledEvtTrackerRef.current?.t === evt.timeStamp) {
      return false;
    } else {
      handledEvtTrackerRef.current = { t: evt.timeStamp };
      return true;
    }
  };

  return { shouldHandleEvt };
}
