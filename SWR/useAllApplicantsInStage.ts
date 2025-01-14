import axios from "axios";
import useSWR from "swr";
import StagesService from "../Adapters/StagesService";

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

export default function useAllApplicantsInStage(
  openingId?: string,
  stageId?: string
) {
  const shouldFetch = openingId && stageId ? true : false;
  const { data, error } = useSWR(
    // @ts-ignore TODO
    shouldFetch && StagesService.getAllApplicantsInStageURL(stageId),
    fetcher
  );

  return {
    applicants: data,
    isApplicantsLoading: !error && !data,
    isApplicantsError: error,
  };
}
