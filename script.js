let id = 1;
let currentTargetId;
let listOfItems = [];
const addItems = () =>{ 
    let input = document.getElementById("inputText");
    let inputValue = input.value;
    let addBtn = document.getElementById("addBtn");
    let addBtnText = addBtn.textContent;
    if(inputValue && addBtnText === "Add"){
        handleAdd(inputValue);
        input.value = "";
    }
    else if(inputValue && addBtnText === "Update"){
        handleUpdate(inputValue);
        input.value = "";
    }
}

const handleEdit = (args) =>{
    let addBtn = document.getElementById("addBtn");
    if(addBtn.textContent === "Add"){
        let targetId = args.target.id;
        let targetParentId = "item" + targetId.slice("editBtn".length);
        let currentText = document.getElementById(targetParentId).firstChild.textContent;
        document.getElementById("inputText").value = currentText;
        addBtn.textContent = "Update";
        currentTargetId = targetParentId; 
        
        focusInputElement();
    }
}

const focusInputElement = () =>{
    var inputElement = document.getElementById("inputText");
    inputElement.focus();
}

const handleAdd = (inputValue) =>{
    let div = document.createElement("div");
    div.id = "item" + id;
    let btnDiv = document.createElement("div");
    btnDiv.id = "btnDiv" + id;
    btnDiv.className = "btnDiv";
    let editBtn = document.createElement("button");
    editBtn.textContent = "Edit";
    editBtn.id = "editBtn" + id;
    editBtn.className = "editBtn"
    editBtn.addEventListener("click",handleEdit)

    let deleteBtn = document.createElement("button");
    deleteBtn.id = "deleteBtn" + id;
    deleteBtn.className = "deleteBtn"
    deleteBtn.textContent = "Delete";
    deleteBtn.addEventListener("click",handleDelete)

    let listItems = document.getElementById("list-items");
    let listItem = document.createElement("li");
    listItem.textContent = inputValue;
    btnDiv.appendChild(editBtn);
    btnDiv.appendChild(deleteBtn);
    div.appendChild(listItem);
    div.appendChild(btnDiv);
    listItems.appendChild(div);

    let newItem = { itemId : "item" + id , itemValue : inputValue}
    listOfItems.push(newItem);
    localStorage.setItem("items", JSON.stringify(listOfItems));

    id++;
    focusInputElement();
}

const handleUpdate = (inputValue) =>{
    let currentElement = document.getElementById(currentTargetId);
    currentElement.firstChild.textContent = inputValue;
    document.getElementById("addBtn").textContent = "Add";

    let currentItems = listOfItems.map(item => (item.itemId === currentTargetId ? { ...item, itemValue: inputValue } : item));

    // let currentItems = listOfItems.map(item=>{
    //     if(item.itemId === currentTargetId){
    //         item.itemValue = inputValue;
    //     }
    //     return item;
    // })

    listOfItems = currentItems;
    localStorage.setItem("items", JSON.stringify(listOfItems));

    focusInputElement();
}

const handleDelete = (args) =>{
    let addBtn = document.getElementById("addBtn");
    if(addBtn.textContent === "Add"){
        let targetId = args.target.id;
        let targetParentId = "item" + targetId.slice("deleteBtn".length);
        let currentElement = document.getElementById(targetParentId);
        currentElement.remove();    

        let currentItems = listOfItems.filter(items=>{
            return items.itemId !== targetParentId; 
        })
        listOfItems = currentItems;
        localStorage.setItem("items", JSON.stringify(listOfItems));
    }
}

const handleSearch = (args) =>{
    var searchElement = document.getElementById("searchInput");
    var searchValue = searchElement.value;
    if(searchValue){
        listOfItems.map(item=>{
            let itemVal = item.itemValue.toLowerCase();
            if(!itemVal.includes(searchValue)){
                var itemElement = document.getElementById(item.itemId);
                itemElement.style.display = "None";
            }
            else{
                var itemElement = document.getElementById(item.itemId);
                itemElement.style.display = "flex";
            }
        })    
    }
    else{
        listOfItems.map(item=>{
            var itemElement = document.getElementById(item.itemId);
            itemElement.style.display = "flex";
        }) 
    }
    console.log(searchValue);
}

const handleDeleteAllItems = () =>{
    var currentItems = listOfItems.map(item=>{
        let currentElement = document.getElementById(item.itemId);
        currentElement.remove();  
    })
    listOfItems = [];
    localStorage.setItem("items", JSON.stringify(listOfItems));
}

const renderExistingItems = () =>{
    var items = JSON.parse(localStorage.getItem("items"));
    if(items && items.length){
        items.map(item =>{
            handleAdd(item.itemValue);
        })    
    }
}

const renderUI = ()=>{
    let mainContainer = document.getElementById("mainContainer")
    let containerDiv = document.createElement("div");
    containerDiv.id = "container";

    var header = document.createElement("h1");
    header.textContent = "Todo List";

    let createInputSection = document.createElement("div");
    createInputSection.id = "input-section";
    let input = document.createElement("input");
    input.id = "inputText";
    input.type = "text";
    input.placeholder = "Add Items..."
    let addBtn = document.createElement("button");
    addBtn.id = "addBtn";
    addBtn.textContent = "Add";
    addBtn.addEventListener("click",addItems);

    createInputSection.appendChild(input);
    createInputSection.appendChild(addBtn);

    let createSearchSection =  document.createElement("input");
    createSearchSection.id = "searchInput";
    createSearchSection.placeholder = "Search items...";
    createSearchSection.addEventListener("keyup", handleSearch)

    let uLItems = document.createElement("ul");
    uLItems.id = "list-items";

    let deleteAll = document.createElement("button");
    deleteAll.id = "delete-all-items";
    deleteAll.textContent = "Delete All Items"
    deleteAll.addEventListener("click", handleDeleteAllItems)

    containerDiv.appendChild(header);
    containerDiv.appendChild(createInputSection);
    containerDiv.appendChild(createSearchSection);
    containerDiv.appendChild(uLItems);
    containerDiv.appendChild(deleteAll);
    mainContainer.appendChild(containerDiv);

    focusInputElement();
    
    renderExistingItems();
}

renderUI()