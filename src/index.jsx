/*** APP ***/
import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import {
  ApolloClient,
  ApolloProvider,
  InMemoryCache,
  gql,
  useLazyQuery,
} from "@apollo/client";

import { link } from "./link.js";
import "./index.css";

const ALL_PEOPLE = gql`
  query AllPeople {
    people {
      id
      name
    }
  }
`;

function App() {
  const [onCompletedCount, setOnCompletedCount] = useState(0);
  const [people, setPeople] = useState([]);
  const [load, { loading, data }] =
    useLazyQuery(ALL_PEOPLE, {
    fetchPolicy: "cache-and-network",
    onCompleted: (data) => {
      setPeople(data.people);
      setOnCompletedCount((prev) => prev + 1 ) }
  });

  return (
    <main>
      <h1>Apollo Client Issue Reproduction</h1>
      <p>
        This application can be used to demonstrate an error in Apollo Client.
      </p>
      <div className="add-person">
        <button
          onClick={() => {
            setPeople([]);
            load();
          }}
        >
          Run Query
        </button>
      </div>
      <h2>onCompleted Count</h2>
      <p>{onCompletedCount}</p>
      <h2>Names</h2>
      {loading && (
        <p>Loading…</p>
      )}
      <ul>
        {people?.map(person => (
          <li key={person.id}>{person.name}</li>
        ))}
      </ul>
    </main>
  );
}

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link
});

const container = document.getElementById("root");
const root = createRoot(container);
root.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>
);
