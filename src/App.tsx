import React from 'react';
import logo from './logo.svg';
import './App.css';

import { useEffect, useState } from "react";
// import NftToken from "./NftToken";

let globalIndex = 0;

const usnMintAndBurnFilter = [{
  status: "SUCCESS",
  account_id: "usn",
  event: {
    standard: "nep141",
    event: "ft_mint",
  },
}, {
  status: "SUCCESS",
  account_id: "usn",
  event: {
    standard: "nep141",
    event: "ft_burn",
  },
}];

let reconnectTimeout: NodeJS.Timeout | null = null;

function listenToNFT(processEvents) {
  const scheduleReconnect = (timeOut: number) => {
    if (reconnectTimeout) {
      clearTimeout(reconnectTimeout);
      reconnectTimeout = null;
    }
    reconnectTimeout = setTimeout(() => {
      listenToNFT(processEvents);
    }, timeOut);
  };

  if (document.hidden) {
    scheduleReconnect(1000);
    return;
  }

  const ws = new WebSocket("wss://events.near.stream/ws");

  ws.onopen = () => {
    console.log(`Connection to WS has been established`);
    ws.send(
      JSON.stringify({
        secret: "usn",
        filter: usnMintAndBurnFilter,
        fetch_past_events: 10,
      })
    );
  };
  ws.onclose = () => {
    console.log(`WS Connection has been closed`);
    scheduleReconnect(1);
  };
  ws.onmessage = (e) => {
    const data = JSON.parse(e.data);
    processEvents(data.events);
  };
  ws.onerror = (err) => {
    console.log("WebSocket error", err);
  };
}

function processEvent(event) {
  return (event?.event?.data[0]?.token_ids || []).map((tokenId) => ({
    time: new Date(parseFloat(event.block_timestamp) / 1e6),
    contractId: event.account_id,
    ownerId: event.event.data[0].owner_id,
    tokenId,
    isTransfer: event.event.event === "nft_transfer",
    index: globalIndex++,
  }));
}

function App() {
  const [usnEvents, setUsnEvents] = useState([]);

  // Setting up NFTs
  useEffect(() => {
    const processEvents = (events) => {
      // console.log(events);
      events = events.flatMap(processEvent);
      events.reverse();
      setUsnEvents((prevState) => {
        const newNfts = [
          ...events.filter(
            (event) =>
              prevState.length === 0 ||
              event.time.getTime() > prevState[0].time.getTime()
          ),
          ...prevState,
        ];
        return newNfts.slice(0, 100);
      });
    };

    listenToNFT(processEvents);
  }, []);

  return (
    <div>
      <h1>Live NFT feed</h1>
      <div className="card-wrapper">
        {usnEvents.map((usnEvent) => {
          return (
            <NftToken key={`${usnEvent.index}`} nft={usnEvent} />
          );
        })}
      </div>
    </div>
  );
}

export default App;
