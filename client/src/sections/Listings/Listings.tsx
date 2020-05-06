import React, { useState, useEffect } from "react";
import {
  ListingData,
  DeleteListingData,
  DeleteListingVariables,
  Listing,
} from "./types";
import { useQuery } from "../../lib/api/useQuery";
import { useMutation } from "../../lib/api/useMutation";

const LISTINGS = `
  query Listings {
    listings {
      id
      title
      image
      address
      price
      numOfGuests
      numOfBeds
      numOfBaths
      rating
    }
  }
`;

const DELETE_LISTING = `
mutation DeleteListing ($id: ID!){
  deleteListing(id: $id) {
    id
  }
}`;

interface Props {
  title: string;
}

export const Listings = ({ title }: Props) => {
  const { data, refetch, loading, error } = useQuery<ListingData>(LISTINGS);

  const [
    deleteListing,
    { loading: deleteListingLoading, error: deleteListingError },
  ] = useMutation<DeleteListingData, DeleteListingVariables>(DELETE_LISTING);

  const handleDeleteListing = async (id: string) => {
    await deleteListing({ id })
    refetch();
  };

  const listings = data ? data.listings : null;

  const listingsList = listings ? (
    <ul>
      {listings.map((listing) => {
        return (
          <li key={listing.id}>
            {listing.title}
            <button onClick={() => handleDeleteListing(listing.id)}>
              Delete
            </button>
          </li>
        );
      })}
    </ul>
  ) : null;

  if (loading) {
    return <h2>Loading...</h2>;
  }

  if (error) {
    return <h2>Uh Oh! Something went wrong - please try again later :(</h2>;
  }

  const deleteListingLoadingMessage = deleteListingLoading ? 
    (
      <h4>Deletion in progress...</h4>
  ) : null

  const deleteListingErrorMessage = deleteListingError ? 
    (
      <h4>Uh Oh! Something went wrong with deleting - please try again later :(</h4>
    ) : null
  
  
  return (
    <div>
      <h2>{title}</h2>
      {listingsList}
      {deleteListingLoadingMessage}
      {deleteListingErrorMessage}
    </div>
  );
};
