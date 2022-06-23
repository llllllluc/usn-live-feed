import React from "react";
import TimeAgo from "timeago-react";
import logo from "./logo.svg";
import "./App.css";

import { useEffect, useState } from "react";

import { SocketEvent } from "./schema/socket_event";
import { UsnEvent } from "./schema/usn_event";

let globalIndex = 0;

const usnMintAndBurnFilter = [
  {
    status: "SUCCESS",
    account_id: "usn",
    event: {
      standard: "nep141",
      event: "ft_mint",
    },
  },
  {
    status: "SUCCESS",
    account_id: "usn",
    event: {
      standard: "nep141",
      event: "ft_burn",
    },
  },
];

let reconnectTimeout: NodeJS.Timeout | null = null;

function listenToUsn(processEvents: (socketEvents: SocketEvent[]) => void) {
  const scheduleReconnect = (timeOut: number) => {
    if (reconnectTimeout) {
      clearTimeout(reconnectTimeout);
      reconnectTimeout = null;
    }
    reconnectTimeout = setTimeout(() => {
      listenToUsn(processEvents);
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
    const socketEvents: SocketEvent[] = JSON.parse(e.data).events;
    processEvents(socketEvents);
  };
  ws.onerror = (err) => {
    console.log("WebSocket error", err);
  };
}

function processEvent(event: SocketEvent): UsnEvent {
  return {
    time: new Date(parseFloat(event.block_timestamp) / 1e6),
    event: event.event.event,
    index: globalIndex++,
  };
}

function App() {
  const [usnEvents, setUsnEvents] = useState<UsnEvent[]>([]);

  // Setting up NFTs
  useEffect(() => {
    const processEvents = (socketEvents: SocketEvent[]) => {
      // console.log(events);
      const usnEvents = socketEvents.flatMap(processEvent);
      usnEvents.reverse();
      setUsnEvents((prevState) => {
        const newUsnEvents = [
          ...usnEvents.filter(
            (usnEvent: UsnEvent) =>
              prevState.length === 0 ||
              usnEvent.time.getTime() > prevState[0].time.getTime()
          ),
          ...prevState,
        ];
        return newUsnEvents.slice(0, 100);
      });
    };

    listenToUsn(processEvents);
  }, []);

  return (
    <div className="container">
      <h1>Live USN feed</h1>
      <div className="table-responsive">
        <table className="table align-middle">
          <tbody>
            {usnEvents.map((usnEvent) => {
              // const tokenAccountId = action.data?.tokenId || DefaultTokenId;
              return (
                <tr key={usnEvent.index}>
                  <td className="col-1">
                    <TimeAgo datetime={usnEvent.time} />
                  </td>
                  <td className="col-3">
                    <SocialAccount
                      accountId={action.accountId}
                      clickable
                      filterLink={setFilterAccountId}
                    />
                  </td>
                  <td className="col-3">{showAction(action)}</td>
                  <td className="col-1 text-end">
                    <TokenBalance
                      clickable
                      tokenAccountId={tokenAccountId}
                      adjustForBurrow
                      balance={Big(action.data?.amount || 0)}
                    />
                  </td>
                  <td className="col-3">
                    <TokenBadge tokenAccountId={tokenAccountId} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;
