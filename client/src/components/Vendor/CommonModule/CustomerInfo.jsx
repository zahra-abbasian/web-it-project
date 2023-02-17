import { useQuery } from "react-query";
import { getCustomerInfo } from "../../../actions/index";
import CircularProgress from "@material-ui/core/CircularProgress";

const CustomerInfo = ({ customerId }) => {
  const customerInfoQuery = useQuery([customerId, "customerInfo"], () =>
    getCustomerInfo(customerId)
  );
  const { data: customerInfo, isLoading, error } = customerInfoQuery;

  return (
    <div>
      {/* get, error handling and loading of customer component */}
      {error && <div>Error</div>}
      {isLoading && <CircularProgress className="spinner" />}
      {customerInfo && customerInfo.name}
    </div>
  );
};

export default CustomerInfo;
