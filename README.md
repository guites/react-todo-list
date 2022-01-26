# Basic react todo app

This is a basic to-do app using reactjs. It persists data on the client using localStorage.

This is a study project. 

## Check the project out

There are 5 main functionalities with which the user can interact:

1. Creating new tasks.

All fields are required. You may not create two tasks with the same description for the same day.

2. Editing tasks.

Editing is subject to the same validations above, as it reuses the form component.

3. Deleting tasks.

There is a confirmation modal to avoid mistakenly deleting notes. 

4. Sorting existing notes.

Notes can be sorted by id or date.

5. All CRUD actions are signalized by a toast pop up.

### Tests

Components have an equivalent .test.js file in its folder.

#### improvements

1. Tasks that are in the past must be marked as complete.

2. Accept nested tasks, as in, a task can bear a sublist of tasks that must be checked before it is considered complete.

3. Tasks that are in the past with non-completed subtasks must be marked as late/delayed

4. Subtasks cannot have a date greater than its parent task.

5. Deploy via github pages.

6. Subject deploy to passing tests.
