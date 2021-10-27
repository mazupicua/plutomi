import { NextApiResponse } from "next";
import DeleteApplicant from "../../../../utils/applicants/deleteApplicant";
import withSession from "../../../../middleware/withSession";

// TODO remove this
const handler = async (
  req: NextIronRequest,
  res: NextApiResponse
): Promise<void> => {
  const user_session = req.session.get("user");
  if (!user_session) {
    req.session.destroy();
    return res.status(401).json({ message: "Please sign in again" });
  }
  const { method, query } = req;
  const { applicant_id } = query as CustomQuery;

  if (method === "GET") {
    try {
      await DeleteApplicant({
        org_id: user_session.org_id,
        applicant_id: applicant_id,
      });
      return res.status(200).json({ message: "Applicant deleted!" });
    } catch (error) {
      return res
        .status(500)
        .json({ message: `Unable to delete applicant - ${error}` });
    }
  }
  return res.status(405).json({ message: "Not Allowed" });
};

export default withSession(handler);