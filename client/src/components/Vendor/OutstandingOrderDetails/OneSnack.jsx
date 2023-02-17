import { useQuery } from "react-query";
import { getSnackDetails } from "../../../actions/index";
import "./OneSnack.css";
import CircularProgress from "@material-ui/core/CircularProgress";

const OneSnack = ({ snackId }) => {
  const snackQuery = useQuery(["snack", snackId], () =>
    getSnackDetails(snackId)
  );
  const { data: oneSnack, isLoading, error } = snackQuery;

  return (
    <div className="item-snack-name">
      {error && <div>Error</div>}
      {isLoading && <CircularProgress className="spinner" />}
      {/* render the snack name when it is ready */}
      {oneSnack && oneSnack.name}
    </div>
  );
};

export default OneSnack;
