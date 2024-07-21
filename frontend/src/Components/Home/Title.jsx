import React, { useEffect, useState } from "react";
import style from "../../Styles/landingpage.module.css";

function Title() {
  const [title, setTitle] = useState("");

  const titleList = "<Code>Collab";

  useEffect(() => {
    async function buildTitle() {
      let i = 1;
      for (const char of titleList) {
        i += 1;
        setTitle(titleList.slice(0, i));
        await new Promise((resolve) =>
          setTimeout(resolve, Math.random() * 400 + 100)
        );
      }
    }

    buildTitle();
    return () => setTitle("");
  }, []);

  return (
    <h1>
      {title}
      <span className={style.blinking}>_</span>
    </h1>
  );
}

export default Title;
