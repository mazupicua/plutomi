import { NextApiResponse } from "next";
import { GetAllQuestionsInStage } from "../../../../../../../utils/questions/getAllQuestionsInStage";
import withCleanOrgId from "../../../../../../../middleware/withCleanOrgId";
const handler = async (req: CustomRequest, res: NextApiResponse) => {
  const { method, query } = req;
  const { orgId, stageId } = query as CustomQuery;

  if (method === "GET") {
    try {
      const questions = await GetAllQuestionsInStage({
        orgId,
        stageId,
      });

      // TODO add filter here for public / private questions
      return res.status(200).json(questions);
    } catch (error) {
      return res.status(500).json({ message: "Unable to retrieve questions" });
    }
  }
  return res.status(405).json({ message: "Not Allowed" });
};

export default withCleanOrgId(handler);