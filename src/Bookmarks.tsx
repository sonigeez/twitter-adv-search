import { createSignal, onMount } from "solid-js";

export default function Bookmarks() {
    const [bookmarks, setBookmarks] = createSignal([]);
    const [searchQuery, setSearchQuery] = createSignal("");

    const saveTweets = () => {
        console.log("clicked");
        chrome.runtime.sendMessage({ message: "injectScript" });
    }

    onMount(() => {
        chrome.runtime.sendMessage({ action: "getLocalStorage" }, (response) => {
            console.log(response.data.length);
            setBookmarks(response.data)
        });
    });

    const filteredBookmarks = () => {
        const query = searchQuery().toLowerCase();
        return bookmarks().filter(tweet =>
            Object.values(tweet).some(value =>
                typeof value === "string" && value.toLowerCase().includes(query)
            )
        );
    };

    const highlightText = (text) => {
        const query = searchQuery().toLowerCase();
        if (query === "") return text;

        const regex = new RegExp(`(${query})`, "gi");
        return text.split(regex).map((part, _) =>
            regex.test(part.toLowerCase()) ? (
                <span class="bg-blue-200">{part}</span>
            ) : (
                <span>{part}</span>
            )
        );
    };

    return (
        <div class="bg-white dark:bg-black text-black dark:text-white">
            {bookmarks().length === 0 ? (
                <div
                    class="flex justify-center items-center "
                >
                    <button
                        onClick={saveTweets}
                        class="bg-black dark:bg-white mb-5  text-white dark:text-black font-bold py-2 px-4 rounded"
                    >Let the magic begin</button>
                </div>
            ) : (
                <div>
                    <div class="flex justify-between m-2">
                        <div>Total Bookmarks: {bookmarks().length}</div>
                        <button onClick={saveTweets}>refresh bookmarks</button>
                    </div>
                    <div class="flex flex-row  ">
                        <input
                            type="text"
                            placeholder="Search"
                            value={searchQuery()}
                            class="w-full bg-white m-2 dark:bg-black px-3 py-2.5 rounded-md border border-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent"
                            onInput={e => setSearchQuery(e.target.value)}
                        />
                    </div>
                    {filteredBookmarks().map((tweet) => (
                        <a href={tweet.url} target="_blank">
                            <div class="flex flex-row p-2">
                                <img
                                    class="w-10 h-10 rounded-full m-2"
                                    src={tweet.authorProfilePic} alt="profile pic" />
                                <div class="flex flex-col">
                                    <div class="flex flex-row">
                                        <div class="font-bold">{highlightText(tweet.authorName)}</div>
                                        <div class="text-slate-500 mx-2">{tweet.authorHandle}</div>
                                        {/* date */}
                                        <div class="text-slate-500 ">{new Date(tweet.date).toLocaleDateString('en-GB')}</div>
                                    </div>
                                    <div>{highlightText(tweet.text)}</div>
                                </div>
                            </div>
                        </a>
                    ))}
                </div>
            )}
        </div>
    );
}

//object example
// {
//     text: tweetText,
//     authorName: authorName,
//     authorHandle: authorHandle,
//     authorProfilePic: authorProfilePic,
//     date: tweetTimeEl.getAttribute("datetime"),
//     url: tweetUrl,
//     media: {
//         images: tweetImgsSrc.length > 0 ? tweetImgsSrc : null,
//         videoThumbnails: tweetVideoThumbnails.length > 0 ? tweetVideoThumbnails : null,
//     },
// };