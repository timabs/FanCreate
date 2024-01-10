//custom hook for useActiveScreen as I'm using that hook often in App.js
// useActiveScreen.js
import { useSelector } from "react-redux";

const useActiveScreen = () => {
  const activeScreen = useSelector((state) => state.active.activeScreen);
  return activeScreen;
};

export default useActiveScreen;
