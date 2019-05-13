# demo_deploy_todo_app

*Models*
#### User:
    {
      name: String,
      email: { type: String, unique: true },
      password: String,
      tasks: [Task...],
      tokens: [String...]
    }

*and the <b>Task</b>..*

     {
       id: Number,
       title: String,
       description: String,
       isDone: Boolean
      }
   

### api descriptions:

1. <b>LOGIN [POST]:</b> `/api/login/`
  required login data:
  these must be included in `request body`
  example:
      ```
      {
      "email": "youremail@domain.com",
      "password":"complexPasswords"
      }
      ```
   after successfull login [not by using previous `token`]  you'll get a new token back.
   
   => LOGIN  usign Authorization token: 
      add `Authorization` token in your header or `x-access-token` you may preceed the token with `Bearer`

2. <b>REGISTER [POST]:</b> `/api/register/`
  required register data:
  these must be included in `request body`
  example:
      ```
      {
      "name": "Full Name",
      "email": "youremail@domain.com",
      "password":"complexPasswords"
      }
      ```
   
   => REGISTER using `Authorization`
      add `Authorization` token in your header or `x-access-token` you may preceed the token with `Bearer`
3. <i> <b> LGOUT [POST]: </b> </i>  `/api/logout` [need to be authenticated first] 
      to end all active `sessions` add these to the `body` of your `POST request`
      ```
      "endAllSession" : true
      ```
4.  <b>Adding Task: [POST]:</b> `/api/tasks/`
    use this format in your `request body` to insert a task:
    ```
    {
      "id":"anything012345",
      "title":"Buy apples",
      "description":"Today need to do this, it's important",
      "isDone":"false"
      }
    ```

5. <b> Getting list of all tasks[GET]: </b> `/api/tasks/` *authorization required*
      you will be returned an array of Task type

### available routes & allowed METHODS: 
  * `/api/login/`
    * `POST`
  * `/api/logout` *requires authentication*
    * `POST`
  * `/api/register`
    * `POST`
  * `/api/tasks` *requires authentication*
    * `GET`
    * `POST`
    * `PATCH`
    * `DELETE` 

## Incase of bugs please open new issue under that tab :) 

### Task route is under construction 
   #### update: 
        * Add task is fixed
        * List task is fixed
