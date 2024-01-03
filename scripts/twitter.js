//attemt to make discrod like search bar for twitter

// console.log("Hello, Twitter!");

// const xPathSring = "//form[@role='search']";

// // //trigger a function evert second
// // setInterval(function() {

// // }, 2000);

// //wait for 2 second
// setTimeout(() => {
//   const searchForm = document.evaluate(
//     xPathSring,
//     document,
//     null,
//     XPathResult.FIRST_ORDERED_NODE_TYPE,
//     null
//   ).singleNodeValue;
//   //get first item in form
//   const firstItem = searchForm.firstElementChild;
//   //get input element from first item
//   const input = firstItem.getElementsByTagName("input")[0];
//   //get second item

//   if (searchForm) {
//     //append a button on 2nd position
//     const searchHelperContainer = document.createElement("div");
//     searchHelperContainer.className = "search-helper-container";
//     searchHelperContainer.innerHTML = `
//       <button class="search-helper-btn">Search</button>
//     `;
  

//     //listen for input event if it's focused then show button else hide
//     input.addEventListener("focus", function() {
//       console.log("Input is focused");
//     searchForm.insertBefore(searchHelperContainer, searchForm.childNodes[1]);

//     });
//     input.addEventListener("blur", function() {
//       console.log("Input is blurred");
//         searchForm.removeChild(searchHelperContainer);
//     });
//   }
// }, 2000);
