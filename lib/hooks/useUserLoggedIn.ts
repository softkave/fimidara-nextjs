import { useSelector } from "react-redux";
import UserSessionStorageFns from "../storage/userSession";
import SessionSelectors from "../store/session/selectors";

export default function useUserLoggedIn() {
  const tokenFromStore = useSelector(SessionSelectors.getUserToken);
  const tokenFromLocalStorage = UserSessionStorageFns.getUserToken();
  return tokenFromStore || tokenFromLocalStorage;
}
