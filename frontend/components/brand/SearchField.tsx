"use client";

import { Search } from "lucide-react";
import { useState } from "react";

type Props = {
  id: string;
  label: string;
  placeholder: string;
  defaultValue?: string;
  onSubmit: (value: string) => void;
};

// 送信ボタン付きの検索欄（Enterまたはボタンで確定）
const SearchField = ({ id, label, placeholder, defaultValue, onSubmit }: Props) => {
  const [value, setValue] = useState(defaultValue ?? "");

  return (
    <form
      className="flex w-full min-w-0 flex-col gap-2 md:max-w-sm"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(value.trim());
      }}
    >
      <label htmlFor={id} className="font-mono text-xs font-bold tracking-wider">
        {label}
      </label>
      <div className="flex">
        <input
          id={id}
          type="search"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder}
          className="h-12 min-w-0 flex-1 border-2 border-r-0 border-brand-black bg-white px-3 text-base text-brand-black outline-none focus-visible:ring-2 focus-visible:ring-brand-black/40"
        />
        <button
          type="submit"
          aria-label="検索"
          className="flex size-12 cursor-pointer items-center justify-center border-2 border-brand-black bg-brand-black text-brand-beige"
        >
          <Search className="size-5" />
        </button>
      </div>
    </form>
  );
};

export default SearchField;
