import { useState } from "react";
import { useStorage } from "@plasmohq/storage/hook";
import "~style.css";
import { TextField } from "@mui/material";

function IndexPopup() {
  const [text, setText] = useState("");
  const [defaultValue, setDefaultValue] = useStorage("defaultValue", 0);
  const [shortcutKey, setShortcutKey] = useStorage("shortcutKey", "-");

  return (
    <div className="p-4 w-64">
      <table>
        <tr>
          <td className="w-24">defaultValue</td>
          <td>
            <input
              type="number"
              name="generate-count"
              className="text-slate-800 rounded-sm w-full h-4 bg-slate-200"
              onChange={(e) => {
                setDefaultValue(parseInt(e.currentTarget.value, 10));
              }}
              value={defaultValue}
            ></input>
          </td>
        </tr>
        <tr>
          <td className="w-24">shortcutKey</td>
          <td>
            <input
              type="text"
              name="short-cut-key"
              className="text-slate-800 bg-slate-200 rounded-sm w-full h-4"
              onKeyDown={(event) => {
                if (event.key.length === 1) {
                  setShortcutKey(event.key);
                }
              }}
              value={shortcutKey}
            ></input>
          </td>
        </tr>
      </table>
    </div>
  );
}

export default IndexPopup;
