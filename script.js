document.addEventListener("DOMContentLoaded", () => {
  // button to add to-dos
  const buttonAdd = document.getElementById("add");
  const inputBox = document.getElementById("item");

  // eventListener so that when the user clicks add, if text is written it will be added to the list, input empty after that.
  function addAndClearInput() {
    const newItem = inputBox.value;
    if (newItem) {
      addLocalTodo(newItem);
      addItemToDo(newItem);
      inputBox.value = "";
    }
  }

  buttonAdd.addEventListener("click", addAndClearInput);

  // user needs to press enter for the above to take place
  inputBox.addEventListener("keypress", function (event) {
    const key = event.key || event.keyCode;
    const isEnterKey = key === "Enter" || key === 13;
    if (isEnterKey) {
      addAndClearInput();
    }
  });

  function completeItem(item) {
    const parent = item.parentNode;
    const id = parent.id;
    const list = document.getElementById(
      id === "pending-tasks" ? "completed" : "pending-tasks"
    );
    parent.removeChild(item);
    list.insertBefore(item, list.parentNode[0]);
  }

  //create the addItemToDo function()
  function addItemToDo(text) {
    let list = document.getElementById("pending-tasks"); //getting the ul tag
    let item = document.createElement("li"); // creating list items
    item.innerText = text;

    //creating buttons - a class of buttons to a div to contain the two buttons
    let buttons = document.createElement("div");
    buttons.classList.add("buttons");

    //creating buttons
    let complete = document.createElement("button");
    complete.classList.add("fa");
    complete.classList.add("fa-check");
    complete.classList.add("complete");

    complete.style.cursor = "pointer";
    complete.style.background = "none";
    complete.style.color = "#5af542";
    complete.style.border = " 0";
    // function deciding which tasks go where

    complete.addEventListener("click", (event) => {
      const item = event.target.parentNode.parentNode;
      completeItem(item);
      completeLocalTodo(item);
    });

    let remove = document.createElement("button");
    remove.classList.add("fa");
    remove.classList.add("fa-trash");
    remove.classList.add("remove");

    remove.style.cursor = "pointer";
    remove.style.background = "none";
    remove.style.color = "#ff0000";
    remove.style.border = " 0";

    function removeItem() {
      let item = this.parentNode.parentNode;
      let parent = item.parentNode;

      const id = parent.id;
      console.log(id);

      const removeFrom =
        id === "completed" ? completedLocalStorageKey : pendingLocalStorageKey;
      console.log(removeFrom);
      console.log(item.innerText);
      console.log(getLocalToDos(removeFrom));
      localStorage.setItem(
        removeFrom,
        JSON.stringify(
          getLocalToDos(removeFrom).filter((item1) => item1 !== item.innerText)
        )
      );
      parent.removeChild(item);
    }

    remove.addEventListener("click", removeItem);
    buttons.appendChild(complete);
    buttons.appendChild(remove);

    item.appendChild(buttons);

    list.insertBefore(item, list.childNodes[0]); //'li to the ul so tasks are added to top of the list
    return item;
  }
  //LOCAL STORAGE STARTS HERE
  const pendingLocalStorageKey = "pendingToDos";
  const completedLocalStorageKey = "completedToDos";
  function getLocalToDos(localStorageKey) {
    const existingValue = localStorage.getItem(localStorageKey);
    return existingValue ? JSON.parse(existingValue) : [];
  }
  getLocalToDos(pendingLocalStorageKey).forEach(addItemToDo);
  getLocalToDos(completedLocalStorageKey)
    .map(addItemToDo)
    .forEach(completeItem);

  function addLocalTodo(newToDoItem) {
    localStorage.setItem(
      pendingLocalStorageKey,
      JSON.stringify([newToDoItem, ...getLocalToDos(pendingLocalStorageKey)])
    );
  }

  function completeLocalTodo(toDo) {
    const parent = toDo.parentNode;
    const id = parent.id;
    console.log(id);

    const removeFrom =
      id === "pending-tasks"
        ? completedLocalStorageKey
        : pendingLocalStorageKey;

    const addTo =
      id === "pending-tasks"
        ? pendingLocalStorageKey
        : completedLocalStorageKey;

    localStorage.setItem(
      removeFrom,
      JSON.stringify(
        getLocalToDos(removeFrom).filter((item) => item !== toDo.innerText)
      )
    );

    localStorage.setItem(
      addTo,
      JSON.stringify([toDo.innerText, ...getLocalToDos(addTo)])
    );
  }
});
