import useSelf from "../../../../../SWR/useSelf";
import EmptyStagesState from "../../../../../components/Stages/EmptyStagesState";
import { useEffect } from "react";
import { useRouter } from "next/router";
import useStore from "../../../../../utils/store";
import StagesHeader from "../../../../../components/Stages/StagesHeader";
import StageCarousel from "../../../../../components/Stages/StagesCarousel";
import useAllApplicantsInStage from "../../../../../SWR/useAllApplicantsInStage";
import useAllStagesInOpening from "../../../../../SWR/useAllStagesInOpening";
import ApplicantList from "../../../../../components/Applicants/ApplicantList";
import ApplicantProfileModal from "../../../../../components/Applicants/ApplicantProfileModal";
import NewPage from "../../../../../components/Templates/NewPage";
import useOpeningById from "../../../../../SWR/useOpeningById";
import NumberFormat from "react-number-format";
import { CUSTOM_QUERY } from "../../../../../types/main";
export default function StageApplicants() {
  const router = useRouter();
  const { openingId, stageId } = router.query as Pick<
    CUSTOM_QUERY,
    "openingId" | "stageId"
  >;
  let { opening, isOpeningLoading, isOpeningError } = useOpeningById(openingId);

  const { stages, isStagesLoading, isStagesError } = useAllStagesInOpening(
    opening?.openingId
  );
  // Allows for copying the URL of the applicant directly directly
  useEffect(() => {
    if (!router.isReady) return;
    const { applicantId } = router.query as Pick<CUSTOM_QUERY, "applicantId">;

    if (applicantId && typeof applicantId === "string" && applicantId !== "") {
      setApplicantProfileModal({
        ...applicantProfileModal,
        isModalOpen: true,
      });
    }
  }, [router.isReady]);

  const { applicants, isApplicantsLoading, isApplicantsError } =
    useAllApplicantsInStage(openingId, stageId);

  const setApplicantProfileModal = useStore(
    (store) => store.setApplicantProfileModal
  );

  const applicantProfileModal = useStore(
    (store) => store.applicantProfileModal
  );

  return (
    <NewPage
      loggedOutPageText={"Log in to view your applicants"}
      currentNavbarItem={"Openings"}
      headerText={
        isOpeningLoading ? (
          "Applicants"
        ) : (
          <span>
            {opening.GSI1SK} - Applicants (
            <NumberFormat
              value={opening.totalApplicants}
              thousandSeparator={true}
              displayType={"text"}
            />
            )
          </span>
        )
      }
    >
      <>
        <ApplicantProfileModal />

        <div className="space-y-10">
          <StagesHeader />
          {stages?.length == 0 ? (
            <EmptyStagesState />
          ) : (
            <div className="space-y-10">
              <StageCarousel />
              <ApplicantList />
            </div>
          )}
        </div>
      </>
    </NewPage>
  );
}
