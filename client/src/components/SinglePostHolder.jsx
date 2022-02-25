import React from "react";
import { useParams } from "react-router-dom";
import SinglePost from "./SinglePost";

const SinglePostHolder = () => {
  const { id } = useParams();

  return (
    <div>
      <SinglePost id={id} />
    </div>
  );
};

export default SinglePostHolder;
