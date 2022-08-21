import TimeAgo from "timeago-react";
import "./App.scss";
import Big from "big.js";
import Select, { MultiValue } from "react-select";
import { useEffect, useState } from "react";
import { bigToString } from "./data/utils";
import { SocketEvent } from "./schema/socket_event";
import { UsnEvent } from "./schema/usn_event";
import SocialAccount from "./components/social_account/SocialAccount";
import {
  addEventToFilter,
  addUserIdToFilter,
  getFtBurnFilter,
  getFtMintFilter,
  getNoEventFilter,
} from "./utils/filter";

let globalIndex = 0;
let reconnectTimeout: NodeJS.Timeout | null = null;
let filterTypingTimeout: NodeJS.Timeout | null = null;
let usnFilters = [getFtMintFilter(), getFtBurnFilter()];
let ws: WebSocket | null = null;
const socketUrl = "wss://events.near.stream/ws";

const listenToUsn = (processEvents: (socketEvents: SocketEvent[]) => void) => {
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

  // if (ws) {
  //   ws.close();
  //   return;
  // }

  ws = new WebSocket(socketUrl);

  ws.onopen = () => {
    console.log(`Connection to WS has been established`);
    // @ts-ignore
    ws.send(
      JSON.stringify({
        secret: "usn",
        filter: usnFilters,
        fetch_past_events: 50,
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
};

// to support batch mint / burn, we process every event data
const processEvent = (event: SocketEvent): UsnEvent[] => {
  const usnEvents: UsnEvent[] = [];
  event.event.data.forEach((singleEventData) => {
    usnEvents.push({
      time: new Date(parseFloat(event.block_timestamp) / 1e6),
      event: event.event.event.substring(3), // remove the ft_ to only display mint / burn
      index: globalIndex++,
      owner_id: singleEventData.owner_id || singleEventData.old_owner_id,
      amount: singleEventData.amount,
    });
  });
  return usnEvents;
};

const App = () => {
  const [usnEvents, setUsnEvents] = useState<UsnEvent[]>([]);
  const [filterUserAccountId, setFilterUserAccountId] = useState("");
  const [filterEvents, setFilterEvents] = useState<string[]>([
    "ft_mint",
    "ft_burn",
  ]);

  useEffect(() => {
    const processEvents = (socketEvents: SocketEvent[]) => {
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

  // check if any filter needs to be applied, only activate after filterAccountId change
  useEffect(() => {
    // if (filterUserAccountId === "" && filterEvents) {
    //   return;
    // }
    usnFilters = [];
    filterEvents.map((filterEvent) => {
      const filter = getNoEventFilter();
      addEventToFilter(filter, filterEvent);
      usnFilters.push(filter);
    });
    if (filterUserAccountId !== "") {
      usnFilters.map((filter) =>
        addUserIdToFilter(filter, filterUserAccountId)
      );
    }
    if (filterTypingTimeout) {
      clearTimeout(filterTypingTimeout);
      filterTypingTimeout = null;
    }
    filterTypingTimeout = setTimeout(() => {
      if (ws) {
        setUsnEvents([]);
        ws.close();
      }
    }, 1000);
  }, [filterUserAccountId, filterEvents]);

  const defaultOptions = [
    { value: "ft_mint", label: "Mint" },
    { value: "ft_burn", label: "Burn" },
  ];

  const allOptions = [
    { value: "ft_mint", label: "Mint" },
    { value: "ft_burn", label: "Burn" },
    { value: "ft_transfer", label: "Transfer" },
  ];

  const handleSelect = (
    options: MultiValue<{ value: string; label: string }>
  ) => {
    const events = options.flatMap((option) => option.value);
    setFilterEvents(events);
  };

  return (
    <div className="container">
      <h1>USN Live feed</h1>
      <div className="row justify-content-md-center">
        <div className="col-auto">
          <label className="col-form-label" htmlFor="eventTypeFilter">
            Select event type:
          </label>
        </div>
        <div className="col">
          <Select
            className="react-select"
            id="eventTypeFilter"
            options={allOptions}
            defaultValue={defaultOptions}
            onChange={handleSelect}
            isMulti
          />
        </div>
      </div>
      <div className="row justify-content-md-center">
        <div className="col-auto">
          <label className="col-form-label" htmlFor="accountIdFilter">
            Filter by user account ID:
          </label>
        </div>
        <div className="col">
          <input
            className="form-control"
            type="text"
            id="accountIdFilter"
            placeholder="Account ID"
            value={filterUserAccountId || ""}
            onChange={(e) => setFilterUserAccountId(e.target.value)}
          />
        </div>
      </div>
      {/* add filter by amount, like only display event greater than x USD */}
      {/* <div className="row justify-content-md-center">
        <div className="col-auto">
          <label className="col-form-label" htmlFor="amountFilter">
            Filter by token amount greater than :
          </label>
        </div>
        <div className="col">
          <input
            className="form-control"
            type="text"
            id="accountIdFilter"
            placeholder="Amount"
            value={filterAmountGreaterThan || ""}
            onChange={(e) => setFilterAmountGreaterThan(e.target.value)}
          />
        </div>
      </div> */}
      <div className="table-responsive">
        <table className="table align-middle">
          <tbody>
            {usnEvents.map((usnEvent) => {
              return (
                <tr key={usnEvent.index}>
                  <td className="col-1">
                    <TimeAgo datetime={usnEvent.time} />
                  </td>
                  <td className="col-3">
                    <SocialAccount accountId={usnEvent.owner_id} clickable />
                  </td>
                  <td className="col-3">{usnEvent.event}</td>
                  <td className="col-1 text-end">
                    {bigToString(Big(usnEvent.amount).div(Big(10).pow(18)))} USN
                  </td>
                  {/* TODO: add spend / receive how much near */}
                  {/* TODO: add exchange rate, like 1 near = 3.x usn */}
                  {/* TODO: add whale alert symbol if amount > x */}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default App;
