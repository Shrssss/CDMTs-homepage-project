/* 開発時のみ MSW を起動する
   .env.development.local に NEXT_PUBLIC_API_MOCKING=enabled を書くと有効になる */

export const isMockingEnabled =
  process.env.NODE_ENV === "development" &&
  process.env.NEXT_PUBLIC_API_MOCKING === "enabled";

// ページごとに Provider がマウントされても worker の起動は1回だけにする
let started: Promise<unknown> | null = null;

export const enableMocking = () => {
  if (!isMockingEnabled) return Promise.resolve();
  started ??= import("./browser").then(({ worker }) =>
    // 画像やNext.jsのアセットなど、ハンドラーにないリクエストはそのまま通す
    worker.start({ onUnhandledRequest: "bypass" }),
  );
  return started;
};
