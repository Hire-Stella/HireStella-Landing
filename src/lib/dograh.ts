/**
 * The shape of window.DograhWidget.
 *
 * One object, one global, shared by both embed tokens — voice-agent.tsx and
 * chat-agent.tsx each load a different token through it, never at the same
 * time (see the loader in either file). The real object exposes every method
 * below regardless of which mode it is currently configured for; the ones
 * that do not apply just warn and no-op rather than being absent, which is
 * why this is one full type rather than two narrower ones.
 */

export type ChatTurn = {
  id: string | number;
  user_message?: { text: string };
  assistant_message?: { text: string };
};

export type ChatStatus = 'idle' | 'starting' | 'ready' | 'waiting' | 'ended' | 'expired' | 'error';

export type Dograh = {
  start: () => Promise<unknown> | void;
  stop: () => Promise<unknown> | void;
  setContext: (variables: Record<string, string>) => void;
  getState: () => {
    config?: { token?: string };
    chat?: { status?: ChatStatus; pendingUserText?: string | null };
  };
  // Voice
  onCallEnd: (cb: () => void) => void;
  onStatusChange: (cb: (status: string, text?: string, subtext?: string) => void) => void;
  // Chat
  sendMessage: (text: string) => Promise<ChatTurn[] | null>;
  getMessages: () => ChatTurn[];
  onMessage: (cb: (text: string, turn: ChatTurn) => void) => void;
  onChatStateChange: (cb: (status: string) => void) => void;
  // Shared
  onError: (cb: (error: Error) => void) => void;
};

declare global {
  interface Window {
    DograhWidget?: Dograh;
  }
}
