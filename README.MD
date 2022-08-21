# USN
A live feed for USN token event on NEAR blockchain, supports filter by mint / burn / transfer event and owner address.

Available at https://www.near-live-feed-usn.com/

# Introduction
USN is a major stablecoin native on NEAR.

This is a pure frontend project built using react and typescript. It listens to an existing websocket which has indexed NEAR protocol data and fetch USN related events.

This project is for me to learn more on frontend development and how to work with blockchain related stuff.

# Quick Start
Commands are pretty much the same as create-react-app.

Run `yarn` to install dependency.

Run `yarn start` to run it locally.

Run `yarn test` to launch test runner.

# Deployment 
This app is deployed using AWS amplify which will be triggered whenever `main` branch is updated. The deployed version is at https://www.near-live-feed-usn.com/

# Acknowledge
This project is inspired by [burrow-live-feed](https://github.com/NearDeFi/burrow-live-feed) and [nft-live-feed](https://github.com/evgenykuzyakov/nft-mints), which tracks burrow (a lending protocol on NEAR) events and NFT minting events using the same websocket.

The above 2 projects are written in javascript, so I decided to write mine in typescript with tsx for fun, I also defined some schema for event and filter to make it easier with typescript.

# How it works 
The websocket is implemented in [events-api](https://github.com/evgenykuzyakov/event-api)

A simple doc on event format available at https://thewiki.near.page/events-api

# Test Websocket
You can play with the websocket to see what kind of event are supported.
Also NEAR document is a good place to find available event. For example the fungible token standard [NEP-141](https://nomicon.io/Standards/Tokens/FungibleToken/Core) defines 3 interfaces, hence 3 events: mint / burn / transfer.

Online websocket testing tool http://livepersoninc.github.io/ws-test-page/

sample event
```
{
   "secret":"usn",
   "filter":{
      "status":"SUCCESS",
      "account_id":"usn",
      "event":{
         "standard":"nep141",
         "event":"ft_mint"
      }
   },
   "fetch_past_events":1
}
```

sample response
```
17:22:38 : 
{
   "secret":"usn",
   "events":[
      {
         "block_height":"68160372",
         "block_hash":"G62ipjcNFfDgQonZDjqFPiZYriQ3yZ6AeKgSjEsuvqyU",
         "block_timestamp":"1655767538326331510",
         "block_epoch_id":"GX8x79Y9L7mowMATZcrTqcDH759o2DH3ANGpaMTBtoqf",
         "receipt_id":"6fGRWGa8trq6uWhUnzaAqsx9E97pm3PPkcXo6Vzeyqkg",
         "log_index":0,
         "predecessor_id":"usn",
         "account_id":"usn",
         "status":"SUCCESS",
         "event":{
            "standard":"nep141",
            "version":"1.0.0",
            "event":"ft_mint",
            "data":[
               {
                  "owner_id":"usn-unofficial.poolowner.near",
                  "amount":"157635719211845688753"
               }
            ]
         }
      }
   ],
   "note":"past"
}
```
