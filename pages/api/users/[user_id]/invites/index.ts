import { GetAllOrgInvites } from "../../../../../utils/invites/getAllOrgInvites";
import withAuthorizer from "../../../../../middleware/withAuthorizer";
import { NextApiResponse } from "next";

const handler = async (req: CustomRequest, res: NextApiResponse) => {
  const { method } = req;
  const user: DynamoUser = req.user;

  if (method === "GET") {
    try {
      const invites = await GetAllOrgInvites(user.user_id);
      return res.status(200).json(invites);
    } catch (error) {
      // TODO add error logger
      return res
        .status(400) // TODO change #
        .json({ message: `${error}` });
    }
  }

  return res.status(405).json({ message: "Not Allowed" });
};

export default withAuthorizer(handler);