// Retrieves a specific opening by ID
import axios from "axios";
import useSWR from "swr";
import PublicInfoService from "../adapters/PublicInfoService";
const fetcher = (url: string) => axios.get(url).then((res) => res.data);

function usePublicApplicant(applicant_id: string) {
  // Despite removing the query string (applicant id) from the URl, this still runs before changing to null
  const shouldFetch =
    applicant_id && applicant_id !== "" && typeof applicant_id === "string"
      ? true
      : false;

  const { data, error } = useSWR(
    shouldFetch && PublicInfoService.getPublicApplicantURL({ applicant_id }),
    fetcher
  );

  return {
    applicant: data,
    isApplicantLoading: !error && !data,
    isApplicantError: error,
  };
}

export default usePublicApplicant;
