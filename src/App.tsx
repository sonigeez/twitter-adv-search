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

  // Check for initial preference
  onMount(() => {
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    setIsDarkMode(prefersDark);
    document.documentElement.classList.toggle("dark", prefersDark);
  });

  const onSubmit = (e: any) => {
    e.preventDefault();
    let url = "https://twitter.com/search?lang=en&q=";
    if (word()) {
      url += word();
    }
    if (account()) {
      url += "%20(from%3A" + account() + ")";
    }
    if (minLikes()) {
      url += "%20min_faves%3A" + minLikes();
    }
    if (!includeReplies()) {
      url += "%20-filter%3Areplies";
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
      <div
        style={{
          width: "400px",
          height: "450px",
          padding: "8px",
          background: isDarkMode() ? "black" : "white",
        }}
      >
        <form action="">
          <TextInputComponent
            label="All of these words"
            value={word()}
            onChange={(e) => setWord(e.target.value)}
            subtext={`Example: agi`}
          />

          <TextInputComponent
            label="From this account"
            value={account()}
            onChange={(e) => setAccount(e.target.value)}
            subtext="Example: that_anokha_boy · sent from that_anokha_boy"
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
                class="bg-white border-gray-300 dark:border-gray-800 color-scheme:light dark:[color-scheme:dark] dark:bg-black border accent-slate-600  text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5  dark:bg-black-700  dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
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
  onChange?: (e: any) => void;
}
function TextInputComponent({
  label,
  value,
  subtext,
  onChange,
}: TextInputComponentProps) {
  return (
    <div class="relative w-full min-w-[200px] my-4">
      <input
        class="peer w-full h-full bg-white dark:bg-black text-black dark:text-white font-sans font-normal outline outline-0 focus:outline-0 disabled:bg-gray-700 disabled:border-0 transition-all placeholder-shown:border placeholder-shown:border-gray-800 placeholder-shown:border-t-gray-800 border focus:border-2 border-t-transparent focus:border-t-transparent text-sm px-3 py-2.5 rounded-[7px] border-gray-300 dark:border-gray-800 focus:border-blue-500"
        placeholder=""
        onChange={onChange}
        value={value ? value : ""}
      />
      <label class="flex w-full h-full select-none pointer-events-none absolute left-0 font-normal !overflow-visible truncate peer-placeholder-shown:text-gray-500 leading-tight peer-focus:leading-tight peer-disabled:text-transparent peer-disabled:peer-placeholder-shown:text-gray-500 transition-all -top-1.5 peer-placeholder-shown:text-sm text-[11px] peer-focus:text-[11px] before:content[' '] before:block before:box-border before:w-2.5 before:h-1.5 before:mt-[6.5px] before:mr-1 peer-placeholder-shown:before:border-transparent before:rounded-tl-md before:border-t peer-focus:before:border-t-2 before:border-l peer-focus:before:border-l-2 before:pointer-events-none before:transition-all peer-disabled:before:border-transparent after:content[' '] after:block after:flex-grow after:box-border after:w-2.5 after:h-1.5 after:mt-[6.5px] after:ml-1 peer-placeholder-shown:after:border-transparent after:rounded-tr-md after:border-t peer-focus:after:border-t-2 after:border-r peer-focus:after:border-r-2 after:pointer-events-none after:transition-all peer-disabled:after:border-transparent peer-placeholder-shown:leading-[3.75] text-gray-500 peer-focus:text-blue-500 before:border-gray-800 peer-focus:before:!border-blue-500 after:border-gray-800 peer-focus:after:!border-blue-500">
        {label}
      </label>
      {/* subtext */}
      <div>
        <p style={{ "font-size": "10px" }} class="ml-1 text-gray-500">
          {subtext}
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
  return (
    <div class="inline-flex items-center">
      <label
        class="relative flex items-center p-3 rounded-full cursor-pointer"
        for="check"
      >
        <input
          type="checkbox"
          onChange={onChange}
          checked={value}
          class="before:content[''] peer relative h-5 w-5 cursor-pointer appearance-none rounded-md border border-blue-gray-200 transition-all before:absolute before:top-2/4 before:left-2/4 before:block before:h-12 before:w-12 before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:bg-blue-gray-500 before:opacity-0 before:transition-opacity checked:border-white checked:bg-blue-500 checked:before:bg-gray-900 hover:before:opacity-10"
          id="check"
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
        for="check"
      >
        {label}
      </label>
    </div>
  );
}
