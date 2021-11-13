import withCleanOrgId from "../../../../../middleware/withCleanOrgId";
import { GetOrg } from "../../../../../utils/orgs/getOrg";
import { NextApiResponse } from "next";
import CleanOrg from "../../../../../utils/clean/cleanOrg";
// This returns limited public information about an org
const handler = async (req: CustomRequest, res: NextApiResponse) => {
  const { method, query } = req;
  const { orgId } = query;

  if (method === "GET") {
    try {
      const org = await GetOrg(orgId);

      if (!org) {
        return res.status(404).json({ message: "Org not found" });
      }

      const cleanOrg = CleanOrg(org);

      return res.status(200).json(cleanOrg);
    } catch (error) {
      // TODO add error logger
      return res
        .status(400) // TODO change #
        .json({ message: `Unable to retrieve org: ${error}` });
    }
  }

  return res.status(405).json({ message: "Not Allowed" });
};

export default withCleanOrgId(handler);