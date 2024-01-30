import { createSignal, onMount } from "solid-js";

//im making a twitter advanced search extension

export default function App() {
  const [word, setWord] = createSignal("");
  const [account, setAccount] = createSignal("");
  const [minLikes, setMinLikes] = createSignal(0);
  const [includeReplies, setIncludeReplies] = createSignal(true);
  const [fromDate, setFromDate] = createSignal("");
  const [toDate, setToDate] = createSignal("");
  const [isDarkMode, setIsDarkMode] = createSignal(false);
  const [follows, setFollows] = createSignal(false);
  let accountHistory: string[] = getAccountLocalStorage();

  // Check for initial preference
  onMount(() => {
    chrome.runtime.sendMessage({ query: "getURL" }, (response) => {
      if (response.tabURL) {
        // Now you have the active tab's URL
        // Parse it and extract the username as needed
        const url = new URL(response.tabURL);
        const pathSegments = url.pathname.split('/').filter(Boolean);
        if (pathSegments.length > 0 && url.hostname === "twitter.com") {
          const twitterUsername = pathSegments[0];
          setAccount(twitterUsername); // Your state update function
        }
      }
    });
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    setIsDarkMode(prefersDark);
    console.log(getAccountLocalStorage());
    document.documentElement.classList.toggle("dark", prefersDark);
  });

  //function to store key value pair in local storage
  function setLocalStorage(key: string, value: any) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  //function to get key value pair from local storage
  function getLocalStorage(key: string) {
    const value = localStorage.getItem(key);
    if (value) {
      return JSON.parse(value);
    }
  }

  //function to store a account in local storage
  function setAccountLocalStorage(value: string) {
    const accounts = new Set(getAccountLocalStorage());
    accounts.add(value);
    setLocalStorage("accounts", Array.from(accounts));
  }
  //function to get accounts from local storage
  function getAccountLocalStorage() {
    const accounts = getLocalStorage("accounts");
    if (accounts) {
      return accounts.slice(-5);
    }
    return [];
  }

  const onSubmit = (e: any) => {
    e.preventDefault();
    let url = "https://twitter.com/search?lang=en&q=";
    if (word()) {
      url += word();
    }
    if (account()) {
      url += "%20(from%3A" + account() + ")";
      setAccountLocalStorage(account());
    }
    if (minLikes()) {
      url += "%20min_faves%3A" + minLikes();
    }
    if (!includeReplies()) {
      url += "%20-filter%3Areplies";
    }
    if (follows()) {
      url += "%20filter%3Afollows";
    }
    if (fromDate()) {
      url += "%20since%3A" + fromDate();
    }
    if (toDate()) {
      url += "%20until%3A" + toDate();
    }
    window.open(url, "_blank");
  };


  return (
    <div class={isDarkMode() === true ? "theme-dark" : "theme-light"}>
       <a
  href="https://github.com/sonigeez/twitter-adv-search"
  target="_blank"
  class="github-corner"
  aria-label="View source on GitHub"
  rel="noreferrer"
>
  <svg
    width="40" 
    height="40" 
    viewBox="0 0 250 250"
    style={{
      fill: "#020326",
      color: "#fff",
      position: "absolute",
      top: 0,
      border: 0,
      right: 0,
    }}
    aria-hidden="true"
  >
    <path d="M0,0 L115,115 L130,115 L142,142 L250,250 L250,0 Z"></path>
    <path
      d="M128.3,109.0 C113.8,99.7 119.0,89.6 119.0,89.6 C122.0,82.7 120.5,78.6 120.5,78.6 C119.2,72.0 123.4,76.3 123.4,76.3 C127.3,80.9 125.5,87.3 125.5,87.3 C122.9,97.6 130.6,101.9 134.4,103.2"
      fill="currentColor"
      class="octo-arm"
    ></path>
    <path
      d="M115.0,115.0 C114.9,115.1 118.7,116.5 119.8,115.4 L133.7,101.6 C136.9,99.2 139.9,98.4 142.2,98.6 C133.8,88.0 127.5,74.4 143.8,58.0 C148.5,53.4 154.0,51.2 159.7,51.0 C160.3,49.4 163.2,43.6 171.4,40.1 C171.4,40.1 176.1,42.5 178.8,56.2 C183.1,58.6 187.2,61.8 190.9,65.4 C194.5,69.0 197.7,73.2 200.1,77.6 C213.8,80.2 216.3,84.9 216.3,84.9 C212.7,93.1 206.9,96.0 205.4,96.6 C205.1,102.4 203.0,107.8 198.3,112.5 C181.9,128.9 168.3,122.5 157.7,114.1 C157.9,116.9 156.7,120.9 152.7,124.9 L141.0,136.5 C139.8,137.7 141.6,141.9 141.8,141.8 Z"
      fill="currentColor"
      class="octo-body"
    ></path>
  </svg>
</a>

      <div
        class="px-4 py-2"
        style={{
          width: "400px",
          background: isDarkMode() ? "black" : "white",
        }}
      >
        <form action="">
          <TextInputComponent
            label="All of these words"
            value={word()}
            onChange={(e) => setWord(e.target.value)}
            subtext={`Example: twitter`}
          />

          <TextInputComponent
            label="From this account"
            value={account()}
            onChange={(e) => setAccount(e.target.value)}
            subtext="Example: that_anokha_boy · sent from that_anokha_boy"
            recommended={accountHistory}
          />

          <TextInputComponent
            label="Minimum likes"
            value={minLikes()}
            onChange={(e) => setMinLikes(e.target.value)}
            subtext="Example: 69 · contains “69”"
          />

          <CheckboxComponent
            label="Include replies"
            value={includeReplies()}
            onChange={(e) => setIncludeReplies(e.target.checked)}
          />
          <CheckboxComponent
            label="only from account you follow"
            value={follows()}
            onChange={(e) => setFollows(e.target.checked)}
          />

          <h1>Dates</h1>
          <div date-rangepicker class="mb-6 flex justify-between">
            <div class="relative">
              <div class="text-black dark:text-white">From</div>
              <input
                name="start"
                type="date"
                value={fromDate()}
                onChange={(e) => setFromDate(e.target.value)}
                class="bg-white border-gray-300 dark:border-gray-800 color-scheme:light dark:[color-scheme:dark] dark:bg-black border accent-slate-600  text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5  dark:bg-black-700  dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Select date start"
              />
            </div>
            <div class="relative">
              <div class="text-black dark:text-white">Till</div>
              <input
                name="end"
                type="date"
                value={toDate()}
                onChange={(e) => setToDate(e.target.value)}
                class="bg-white  border-gray-300 dark:border-gray-800 color-scheme:light dark:[color-scheme:dark] dark:bg-black border accent-slate-600  text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5  dark:bg-black-700  dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Select date end"
              />
            </div>
          </div>
          <div class="flex justify-center">
            <button
              onClick={onSubmit}
              class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
            >
              Search
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

interface TextInputComponentProps {
  label?: string;
  value?: string | number;
  subtext?: string;
  recommended?: string[];
  onChange: (e: any) => void;
}
function TextInputComponent(props: TextInputComponentProps) {
  //avoiding destructuring to avoid lost of reactivity
  // function to set value of input tag to selected recommended value
  function setRecommendedValue(value: string) {
    console.log(value);
    props.onChange({ target: { value: value } });
  }
  const [list, setList] = createSignal(props.recommended??[]);

  //filter recommended list based on input value
  function filterRecommendedList(value: string) {
    if (props.recommended) {
      setList(
        props.recommended.filter((item) => {
          return item.toLowerCase().includes(value.toLowerCase());
        })
      );
    }
  }
  return (
    <div class="relative group w-full min-w-[200px] my-4">
      <input
        class="peer w-full h-full bg-white dark:bg-black text-black dark:text-white font-sans font-normal outline outline-0 focus:outline-0 disabled:bg-gray-700 disabled:border-0 transition-all placeholder-shown:border placeholder-shown:border-gray-800 placeholder-shown:border-t-gray-800 border focus:border-2 border-t-transparent focus:border-t-transparent text-sm px-3 py-2.5 rounded-[7px] border-gray-300 dark:border-gray-800 focus:border-blue-500"
        placeholder=""
        onChange={props.onChange}
        oninput={(e) => filterRecommendedList(e.target.value)}
        value={props.value ? props.value : ""}
      />
      <label class="flex w-full h-full select-none pointer-events-none absolute left-0 font-normal !overflow-visible truncate peer-placeholder-shown:text-gray-500 leading-tight peer-focus:leading-tight peer-disabled:text-transparent peer-disabled:peer-placeholder-shown:text-gray-500 transition-all -top-1.5 peer-placeholder-shown:text-sm text-[11px] peer-focus:text-[11px] before:content[' '] before:block before:box-border before:w-2.5 before:h-1.5 before:mt-[6.5px] before:mr-1 peer-placeholder-shown:before:border-transparent before:rounded-tl-md before:border-t peer-focus:before:border-t-2 before:border-l peer-focus:before:border-l-2 before:pointer-events-none before:transition-all peer-disabled:before:border-transparent after:content[' '] after:block after:flex-grow after:box-border after:w-2.5 after:h-1.5 after:mt-[6.5px] after:ml-1 peer-placeholder-shown:after:border-transparent after:rounded-tr-md after:border-t peer-focus:after:border-t-2 after:border-r peer-focus:after:border-r-2 after:pointer-events-none after:transition-all peer-disabled:after:border-transparent peer-placeholder-shown:leading-[3.75] text-gray-500 peer-focus:text-blue-500 before:border-gray-800 peer-focus:before:!border-blue-500 after:border-gray-800 peer-focus:after:!border-blue-500">
        {props.label}
      </label>
      {/* recommended list show when input tag is on focus */}
      {list() && (
        <div class=" hidden group-focus-within:block absolute z-10 w-full bg-white dark:bg-black border border-gray-300 dark:border-gray-800 rounded-b-lg shadow-lg">
          {list().map((item) => (
            <div onmouseover={()=>setRecommendedValue(item)} class="px-3 py-2.5 text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-900 cursor-pointer">
              {item}
            </div>
          ))}
        </div>
      )}

      {/* subtext */}
      <div>
        <p style={{ "font-size": "10px" }} class="ml-1 text-gray-500">
          {props.subtext}
        </p>
      </div>
    </div>
  );
}

//checkbox component
interface CheckboxComponentProps {
  label?: string;
  value?: boolean;
  onChange?: (e: any) => void;
}

function CheckboxComponent({ label, value, onChange }: CheckboxComponentProps) {
  const id = Math.random().toString(36).substr(2, 9);
  return (
    <div class="block">
      <div class="inline-flex items-center">
        <label
          for={id}
          class="relative flex items-center p-3 rounded-full cursor-pointer"
        >
          <input
            type="checkbox"
            onChange={onChange}
            checked={value}
            id={id}
            class="before:content[''] peer relative h-5 w-5 cursor-pointer appearance-none rounded-md border border-blue-gray-200 transition-all before:absolute before:top-2/4 before:left-2/4 before:block before:h-12 before:w-12 before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:bg-blue-gray-500 before:opacity-0 before:transition-opacity checked:border-white checked:bg-blue-500 checked:before:bg-gray-900 hover:before:opacity-10"
          />
          <span class="absolute text-white transition-opacity opacity-0 pointer-events-none top-2/4 left-2/4 -translate-y-2/4 -translate-x-2/4 peer-checked:opacity-100">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-3.5 w-3.5"
              viewBox="0 0 20 20"
              fill="currentColor"
              stroke="currentColor"
              stroke-width="1"
            >
              <path
                fill-rule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clip-rule="evenodd"
              ></path>
            </svg>
          </span>
        </label>
        <label
          class="mt-px  font-bold text-black cursor-pointer select-none dark:text-white"
          for={id}
        >
          {label}
        </label>
      </div>
    </div>
  );
}
