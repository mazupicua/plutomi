import OpeningList from "./OpeningsList";
import { useSession } from "next-auth/client";
import useOpenings from "../../SWR/useOpenings";
import { PlusIcon } from "@heroicons/react/outline";
import { useRouter } from "next/router";
import { mutate } from "swr";
import StageReorderColumn from "../StageReorderColumn";

import { GetRelativeTime } from "../../utils/time";
import difference from "../../utils/getObjectDifference";
import Link from "next/dist/client/link";
import StageCard from "../Stages/StageCard";
import { useEffect } from "react";
import OpeningModal from "./OpeningModal";
import axios from "axios";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import DraggableStageCard from "../../components/Stages/DraggableStageCard";
import Loader from "../Loader";
import useUser from "../../SWR/useUser";
import { useState } from "react";
import useStore from "../../utils/store";
import useAllStagesInOpening from "../../SWR/useAllStagesInOpening";
import useOpeningById from "../../SWR/useOpeningById";
import StageModal from "../Stages/StageModal";
export default function OpeningSettingsContent() {
  const router = useRouter();
  const { opening_id } = router.query;
  const [session, loading]: [CustomSession, boolean] = useSession();
  const { user, isUserLoading, isUserError } = useUser(session?.user_id);
  let { opening, isOpeningLoading, isOpeningError } = useOpeningById(
    user?.user_id,
    opening_id as string
  );

  let { stages, isStagesLoading, isStagesError } = useAllStagesInOpening(
    session?.user_id,
    opening?.opening_id
  );

  const stageModal = useStore((state: PlutomiState) => state.stageModal);
  const setStageModal = useStore((state: PlutomiState) => state.setStageModal);

  const openingModal = useStore((state: PlutomiState) => state.openingModal);
  const setOpeningModal = useStore(
    (state: PlutomiState) => state.setOpeningModal
  );
  const [new_stages, setNewStages] = useState(stages);
  const [isStageOrderUpdating, setIsStageOrderUpdating] = useState(false);
  const [isQuestionOrderUpdating, setIsQuestionOrderUpdating] = useState(false);
  useEffect(() => {
    setNewStages(stages);
  }, [stages]);

  if (isOpeningLoading) {
    return <Loader text="Loading opening..." />;
  }

  if (isStagesLoading) {
    return <Loader text="Loading stages..." />;
  }

  const updateOpening = async () => {
    try {
      // Get the difference between the opening returned from SWR
      // And the opening modal inputs / edits
      const diff = difference(opening, openingModal);

      // Delete the two modal controlling keys
      delete diff["is_modal_open"];
      delete diff["modal_mode"];
      const body = {
        updated_opening: diff,
      };

      console.log("Outgoing body", body);

      const { data } = await axios.put(
        `/api/openings/${openingModal.opening_id}`,
        body
      );
      alert(data.message);
      setOpeningModal({
        is_modal_open: false,
        modal_mode: "CREATE",
        is_public: false,
        opening_id: "",
        GSI1SK: "",
      });
    } catch (error) {
      alert(error.response.data.message);
    }
    // Refresh opening data
    mutate(`/api/openings/${openingModal.opening_id}`);
  };

  return (
    <>
      {/* 3 column wrapper */}
      <div className="flex-grow w-full max-w-7xl mx-auto xl:px-8 lg:flex">
        {/* Left sidebar & main wrapper */}
        <OpeningModal updateOpening={updateOpening} />
        <div className="flex-1 min-w-0 bg-white xl:flex">
          <div className="border-b border-gray-200 xl:border-b-0 xl:flex-shrink-0 xl:w-64 xl:border-r xl:border-gray-200 bg-white">
            <div className="h-full pl-4 pr-6 py-6 sm:pl-6 lg:pl-8 xl:pl-0">
              {/* Start left column area */}
              <StageReorderColumn />
              {/* End left column area */}
            </div>
          </div>

          <div className="bg-white lg:min-w-0 lg:flex-1">
            <div className="h-full py-6 px-4 sm:px-6 lg:px-8">
              {/* Start main area*/}
              <div className="relative h-full" style={{ minHeight: "36rem" }}>
                <div className=" inset-0  border-gray-200 rounded-lg">
                  <div className="flex flex-col justify-center items-center">
                    <h1 className="text-center text-2xl font-semibold mb-4">
                      {opening?.GSI1SK} Settings
                    </h1>
                    <div className="flex justify-center space-x-4 py-2 items-center">
                      <span
                        className={` inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium ${
                          opening?.is_public
                            ? "bg-green-100"
                            : "bg-blue-gray-100"
                        }`}
                      >
                        <svg
                          className={`-ml-0.5 mr-1.5 h-2 w-2 ${
                            opening?.is_public
                              ? "text-green-800"
                              : "text-blue-gray-800"
                          }`}
                          fill="currentColor"
                          viewBox="0 0 8 8"
                        >
                          <circle cx={4} cy={4} r={3} />
                        </svg>
                        {opening?.is_public ? "Public" : "Private"}
                      </span>
                      <p className="text-md text-light text-center">
                        Created {GetRelativeTime(opening?.created_at)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              {/* End main area */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}