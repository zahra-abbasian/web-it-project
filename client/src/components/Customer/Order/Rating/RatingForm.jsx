import React, { useState } from "react";
import "../OrderPage.css";
import { createRating } from "../../../../actions/index";
import { useMutation } from "react-query";
import Rating from "@material-ui/lab/Rating";
import { useHistory } from "react-router";
import "./RatingForm.css";

// not being used at this stage as orders cannot be completed
const RatingForm = ({ orderId, onFinishedChange }) => {
  const [value, setValue] = useState(3);
  const [comment, setComment] = useState("");
  const history = useHistory();

  // submit a rating to db and complete the order
  const mutation = useMutation(async () => {
    try {
      await createRating(comment, value, orderId);
      window.localStorage.setItem("currentOrder", null);
      history.push("/menu");
    } catch (e) {
      console.log(e);
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate();
    // send message to OrderPage component that the user has submitted the form
    onFinishedChange(true);
  };

  const handleNotNow = () => {
    // send message to OrderPage component the user has clicked not now
    onFinishedChange(true);
    window.localStorage.setItem("currentOrder", null);
    history.push("/menu");
  };

  return (
    <div className="rating-modal">
      <div className="rating-desc">Thank you for ordering with us!</div>
      <div className="rating-text">Rate your order</div>
      <form className="rating-form" onSubmit={handleSubmit}>
        <Rating
          size="large"
          value={value}
          precision={1}
          style={{
            padding: "1rem",
            alignItems: "center",
            display: "flex",
            justifyContent: "center",
          }}
          onChange={(_, newValue) => {
            setValue(newValue);
          }}
        />
        <textarea
          className="rating-details"
          type="text"
          placeholder="Optional.."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        <div className="modal-buttons">
          <button onClick={handleNotNow}>Not Now</button>
          <button>Submit</button>
        </div>
      </form>
    </div>
  );
};

export default RatingForm;
