import { CacheProvider } from "@emotion/react";
import cssText from "data-text:~style.css";
import { Box, Button, TextField } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import createCache from "@emotion/cache";
import type { PlasmoCSConfig } from "plasmo";
import CircularProgressWithLabel from "~components/uiparts/CircularProgressWithLabel";
import toastCss from "data-text:react-toastify/dist/ReactToastify.css";
import { toast, ToastContainer } from "react-toastify";
import { useStorage } from "@plasmohq/storage/hook";

const buttonSelector = "#__next > div > div > div > div > button";
const styleElement = document.createElement("style");

const styleCache = createCache({
  key: "plasmo-mui-cache",
  prepend: true,
  container: styleElement,
});

export const getStyle = () => {
  const tailwindcssStyle = document.createElement("style");
  const toastcssStyle = document.createElement("style");
  tailwindcssStyle.textContent = cssText;
  toastcssStyle.textContent = toastCss;
  styleElement.appendChild(tailwindcssStyle);
  styleElement.appendChild(toastcssStyle);
  return styleElement;
};

const MenuList = () => {
  const [defaultValue] = useStorage("defaultValue");
  const [shortcutKey] = useStorage("shortcutKey");
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const insideRef = useRef<HTMLDivElement>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentProcess, setCurrentProcess] = useState(0);
  const [maxGenerateNum, setMaxGenerateNum] = useState(0);
  const abortSignal = useRef(false);
  const textFieldRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setMaxGenerateNum(defaultValue);
    const el = insideRef.current;
    if (!el) return;
    const hundleClickOutside = (e: MouseEvent) => {
      if (!e.composedPath().includes(insideRef.current) && e.isTrusted) {
        setOpen(false);
      }
    };
    const menuKeyEvent = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
      if (event.key === shortcutKey) {
        setOpen((prev) => {
          if (prev === false) {
            setTimeout(() => textFieldRef.current.focus(), 200);
          }
          return !prev;
        });
      }
    };
    document.addEventListener("keydown", menuKeyEvent);
    document.addEventListener("click", hundleClickOutside);
    return () => {
      document.removeEventListener("click", hundleClickOutside);
      document.removeEventListener("keydown", menuKeyEvent);
    };
  }, [defaultValue, shortcutKey]);
  const onClickGenerate = () => {
    setIsProcessing(true);
    let count = 0;
    abortSignal.current = false;
    const timer = setInterval(() => {
      const button = document.querySelector(
        buttonSelector,
      ) as HTMLButtonElement;
      if (abortSignal.current) {
        count = maxGenerateNum;
      }
      if (!button.disabled) {
        if (count === maxGenerateNum) {
          setIsProcessing(false);
          clearInterval(timer);
          toast.success("generation finished!");
          return;
        }
        button.click();
        setCurrentProcess(count);
        count++;
      }
    }, 300);
  };
  return (
    <CacheProvider value={styleCache}>
      <div ref={insideRef}>
        <Box className="relative" ref={ref}>
          <Button
            className="fixed w-fit top-0 left-1/3 text-sm text-slate-100 bg-deep-blue px-4 py-2 z-40 hover:opacity-100 hover:bg-opacity-100 hover:bg-slate-900 transition duration-200"
            onClick={() => setOpen((prev) => !prev)}
            sx={{ textTransform: "none" }}
          >
            {open ? "Close" : "Open"}
          </Button>
          <Box
            className={
              "bg-deep-blue text-slate-100 left-[450px] fixed h-[240px] w-96 border border-slate-700" +
              (open
                ? " visible duration-300"
                : " invisible -translate-y-[240px] duration-300")
            }
          >
            <Box>
              <form
                className="px-4 pt-8 flex flex-col"
                onSubmit={(e) => {
                  e.preventDefault();
                  onClickGenerate();
                  return false;
                }}
              >
                <div>
                  <TextField
                    type="number"
                    name="generate-count"
                    className="text-slate-800 bg-slate-50 rounded-sm w-full"
                    onChange={(e) => {
                      setMaxGenerateNum(parseInt(e.currentTarget.value, 10));
                    }}
                    value={maxGenerateNum}
                    disabled={isProcessing}
                    inputRef={textFieldRef}
                    inputProps={{
                      inputmode: "numeric",
                      pattern: "[0-9]*",
                    }}
                  ></TextField>
                </div>
                <div className="flex flex-row justify-around">
                  <Button
                    className="px-4 py-2 my-4 bg-yellow-100 text-slate-800 rounded-sm font-bold disabled:opacity-70 hover:opacity-70 hover:bg-yellow-100 transition duration-200"
                    disabled={isProcessing}
                    type="submit"
                  >
                    Generate
                  </Button>
                  <Button
                    className="px-4 py-2 my-4 bg-yellow-100 text-slate-800 rounded-sm font-bold disabled:opacity-70 hover:opacity-70 hover:bg-yellow-100 transition duration-200"
                    onClick={() => (abortSignal.current = true)}
                    disabled={!isProcessing}
                  >
                    Abort
                  </Button>
                </div>
              </form>
              <div className="h-10 w-full flex flex-row justify-center">
                {isProcessing && (
                  <CircularProgressWithLabel
                    value={
                      maxGenerateNum === 0
                        ? 0
                        : (100 * currentProcess) / maxGenerateNum
                    }
                  />
                )}
              </div>
            </Box>
          </Box>
        </Box>
      </div>
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </CacheProvider>
  );
};

export const config: PlasmoCSConfig = {
  matches: ["https://novelai.net/*"],
  all_frames: true,
};

export default MenuList;
