import { Match, Switch, createSignal, onMount } from "solid-js";
import SearchBar from "./SearchBar";
import Bookmarks from "./Bookmarks";


export default function App() {

  const [activeTab, setActiveTab] = createSignal("Search");
  const [isDarkMode, setIsDarkMode] = createSignal(false);


  const tabs = [
    { name: "Search", key: "Search", content: <SearchBar /> },
    { name: "Bookmarks", key: "Bookmarks", content: <Bookmarks /> },

  ];

  onMount(() => {
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    setIsDarkMode(prefersDark);
    document.documentElement.classList.toggle("dark", prefersDark);
  });
  return (
    <div class={isDarkMode() === true ? "theme-dark" : "theme-light"} style={{
      width: "400px",
      background: isDarkMode() ? "black" : "white",
    }}>
      <div class=" p-0.5 relative">
        <ul class="flex justify-center  w-full">
          {tabs.map((tab) => (
            <li class="flex-1">
              <button
                class={`inline-block py-2 px-4 font-semibold w-full text-center ${activeTab() === tab.key
                  ? "text-black dark:text-white bg-white dark:bg-black border-b-2 border-x-blue-300"
                  : "text-slate-500 bg-white dark:bg-black "
                  }`}
                onClick={() => setActiveTab(tab.key)}
              >
                {tab.name}
              </button>
            </li>
          ))}

        </ul>
      </div>
      <div class="tab-content mt-4">
        <Switch>
          {tabs.map((tab) => (
            <Match when={activeTab() === tab.key}>
              <div class={`animate-fadeIn`}>{tab.content}</div>
            </Match>
          ))}
        </Switch>
      </div>
    </div>
  );
}
