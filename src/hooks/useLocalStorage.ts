import { useEffect, useState } from "react";

export function getKey(key: string): string {
  return `luperro-${key}`;
}

export interface StoredItem {
  name: string;
  url: string;
  thumbnail: string;
}

export function readHistory(): Array<StoredItem> {
  const value = localStorage.getItem(getKey("history"));
  if (!value) {
    return [];
  }

  return JSON.parse(value);
}

export function addItemToHistory(value: StoredItem) {
  const history = readHistory();
  if (history.find((t) => t.name === value.name)) {
    console.log("duplicate!");
    return;
  }
  history.push(value);

  const newValue = JSON.stringify(history);
  localStorage.setItem(getKey("history"), newValue);
}

export default function useLocalStorage() {
  let [list, setList] = useState<Array<StoredItem>>([]);

  useEffect(() => {
    const data = readHistory();
    setList(data);
  }, []);

  return {
    list,
    addItemToHistory,
  };
}
