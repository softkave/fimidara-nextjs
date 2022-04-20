import React from "react";

export interface IUseCooldownResultProps {
  isInCooldown: boolean;
  startCooldown: () => void;
  endCooldown: () => void;
}

export interface IUseCooldownProps {
  // How long the cooldown lasts in milliseconds
  duration?: number;
}

const useCooldown = (
  props: IUseCooldownProps = {}
): IUseCooldownResultProps => {
  let duration = props.duration || 1000 * 60; // 1 minute
  const [isInCooldown, setIsInCooldown] = React.useState(false);
  const [cooldownTimer, setCooldownTimer] = React.useState<
    number | undefined
  >();
  const startCooldown = React.useCallback(() => {
    setIsInCooldown(true);
  }, []);

  const endCooldown = React.useCallback(() => {
    setIsInCooldown(false);
    setCooldownTimer(undefined);
    clearTimeout(cooldownTimer);
  }, []);

  React.useEffect(() => {
    if (isInCooldown && !cooldownTimer) {
      // TODO: remove after testing to make sure there's no infinite loop
      console.log("Starting cooldown");
      const timeout = window.setTimeout(() => {
        endCooldown();
      }, duration);

      setCooldownTimer(timeout);
    }
  }, [duration, endCooldown, isInCooldown, cooldownTimer]);

  return {
    isInCooldown,
    startCooldown,
    endCooldown,
  };
};

export default useCooldown;
