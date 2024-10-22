import { Match, Switch, createSignal, onMount } from "solid-js";
import SearchBar from "./SearchBar";
import Bookmarks from "./Bookmarks";


export default function App() {

  const [activeTab, setActiveTab] = createSignal("Search");
  const [isDarkMode, setIsDarkMode] = createSignal(false);
  const [hideHighLikes, setHideHighLikes] = createSignal(false);
  const [likeThreshold, setLikeThreshold] = createSignal(10000);



  const tabs = [
    { name: "Search", key: "Search", content: <SearchBar /> },
    { name: "Bookmarks", key: "Bookmarks", content: <Bookmarks /> },
  ];

  const handleThresholdChange = (event) => {
    const newThreshold = parseInt(event.target.value, 10);
    setLikeThreshold(newThreshold);
    chrome.runtime.sendMessage({ 
      action: "setLikeThreshold", 
      threshold: newThreshold
    });
  };

  const handleToggleChange = () => {
    console.log("handleToggleChange");
    setHideHighLikes(!hideHighLikes());
    console.log(!hideHighLikes());
    chrome.runtime.sendMessage({ action: "setHideHighLikes", isHideHighLikes: hideHighLikes() });
  };

  onMount(() => {
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    setIsDarkMode(prefersDark);
    document.documentElement.classList.toggle("dark", prefersDark);

    chrome.runtime.sendMessage({ action: "isHideHighLikes" }, (response) => {
      setHideHighLikes(response.data);
    });

    chrome.runtime.sendMessage({ action: "getLikeThreshold" }, (response) => {
      console.log(response.data);
      setLikeThreshold(response.data || 10000);
    });
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
      {/* <div class="px-4 py-2">
      <input
          id="hide-high-likes mx-2"
          type="checkbox"
          class="rounded-md border-gray-400 dark:border-gray-600 focus:ring-blue-500 dark:focus:ring-blue-600"
          checked={hideHighLikes()} 
          onChange={handleToggleChange}
        />
        <label for="hide-high-likes mx-2" class="text-sm text-gray-700 dark:text-gray-300">
          {" "}Hide Tweets with {">"} 10k Likes
        </label>
       
      </div> */}

<div class="px-4 py-2">
        <input
          id="hide-high-likes"
          type="checkbox"
          class="rounded-md border-gray-400 dark:border-gray-600 focus:ring-blue-500 dark:focus:ring-blue-600"
          checked={hideHighLikes()} 
          onChange={handleToggleChange}
        />
        <label for="hide-high-likes" class="text-sm  dark:text-white text-black">
          {" "}Hide Tweets with {">"} 
          <input 
            type="number" 
            value={likeThreshold()} 
            onInput={handleThresholdChange}
            class="w-20 mx-1 px-1 border rounded text-white dark:text-black"
          /> 
          Likes
        </label>
      </div>

    </div>
  );
}
