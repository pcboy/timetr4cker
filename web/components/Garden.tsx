import * as React from "react";

import { Plant } from "./Plant";
import { gardenStore } from "../stores/GardenStore";

import styled from "styled-components";
import { useQuery, useMutation, queryCache } from "react-query";

const SGardens = styled.div``;

const SGarden = styled.div`
  border: 1px solid white;
  width: 90%;
  max-width: 50rem;
  margin: 0 auto;
  margin-top: 5rem;
  padding: 2rem;
`;

export const Garden = ({ id, name, plants }) => {
  return (
    <SGarden>
      <h1>{name}</h1>
      <button className="is-danger">Add a new plant</button>
      {plants.map((p) => (
        <Plant {...p}></Plant>
      ))}
    </SGarden>
  );
};

export const Gardens = () => {
  const { status, data, error, isFetching } = useQuery(
    "gardens",
    gardenStore.loadGardens
  );

  const [mutateCreateGarden] = useMutation(gardenStore.createGarden, {
    onSuccess: (response) => {
      console.log(response);
      queryCache.setQueryData("gardens", [
        ...queryCache.getQueryData("gardens"),
        response,
      ]);
      queryCache.invalidateQueries("gardens");
    },
  });

  if (status === "loading") {
    return <h1>Loading...</h1>;
  }

  if (status === "error") {
    return <h1>{error.message}</h1>;
  }

  return (
    <SGardens>
      {data.length == 0 ? (
        <>
          <div className="has-text-centered">
            <h1>You have no gardens yet.</h1>
            <button onClick={mutateCreateGarden}>Create a new garden</button>
          </div>
        </>
      ) : (
        <>
          <button onClick={mutateCreateGarden}>Create a new garden</button>
          <div className="columns is-multiline">
            {data.map((garden) => (
              <div key={`garden_${garden.id}`} className="column is-12">
                <Garden {...garden}></Garden>
              </div>
            ))}
          </div>
        </>
      )}
    </SGardens>
  );
};
