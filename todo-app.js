(function(){

    function createAppTitle(title){
        let appTitle = document.createElement('h2');
        appTitle.innerHTML = title;
        return appTitle;
    }

    function createTodoItemForm(){
        let form = document.createElement('form');
        let input = document.createElement('input');
        let buttonWrapper = document.createElement('div');
        let button = document.createElement('button');

        form.classList.add('input_group', 'mb-3');
        input.classList.add('form-control');
        input.placeholder = "Input new task";
        buttonWrapper.classList.add('input-group-append');
        button.classList.add('btn','btn-primary');
        button.textContent = "Add task";

        buttonWrapper.append(button);
        form.append(input);
        form.append(buttonWrapper);

        return {
            form,
            input,
            button
        };
    }

    function createTodoList(){
        let list = document.createElement('ol');
        list.classList.add('list-group');
        return list;
    }

    function createTodoItem(name,done){
        let item = document.createElement('li');
        let buttonGroup = document.createElement('div');
        let doneButton = document.createElement('button');
        let deleteButton = document.createElement('button');

        item.classList.add('list-group-item', 'd-flex', 'justify-content-between','align-items-center');
        item.textContent = name;

        if(done==="true"){
            item.classList.add("list-group-item-success");
        }
        else{
            done="false";
        }

        buttonGroup.classList.add('btn-group','btn-group-sm');
        doneButton.classList.add('btn','btn-success');
        doneButton.textContent = 'Done';
        deleteButton.classList.add('btn','btn-danger');
        deleteButton.textContent = 'Delete';

        buttonGroup.append(doneButton);
        buttonGroup.append(deleteButton);
        item.append(buttonGroup);

        return{
            item,
            doneButton,
            deleteButton,
            done,
            name
        };
    }

    function createItemsFromLocStorage(key,todoList){
        let storage = window.localStorage;
        let currentTasks = [];
        currentTasks = JSON.parse(storage.getItem(key));
        if (currentTasks===null){
            return;
        }
        for (item of currentTasks){
            let todoItem = createTodoItem(item.name,item.done);
            todoItem.doneButton.addEventListener('click', function(){
                todoItem.item.classList.toggle('list-group-item-success');
                changeDoneInLocStorage(todoItem.name,key);
            })

            todoItem.deleteButton.addEventListener('click', function(){
                if(confirm("Are you sure?")){
                    todoItem.item.remove();
                    removeItemFromLocalStorage(todoItem.name, key);
                }
            })

            todoList.append(todoItem.item);
        }
        
    }

    function addItemToLocalStorage(name,done,key){
        let storage = window.localStorage;
        let currentTasks = [];
        currentTasks = JSON.parse(storage.getItem(key));
        if (currentTasks === null){
            currentTasks = [];
        }
        let newItem = {
            name: name,
            done: done,
        }
        currentTasks.push(newItem);
        storage.setItem(key,JSON.stringify(currentTasks));
    }

    function removeItemFromLocalStorage(name,key){
        let storage = window.localStorage;
        let currentTasks = [];
        currentTasks = JSON.parse(storage.getItem(key));
        //Searching item to delete in local storage
        let itemId = 0;
        for(item of currentTasks){
            if (item.name === name){
                currentTasks.splice(itemId,1);
                storage.setItem(key,JSON.stringify(currentTasks));
                return;
            }
            itemId++;
        }
    }

    function changeDoneInLocStorage(name,key){
        let storage = window.localStorage;
        let currentTasks = [];
        currentTasks = JSON.parse(storage.getItem(key));
        let itemId = 0;
        for(item of currentTasks){
            if (item.name === name){
                switch (item.done){
                    case 'true':
                        item.done = "false";
                        break;
                    case 'false':
                        item.done = "true";
                }
                storage.setItem(key,JSON.stringify(currentTasks));
                return;
            }
            itemId++;
        }
    }

    function createTodoApp(container,title = 'To-do list',key){ 
        let todoAppTitle = createAppTitle(title);
        let todoItemForm = createTodoItemForm();
        let todoList = createTodoList();

        container.append(todoAppTitle);
        container.append(todoItemForm.form);
        container.append(todoList);

        createItemsFromLocStorage(key,todoList);

        todoItemForm.button.disabled = true;

        todoItemForm.form.addEventListener('input', function(){
            todoItemForm.button.disabled = false;
        })

        todoItemForm.form.addEventListener('submit', function(e){
            e.preventDefault();
            
            if(!todoItemForm.input.value){
                return;
            }
            let todoItem = createTodoItem(todoItemForm.input.value);
            addItemToLocalStorage(todoItemForm.input.value,"false",key);
            todoItem.doneButton.addEventListener('click', function(){
                todoItem.item.classList.toggle('list-group-item-success');
                changeDoneInLocStorage(todoItem.name,key);
            })

            todoItem.deleteButton.addEventListener('click', function(){
                if(confirm("Are you sure?")){
                    todoItem.item.remove();
                    removeItemFromLocalStorage(todoItem.name, key);
                }
            })

            todoList.append(todoItem.item);
            todoItemForm.button.disabled = true;
            todoItemForm.input.value = '';
        })
    } 
    window.createTodoApp = createTodoApp;
})();  