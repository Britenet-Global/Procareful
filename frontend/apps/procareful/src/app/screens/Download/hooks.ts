/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';

type IBeforeInstallPromptEvent = Event & {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
};

export const usePromptEventTrigger = (): [IBeforeInstallPromptEvent | null, () => void] => {
  const [prompt, setPrompt] = useState<IBeforeInstallPromptEvent | null>(null);

  const promptToInstall = () => {
    if (prompt) {
      return prompt.prompt();
    }

    return Promise.reject(
      new Error('Tried installing before browser sent "beforeinstallprompt" event')
    );
  };

  useEffect(() => {
    const ready = (e: IBeforeInstallPromptEvent) => {
      e.preventDefault();
      setPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', ready as unknown as any);

    return () => {
      window.removeEventListener('beforeinstallprompt', ready as unknown as any);
    };
  }, []);

  return [prompt, promptToInstall];
};
