import { getByText, getByPlaceholderText, fireEvent } from '@testing-library/dom';

// The main functionality to test (the script file)
import './script.js';

describe('Todo App', () => {
    let inputField, addButton, todoList;

    beforeEach(() => {
        document.body.innerHTML = `
            <div class="main-container">
                <div class="ta-container">
                    <div class="heading">
                        <h1>Todo App</h1>
                    </div>
                    <div class="ta-wrapper">
                        <div class="input-wrapper">
                            <input type="text" id="todo-input">
                            <button id="submit">Add</button>
                        </div>
                        <div class="todo-lists"></div>
                    </div>
                </div>
            </div>
        `;

        // Set references to the elements
        inputField = document.querySelector('#todo-input');
        addButton = document.querySelector('#submit');
        todoList = document.querySelector('.todo-lists');
    });

    test('should add a new todo item', () => {
        // Arrange
        const todoText = 'Test Todo Item';
        inputField.value = todoText;

        // Act
        fireEvent.click(addButton);

        // Assert
        expect(todoList.children.length).toBe(1);
        expect(getByText(todoList, todoText)).toBeInTheDocument();
    });

    test('should mark a todo item as done', () => {
        // Arrange
        const todoText = 'Test Todo Item';
        inputField.value = todoText;
        fireEvent.click(addButton);

        // Act
        const doneButton = todoList.querySelector('.fa-check');
        fireEvent.click(doneButton);

        // Assert
        const todoItem = todoList.querySelector('input.text');
        expect(todoItem.classList.contains('done')).toBe(true);
    });

    test('should delete a todo item', () => {
        // Arrange
        const todoText = 'Test Todo Item';
        inputField.value = todoText;
        fireEvent.click(addButton);

        // Act
        const deleteButton = todoList.querySelector('.fa-trash');
        fireEvent.click(deleteButton);

        // Assert
        expect(todoList.children.length).toBe(0);
    });

    test('should edit a todo item', () => {
        // Arrange
        const todoText = 'Test Todo Item';
        inputField.value = todoText;
        fireEvent.click(addButton);

        // Act: click edit button
        const editButton = todoList.querySelector('.fa-pen-to-square');
        fireEvent.click(editButton);

        // Change the todo item text
        const todoInput = todoList.querySelector('input.text');
        fireEvent.change(todoInput, { target: { value: 'Edited Todo Item' } });

        // Click the edit button again to save
        fireEvent.click(editButton);

        // Assert
        expect(todoInput.value).toBe('Edited Todo Item');
        expect(todoInput.hasAttribute('readonly')).toBe(true);
    });
});
