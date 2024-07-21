import React from "react";

import style from "../../Styles/authforms.module.css";

function ErrorMessage({ text, error }) {
  return (
    <div
      className={`${style.message} ${
        error ? style.errorMessage : style.successMessage
      }`}
    >
      {text}
    </div>
  );
}

export default ErrorMessage;
