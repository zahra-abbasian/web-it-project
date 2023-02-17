**The University of Melbourne**

# INFO30005 – Web Information Technologies

# Group Project Repository

## Table of contents

- [Final Submission](#final-submission)
- [Team Members](#team-members)
- [Deliverable 3](#deliverable-3)
- [Login Details](#login-details)
- [General Info](#general-info)
- [Technologies](#technologies)
- [Error handling](#error-handling)
- [Postman Requests](#postman-requests)
- [Running Trukk](#Running-Trukk)

## Final Submission

We used React, so our frontend and backend are hosted seperately.

Frontend URL: https://dreamy-lumiere-32e9b1.netlify.app/
Backend URL: https://trukk-server.herokuapp.com/

Commit ID to mark: 19acfb4be3f60d15b4137e29b390c0b6f6a78ba3

MongoDB connection string: CONNECTION_URL=mongodb+srv://jdubar:joshua12343@trukk.o0fby.mongodb.net/Trukk?retryWrites=true&w=majority

Running App locally instructions for marker:
- Download the zip file from canvas (so that you have access to all environment  variables)
- make sure you are using node v14.5 or greater
- **Instructions to run server:**
    - make sure you are in the server directory (```cd server```)
    - run ```npm install``` to install required dependencies
    - run `npm run dev` to start the server! 🚀
- **Instructions to run client:**
    - make sure you are in the client directory (```cd client```)
    - run ```npm install``` to install required dependencie
    - run ```npm start``` to start the client! 🚀
- **Testing instructions:**
    - in server directory run ```npm run test```
    - if all tests pass you're good to go!

## Deliverable 3

We decided to use React for our frontend. The server/backend files are located in the server directory, and the frontend/client is located in the client directory. We decided to use Create React App for simplicity (instead of a framework such as Next.js) as many of our members have not used React before.

Because we used Mobile first design while developing this deliverable, some pages (such as order confirmation/order details) look good on mobile, but may look a bit strange on desktop (although still completely functional and usable), we plan to re-design these pages later on to look better, but for now we decided to focus on functionality over aesthetics.

Andy Lin, Joshua Dubar and Stefan Marbun worked on Deliverable 3, each of us implemented both the frontend and backend functionalities for the features we worked on.

Stefan Marbun: Login page
Joshua Dubar: Menu and Order Confirmation
Andy Lin: Order details and View all orders

URL to Deliverable 3 app: https://dreamy-lumiere-32e9b1.netlify.app/

## Login Details

Login details for the Login page are:
Username: stefanmarbun12@gmail.com
password: xxx

As discussed in the tutorial, we have not yet properly implemented sessions, for now we just have a local storage variable which we are using to check whether or not the user is already logged in or not. Before the final deliverable is due we plan to implement sessions using either JWT or cookies in order to make our authentication more secure. We also have not yet implemented a log out functionality, In the meantime, to log out, you can go to the developer tools and go to applications and localstorage to delete the session. Then you can try and log back in.

## Team Members

| Name               |                                              Task (App server mockup)                                               | State |
| :----------------- | :-----------------------------------------------------------------------------------------------------------------: | ----: |
| Andy Lin           | [Setting van status (vendor sends location, marks van as ready-for-orders) + error middleware](#setting-van-status) |  Done |
| Joshua Dubar       |                [View menu of snacks (including pictures and prices) + setup ](#view-menu-of-snacks)                 |  Done |
| Stefan Marbun      |                                  [View details of a snack](#getting-snack-details)                                  |  Done |
| Zhirui Xin         |                     [Show list of all outstanding orders](#show-list-of-all-outstanding-orders)                     |  Done |
| Reynard Kolopaking |                     [Customer starts a new order by requesting a snack](#creating-a-new-order)                      |  Done |
| Zahra Abbasian     |           [Mark an order as "fulfilled" (ready to be picked up by customer)](#marking-order-as-fufilled)            |  Done |

## General info

This repository contains the server (and soon client) for Trukk! An app used by both vendors and clients in order to assist in creating a seamless ordering process to Trukk vans.
MongoDB connection string: mongodb+srv://jdubar:joshua12343@trukk.o0fby.mongodb.net/Trukk?retryWrites=true&w=majority

## Technologies

Project is created with:

- NodeJS
- MongoDB

## Error Handling

- all error handling was done through a middleware created in our app.js file
- This first section handles incorrect routes, if a user tries to send a request to a route which doesn't exist, then they will receive a 404 error
- ```
   // bad request error handling
    app.use((req, _, next) => {
      const err = new Error(`Route: ${req.originalUrl} does not exist.`);
      err.status = 404;
      next(err);
    });
  ```
- In this next section, we check if the error is related to incorrect data being passed into the request body/parameters, if so then we respond with a 400 error (bad request), otherwise we respond with whatever the error status is (if there is one), otherwise a 500 error to suggest that there is probably an issue with the db connection/server.
- ```
    // general error handling
    app.use((err, req, res, _) => {
      // Handling invalid req.params.id or invalid geolocation (16755)
      if (
        err?.name === "CastError" ||
        err?.name === "ValidationError" ||
        err?.code === 16755
      ) {
        err.status = 400;
        err.message = "Bad Request";
      }
      res.status(err.status || 500).json({
        status: "fail",
        error: err.message,
      });
    });
  ```

## Postman Requests

- #### View menu of snacks

  - Functionality: A Get request where any user can get an array of all of the snacks on the menu
  - Request response:

    - A successful request will respond with a 200 status, meaning that the resource has been successfully fetched and transmitted in the message body.
    - Each object returned in the array should contain:
      - \_id: the ObjectId of the snack
      - name: a string containing the name of the snack
      - price: a double with the value being the price of the snack
      - image: a url to an image that will be displayed on the menu for this item.
    - Example of what a successful response body looks like:

    - ```
      [
           {
               "_id": "60664bf1f1cba56e8533b99d",
               "name": "Cappuccino",
               "price": 4,
               "image": "https://i.ibb.co/V9Frdc4/cappuccino.jpg"
           },
           {
               "_id": "60664c8f3d6ccb6ec89701d5",
               "name": "Flat White",
               "price": 4.5,
               "image": "https://i.ibb.co/HtbR369/flat-White.jpg"
           },
           .
           .
           .
           {
               "_id": "60664cf03d6ccb6ec89701db",
               "name": "Big Cake",
               "price": 30,
               "image": "https://i.ibb.co/VQmKv81/bigCake.jpg"
           }
       ]
      ```
    - Request URL:
      - Example: GET "https://trukk-server.herokuapp.com/customer/snacks"
      - this url will be accessed by a customer and is used to get all the snacks on the menu, thus a GET request.

- #### Creating a New Order
  - Functionality: A Post request where a user can create a new order
  - Request description:
    - "customerId" is the ID of the customer that would like to create the order
    - "vendorId" is the ID of the van/vendor that the customer would like to order from
    - "snacks" is an array containing snackOrder objects. The snackOrder object contains information regarding the snack's ID as well as the quantity of that particular snack that the user would like to order
    - "totalPrice" is the total price of all the snacks that the customer would like to order
    - Example:
    - ```
      {
        "customerId": "607eb8e780ba106889cf15b6",
        "vendorId": "60730b61ea1c7a522c4e2303",
        "snacks": [{"snackId": "60664c8f3d6ccb6ec89701d5",
                        "quantity": 2}],
        "totalPrice": 9
      }
      ```
  - Request URL:
    - Example: POST "https://trukk-server.herokuapp.com/customer/orders/"
    - This URL will be accessed by the customer to start a new order
  - Response description:
    - "success" is a boolean value that tells us if the post request was successful
    - "data" is the object that will be stored in the database
    - Example:
    - ```
      {
        "success": true,
        "data": {
            "totalPrice": 9,
            "applyDiscount": false,
            "status": "outstanding",
            "_id": "60820e09f985b30004ec74c1",
            "customerId": "607eb8e780ba106889cf15b6",
            "vendorId": "60730b61ea1c7a522c4e2303",
            "snacks": [
                {
                    "_id": "60820e09f985b30004ec74c2",
                    "snackId": "60664c8f3d6ccb6ec89701d5",
                    "quantity": 2
                }
            ],
            "dateStart": "2021-04-23T00:00:09.813Z",
            "__v": 0
        }
      }
      ```
  - Assumptions:
    - For this section we're assuming that the customer ID as well as the vendor ID sent by the request should be valid and shouldn't cause errors as stated in the specifications that only logged in customers can order from registered vans on the app. However, we added error handling to handle invalid IDs nonetheless.
    - The default value for dateStart is set to the current date and time, as the order is created as soon as the request is sent
    - The default value for the order's status is set to "outstanding", and will change to "ready" and "fulfilled" as the order progresses and ultimately is completed
    - The default value for applyDiscount is set to false as the time limit of 15 minutes has not been exceeded for a discount to be given to the customer. Only when that condition is met will the value be turned to true.
    - Other values like rating and dateFinished do not have default values and are left empty as the order has not been completed yet. Once the order is finished, the date can be recorded and the customer can leave a rating to be stored in the colleciton.
    - The accuracy of the totalPrice (sum of all the snacks) will be handled in the frontend/client side to ensure the price is accurate.
- #### Setting Van Status
  - Functionality: A patch/update request where the vendor can either:
    - Send their geo-location.
    - Mark their van as either ready for order or not ready for order.
    - Send their address description.
  - Request description:
    - "address" is a string description of where they're located.
    - "location" is their geo-location, which should be sent as a [GeoJSON object](https://mongoosejs.com/docs/geojson.html). It takes two essential parameters, its type and its coordinate. The type indicates which type of geo-json object we want (which in our case, we want a "Point") and the coordinates is represented as an array of two numbers, the first number being the longitude and the latter being the latitude.
    - "ready" is a boolean to indicate whether the van is marked ready for orders or not. True means they're ready, and false means the van is not ready for order.
    - Example:
    - ```
      {
          "address": "on Grattan st outside Melbourne Uni",
          "ready": true,
          "location": {
              "type": "Point",
              "coordinates": [30, -90]
          }
      }
      ```
  - Request type:
    - We made it a patch request rather than a put request. This way, our request can send optional parameters. For example, if the vendor moved their location but is still ready for orders, they can send a request with just an address and a location. Or if they send a location, ready and address, but later want to update/clarify their address description, the request does not require for us to send a ready and location in the body parameter again.
  - Request URL:
    - Example: PATCH "https://trukk-server.herokuapp.com/vendor/van/status/6073132260a08dbb48acd5f6"
    - This means we will update the vendor status for a van with an objectId of "6073132260a08dbb48acd5f6"
  - Response description:
    - "success" is a boolean value that tells us if the patch request was successful. Note that it will return false if the request had no erroes, but there were no new updates to the status of a van. This can occur when you send the request twice in a row.
    - "data" is the status of the van after the update request is done.
    - Example:
    - ```
      {
        "success": true,
        "data": {
            "location": {
                "type": "Point",
                "coordinates": [
                    30,
                    -90
                ]
            },
            "address": "on Grattan st outside Melbourne Uni",
            "ready": false,
            "_id": "6073132260a08dbb48acd5f6",
            "name": "yanghak"
        }
      }
      ```
  - Testing and validation:
    - An incorrect parameter id in the URL eg. `12345` instead of `6073132260a08dbb48acd5f6` will result in a 400 Bad Request Error.
    - Entering coordinates outside the range of longitdude (-90, 90) and latitude (-180, 180) will result in a 400 Bad Request Error.
    - Entering a type that is not a "Point" for location type will result in 400 Bad Request Error.
- #### Marking order as fufilled

  - Funcionality: A patch/update request where the vendor updates an order to have a status of fufilled.
  - Request description:
    - The request has no body since the request is only made to a valid order to change its status to be fufilled and to add a dateFinished. Thus it does not need a body in the request.
  - Request type:
    - A patch request where we set the status of a valid orderId to be fufilled. The request will also update the dateFinished field to be Date.now() which will be the date of when the request was sent.
  - Request URL:
    - Example: PATCH "https://trukk-server.herokuapp.com/vendor/orders/updateFulfilled/608150e7faa8560004f909b0"
    - This means we will update the order status with an objectId of "608150e7faa8560004f909b0"
  - Response description:
    - "success" is a boolean value telling that the patch request was successful. It will return false if the request had no errors, but there were no new updates to the status of an order. This can happen when sending the request twice in a row.
    - the status of the order after this update request is changed to "fulfilled".
    - Note that the "dateFinished" has set to the date and time of this update request.
    - Example:
    - ```
      {
        "success": true,
        "data": {
            "totalPrice": 19,
            "applyDiscount": false,
            "status": "fulfilled",
            "_id": "608150e7faa8560004f909b0",
            "customerId": "607eb8e780ba106889cf15b6",
            "vendorId": "6073132260a08dbb48acd5f6",
            "snacks": [
                {
                  "_id": "608150e7faa8560004f909b1",
                  "snackId": "60664ce23d6ccb6ec89701da",
                  "quantity": 1
                },
                {
                  "_id": "608150e7faa8560004f909b2",
                  "snackId": "60664ca33d6ccb6ec89701d6",
                  "quantity": 2
                },
                {
                  "_id": "608150e7faa8560004f909b3",
                  "snackId": "60664cc33d6ccb6ec89701d8",
                  "quantity": 2
                }
            ],
            "dateStart": "2021-04-22T10:33:11.471Z",
            "rating": 3,
            "__v": 0,
            "dateFinished": "2021-04-22T10:41:41.645Z"
        }
      }
      ```
  - Testing and validation:
    - Any parameter id in the URL which does not exist for an order in the database will result in a 400 Bad Request Error.

- #### Getting Snack Details
  - Functionality: A get request where a user can access all the details of a snack.
  - Request response:
    - "success" is a boolean for if the request is successful (ie. returns true if a snack with the objectId is found, false otherwise or has an error)
    - "name" is a string defining the type of snack.
    - "price" is a number for how much the snack costs.
    - "image" is the string of a web address that returns an image of the snack when opened. We used the site imgbb.com to host our images.
    - Example:
    - ```
      {
        "success": true,
        "data": {
            "_id": "60664cd43d6ccb6ec89701d9",
            "name": "Fancy Biscuit",
            "price": 3.5,
            "image": "https://i.ibb.co/VY1QXXb/fancy-Biscuit.jpg"
        }
      }
      ```
  - Request URL:
    - Example: GET "https://trukk-server.herokuapp.com/customer/snacks/60664cd43d6ccb6ec89701d9"
    - This means we will return the details of the snack with an objectId of "60664bf1f1cba56e8533b99d"
- #### Show List Of All Outstanding Orders

  - Functionality: A get request where vendor can get a list of all outstanding orders.
  - Request Response:

    - A successful request will respond with the data of every outstanding order associated with the vendor ID.
    - each object returned as an outstanding order including:
      - id：the ObjectId of each order.
      - customerId: the Objectid of the customer.
      - vendorId: the ObjectId of the vendor.
      - snacks: An array containing snacks the customer ordered.
      - applyDiscount: a boolean to show if discount is applied.
      - dateStart: a date type recording when the order is placed.
      - totalPrice: a number showing how much this order cost.
      - status: A string deciding the status of the order

  - Example of a successful response:
  - ```
       {
        "success": true,
        "data": [
            {
                "_id": "608150e7faa8560004f909b0",
                "totalPrice": 19,
                "applyDiscount": false,
                "status": "outstanding",
                "customerId": "607eb8e780ba106889cf15b6",
                "vendorId": "6073132260a08dbb48acd5f6",
                "snacks": [
                    {
                        "_id": "608150e7faa8560004f909b1",
                        "snackId": "60664ce23d6ccb6ec89701da",
                        "quantity": 1
                    },
                    {
                        "_id": "608150e7faa8560004f909b2",
                        "snackId": "60664ca33d6ccb6ec89701d6",
                        "quantity": 2
                    },
                    {
                        "_id": "608150e7faa8560004f909b3",
                        "snackId": "60664cc33d6ccb6ec89701d8",
                        "quantity": 2
                    }
                ],
                "dateStart": "2021-04-22T10:33:11.471Z",
                "rating": 3,
                "__v": 0
            },
            {
                "_id": "6081511dfaa8560004f909b4",
                "totalPrice": 15,
                "applyDiscount": false,
                "status": "outstanding",
                "customerId": "607eb8e780ba106889cf15b6",
                "vendorId": "6073132260a08dbb48acd5f6",
                "snacks": [
                    {
                        "_id": "6081511dfaa8560004f909b5",
                        "snackId": "60664ce23d6ccb6ec89701da",
                        "quantity": 1
                    },
                    {
                        "_id": "6081511dfaa8560004f909b6",
                        "snackId": "60664ca33d6ccb6ec89701d6",
                        "quantity": 2
                    }
                ],
                "dateStart": "2021-04-22T10:34:05.646Z",
                "__v": 0,
                "dateFinished": "2021-04-22T23:58:05.653Z"
            },
            {
                "_id": "6081518cfaa8560004f909ba",
                "totalPrice": 13,
                "applyDiscount": false,
                "status": "outstanding",
                "customerId": "607ec65880ba106889cf15b8",
                "vendorId": "6073132260a08dbb48acd5f6",
                "snacks": [
                    {
                        "_id": "6081518cfaa8560004f909bb",
                        "snackId": "60664c8f3d6ccb6ec89701d5",
                        "quantity": 2
                    },
                    {
                        "_id": "6081518cfaa8560004f909bc",
                        "snackId": "60664cb23d6ccb6ec89701d7",
                        "quantity": 1
                    }
                ],
                "dateStart": "2021-04-22T10:35:56.872Z",
                "__v": 0
            },
            {
                "_id": "608151b6faa8560004f909bd",
                "totalPrice": 11,
                "applyDiscount": false,
                "status": "outstanding",
                "customerId": "607ec65880ba106889cf15b8",
                "vendorId": "6073132260a08dbb48acd5f6",
                "snacks": [
                    {
                        "_id": "608151b6faa8560004f909be",
                        "snackId": "60664cb23d6ccb6ec89701d7",
                        "quantity": 1
                    },
                    {
                        "_id": "608151b6faa8560004f909bf",
                        "snackId": "60664cd43d6ccb6ec89701d9",
                        "quantity": 2
                    }
                ],
                "dateStart": "2021-04-22T10:36:38.711Z",
                "__v": 0
            }
        ]
    }
    ```

  - Request URL:
    - Example: GET "https://trukk-server.herokuapp.com/vendor/orders/outstanding/6073132260a08dbb48acd5f6"
    - This url will be accessed by a vendor and get the info of all outstanding orders as a list according to vendors' ObjectId.

## Running Trukk

### Running the server

- clone this repository
- cd into the server directory
- run `npm install`
- create a .env file inside the server directory (in the root folder)
- within this .env file, enter `CONNECTION_URI=<Your MongoDB connection string>` in order to connect the application to a MongoDB database
- run `npm run dev` to start the server! 🚀

**Tasks completed:**

- [x] Read the Project handouts carefully
- [x] User Interface (UI)mockup
- [x] App server mockup
- [x] Front-end + back-end (one feature)
- [x] Complete system + source code
- [x] Report on your work(+ test1 feature)
