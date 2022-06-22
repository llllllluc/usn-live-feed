# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `yarn eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).




USN
==================

Update for deployment.

Quick Start
===========

`yarn install`

Exploring The Code
==================

Single page web app. GEtting burrow event data from a websocket.

Deploy
======

Troubleshooting
===============



key is how to read chain data

in this case, how to read burrow contract data

# Functionalities
single page 
    live borrow event
    can filter liquidation event only
    can filter by account

only show most recent x blocks

# How does it work
based on websocket
there's an indexing server 
https://github.com/evgenykuzyakov/event-api
https://thewiki.near.page/events-api

use wscat
```
wscat -c 'wss://events.near.stream/ws'
```

send msg
```
{
   "secret":"brrr",
   "filter":{
      "status":"SUCCESS",
      "account_id":"contract.main.burrow.near",
      "event":{
         "standard":"burrow",
         "event":"liquidate"
      }
   },
   "fetch_past_events":1
}
```

receive msg
```
"20":"24":"00":{
   "secret":"brrr",
   "events":[
      {
         "block_height":"68098673",
         "block_hash":"8GYJSqYDDW7vwaSFEoot1N5bdCe1RMS6wcuxSeGZ7eQf",
         "block_timestamp":"1655692237012178438",
         "block_epoch_id":"BCiXbp8xLtas7RSEbTmZAsW8cRBJnQa6CcyN7GmsGArm",
         "receipt_id":"4jnifzRzibArXFe47VSPfoH7awuBahmXSUbDmoXgqbok",
         "log_index":3,
         "predecessor_id":"priceoracle.near",
         "account_id":"contract.main.burrow.near",
         "status":"SUCCESS",
         "event":{
            "standard":"burrow",
            "version":"1.0.0",
            "event":"liquidate",
            "data":[
               {
                  "account_id":"thankyouser.near",
                  "liquidation_account_id":"odranoelzerep.near",
                  "collateral_sum":"36.930896572127488365435",
                  "repaid_sum":"36.5586047267533242662238"
               }
            ]
         }
      }
   ],
   "note":"past"
}
```
